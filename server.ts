import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia" as any, // Using any to bypass strict version check if needed, or adjust to "2026-01-28.clover" if that's what the types want
});

// Initialize Supabase with Service Role Key for backend operations
const supabase = createClient(
  process.env.SUPABASE_URL || "https://gpkopzpsdurmywxqlfae.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function startServer() {
  // Stripe Webhook Endpoint (MUST be before any other body parser)
  app.post(
    "/api/webhooks/stripe",
    bodyParser.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        if (!sig || !webhookSecret) {
          throw new Error("Missing stripe-signature or webhook secret");
        }
        event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Extract relevant data
      const eventType = event.type;
      const eventData = event.data.object;
      const eventId = event.id;

      console.log(`Processing Stripe event: ${eventType} (${eventId})`);

      try {
        // 1. Save raw event to Supabase for audit
        const { error: logError } = await supabase.from("stripe_webhooks").insert([
          {
            event_id: eventId,
            type: eventType,
            payload: eventData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (logError) {
          console.error("Error logging webhook to Supabase:", logError);
        }

        // 2. Handle specific event types
        switch (eventType) {
          case "payment_intent.succeeded":
            const paymentIntent = eventData as Stripe.PaymentIntent;
            console.log(`PaymentIntent was successful: ${paymentIntent.id}`);
            break;

          case "checkout.session.completed":
            const session = eventData as Stripe.Checkout.Session;
            const businessId = session.client_reference_id;
            
            if (businessId) {
              console.log(`Checkout completed for business: ${businessId}`);
              
              const planType = session.metadata?.plan_type || 'PRO';
              const customerId = session.customer as string;
              const subscriptionId = session.subscription as string;
              
              const { error: updateError } = await supabase
                .from("business_settings")
                .update({ 
                  plan_type: planType,
                  subscription_status: 'ACTIVE',
                  stripe_customer_id: customerId,
                  stripe_subscription_id: subscriptionId,
                  updated_at: new Date().toISOString()
                })
                .eq("id", businessId);

              if (updateError) {
                console.error(`Error updating business ${businessId}:`, updateError);
              }
            }
            break;

          case "customer.subscription.updated":
            const updatedSub = eventData as Stripe.Subscription;
            console.log(`Subscription updated: ${updatedSub.id} (status: ${updatedSub.status})`);
            
            const newStatus = updatedSub.status === 'active' ? 'ACTIVE' : 'EXPIRED';
            
            await supabase
              .from("business_settings")
              .update({ 
                subscription_status: newStatus,
                updated_at: new Date().toISOString()
              })
              .eq("stripe_subscription_id", updatedSub.id);
            break;

          case "customer.subscription.deleted":
            const deletedSub = eventData as Stripe.Subscription;
            console.log(`Subscription deleted: ${deletedSub.id}`);
            
            await supabase
              .from("business_settings")
              .update({ 
                subscription_status: 'EXPIRED',
                plan_type: 'START',
                updated_at: new Date().toISOString()
              })
              .eq("stripe_subscription_id", deletedSub.id);
            break;

          default:
            console.log(`Unhandled event type ${eventType}`);
        }

        res.json({ received: true });
      } catch (dbError) {
        console.error("Database Error:", dbError);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // Regular JSON body parser for other routes
  app.use(express.json());

  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
