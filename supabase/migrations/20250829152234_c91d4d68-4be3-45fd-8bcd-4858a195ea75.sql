-- Fix RLS security issues by enabling RLS on existing tables

-- Enable RLS on existing tables
ALTER TABLE public.cross_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engin_filtre_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filtres ENABLE ROW LEVEL SECURITY;

-- Create policies for cross_references
CREATE POLICY "Allow all operations on cross_references" 
ON public.cross_references FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create policies for engin_filtre_compatibility
CREATE POLICY "Allow all operations on engin_filtre_compatibility" 
ON public.engin_filtre_compatibility FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create policies for engins
CREATE POLICY "Allow all operations on engins" 
ON public.engins FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create policies for filtres
CREATE POLICY "Allow all operations on filtres" 
ON public.filtres FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Fix search_path issue for the update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;