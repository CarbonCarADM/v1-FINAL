-- Table to store Stripe webhook events for audit and processing
CREATE TABLE IF NOT EXISTS public.stripe_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.stripe_webhooks ENABLE ROW LEVEL SECURITY;

-- Only service role can manage this table (backend only)
CREATE POLICY "Service role only" ON public.stripe_webhooks
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
