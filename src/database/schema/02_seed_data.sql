-- Sample Engins
INSERT INTO engins (code, designation, marque, type, heures, statut, derniere_maintenance_preventive, localisation) VALUES
('A03010236', 'BULL SUR CHENILLE', 'Caterpillar', 'D8R', 1250, 'Actif', '2023-05-15', 'Site A'),
('B04020345', 'PELLE HYDRAULIQUE', 'Komatsu', 'PC210', 890, 'Actif', '2023-06-20', 'Site B'),
('C05030456', 'ROULEAU COMPACTEUR', 'Bomag', 'BW120', 450, 'Maintenance', '2023-07-10', 'Site A');

-- Sample Filtres
INSERT INTO filtres (reference_principale, type, fabricant, description, prix, stock, delai_livraison) VALUES
('FLT-001', 'Huile', 'Mann', 'Filtre à huile moteur', 25.99, 15, '2 jours'),
('FLT-002', 'Air', 'K&N', 'Filtre à air haute performance', 45.50, 8, '3 jours'),
('FLT-003', 'Carburant', 'Bosch', 'Filtre à carburant diesel', 18.75, 12, '1 jour');

-- Sample Cross References
INSERT INTO cross_references (filtre_id, reference, fabricant, prix, stock) VALUES
(1, 'OIL-ALT-001', 'Fram', 22.50, 10),
(1, 'OIL-ALT-002', 'Wix', 24.25, 7),
(2, 'AIR-ALT-001', 'AEM', 42.99, 5);

-- Sample Engin-Filter Compatibility
INSERT INTO engin_filtre_compatibility (engin_id, filtre_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 1),
(3, 3);
