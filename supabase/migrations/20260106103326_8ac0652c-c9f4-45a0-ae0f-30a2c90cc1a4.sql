-- Drop existing table and recreate with proper structure
DROP TABLE IF EXISTS public.scan_history;

-- Create scan_history table with all required fields
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('safe', 'suspicious', 'malicious')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  threats TEXT[] NOT NULL DEFAULT '{}',
  details JSONB NOT NULL DEFAULT '{}',
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (no auth required for this app)
CREATE POLICY "Anyone can view scan history" 
ON public.scan_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert scan history" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete scan history" 
ON public.scan_history 
FOR DELETE 
USING (true);