-- Add Stripe integration columns to business_settings
ALTER TABLE public.business_settings 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create index for faster lookups during webhooks
CREATE INDEX IF NOT EXISTS idx_business_stripe_customer ON public.business_settings(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_business_stripe_subscription ON public.business_settings(stripe_subscription_id);
