-- Table pour les gammes d'entretien
CREATE TABLE IF NOT EXISTS gammes_entretien (
  id SERIAL PRIMARY KEY,
  gamme VARCHAR(1) NOT NULL, -- C, D, E, F
  sequence_order INTEGER NOT NULL,
  heures_interval INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour la maintenance préventive
CREATE TABLE IF NOT EXISTS maintenance_preventive (
  id SERIAL PRIMARY KEY,
  engin_id INTEGER NOT NULL REFERENCES engins(id) ON DELETE CASCADE,
  gamme_id INTEGER NOT NULL REFERENCES gammes_entretien(id) ON DELETE CASCADE,
  heures_service INTEGER NOT NULL,
  date_execution TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filtres_remplaces INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des gammes d'entretien
INSERT INTO gammes_entretien (gamme, sequence_order, heures_interval) VALUES
('C', 1, 250),
('D', 2, 500),
('C', 3, 750),
('E', 4, 1000),
('C', 5, 1250),
('D', 6, 1500),
('C', 7, 1750),
('F', 8, 2000)
ON CONFLICT (sequence_order) DO NOTHING;
