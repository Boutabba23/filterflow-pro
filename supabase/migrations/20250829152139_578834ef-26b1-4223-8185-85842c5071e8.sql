-- Create maintenance schedule table (gammes d'entretien)
CREATE TABLE public.gammes_entretien (
  id SERIAL PRIMARY KEY,
  gamme VARCHAR(1) NOT NULL CHECK (gamme IN ('C', 'D', 'E', 'F')),
  sequence_order INTEGER NOT NULL,
  heures_interval INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the maintenance cycle: C,D,C,E,C,D,C,F
INSERT INTO public.gammes_entretien (gamme, sequence_order, heures_interval) VALUES
('C', 1, 500),
('D', 2, 1000),
('C', 3, 1500),
('E', 4, 2000),
('C', 5, 2500),
('D', 6, 3000),
('C', 7, 3500),
('F', 8, 4000);

-- Create maintenance preventive records table
CREATE TABLE public.maintenance_preventive (
  id SERIAL PRIMARY KEY,
  engin_id INTEGER REFERENCES public.engins(id) ON DELETE CASCADE,
  gamme_id INTEGER REFERENCES public.gammes_entretien(id) ON DELETE RESTRICT,
  heures_service INTEGER NOT NULL,
  date_execution DATE DEFAULT CURRENT_DATE,
  filtres_remplaces INTEGER[], -- Array of filter IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_gammes_entretien_updated_at
  BEFORE UPDATE ON public.gammes_entretien
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_preventive_updated_at
  BEFORE UPDATE ON public.maintenance_preventive
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.gammes_entretien ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_preventive ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for authenticated users for now)
CREATE POLICY "Allow all operations on gammes_entretien" 
ON public.gammes_entretien FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on maintenance_preventive" 
ON public.maintenance_preventive FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);