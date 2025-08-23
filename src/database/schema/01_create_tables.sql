-- Engins (Machines)
CREATE TABLE engins (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  designation VARCHAR(255) NOT NULL,
  marque VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  heures INTEGER DEFAULT 0,
  statut VARCHAR(50) DEFAULT 'Actif',
  derniere_maintenance_preventive DATE,
  prochaine_maintenance DATE,
  localisation VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Filtres (Filters)
CREATE TABLE filtres (
  id SERIAL PRIMARY KEY,
  reference_principale VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  fabricant VARCHAR(100) NOT NULL,
  description TEXT,
  prix DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  delai_livraison VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cross References (Filter Cross References)
CREATE TABLE cross_references (
  id SERIAL PRIMARY KEY,
  filtre_id INTEGER REFERENCES filtres(id) ON DELETE CASCADE,
  reference VARCHAR(50) NOT NULL,
  fabricant VARCHAR(100) NOT NULL,
  prix DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Engin-Filter Compatibility
CREATE TABLE engin_filtre_compatibility (
  id SERIAL PRIMARY KEY,
  engin_id INTEGER REFERENCES engins(id) ON DELETE CASCADE,
  filtre_id INTEGER REFERENCES filtres(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(engin_id, filtre_id)
);
