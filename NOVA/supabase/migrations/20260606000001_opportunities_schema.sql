-- Create ENUM for opportunity categories
CREATE TYPE opportunity_category AS ENUM (
  'hackathon',
  'internship',
  'workshop',
  'conference',
  'scholarship',
  'open-source'
);

-- Create Opportunities table
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category opportunity_category NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  apply_url TEXT NOT NULL,
  location TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can read opportunities
CREATE POLICY "Anyone can view opportunities." 
ON public.opportunities 
FOR SELECT 
USING (true);

-- Only admins can insert opportunities
-- In Supabase, if we want to query `profiles` table to check role:
CREATE POLICY "Admins can insert opportunities"
ON public.opportunities
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Only admins can update opportunities
CREATE POLICY "Admins can update opportunities"
ON public.opportunities
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Only admins can delete opportunities
CREATE POLICY "Admins can delete opportunities"
ON public.opportunities
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
