import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEnginSchema, insertFiltreSchema, insertCrossReferenceSchema, insertMaintenancePreventiveSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Engin routes
  app.get("/api/engins", async (req, res) => {
    try {
      const engins = await storage.getEngins();
      res.json(engins);
    } catch (error) {
      console.error("Error fetching engins:", error);
      res.status(500).json({ error: "Failed to fetch engins" });
    }
  });

  app.get("/api/engins/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const engin = await storage.getEngin(id);
      if (!engin) {
        return res.status(404).json({ error: "Engin not found" });
      }
      
      res.json(engin);
    } catch (error) {
      console.error("Error fetching engin:", error);
      res.status(500).json({ error: "Failed to fetch engin" });
    }
  });

  app.post("/api/engins", async (req, res) => {
    try {
      const validatedData = insertEnginSchema.parse(req.body);
      const engin = await storage.createEngin(validatedData);
      res.status(201).json(engin);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating engin:", error);
      res.status(500).json({ error: "Failed to create engin" });
    }
  });

  app.put("/api/engins/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const engin = await storage.updateEngin(id, req.body);
      res.json(engin);
    } catch (error) {
      console.error("Error updating engin:", error);
      res.status(500).json({ error: "Failed to update engin" });
    }
  });

  app.delete("/api/engins/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      await storage.deleteEngin(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting engin:", error);
      res.status(500).json({ error: "Failed to delete engin" });
    }
  });

  // Filtre routes
  app.get("/api/filtres", async (req, res) => {
    try {
      const filtres = await storage.getFiltres();
      res.json(filtres);
    } catch (error) {
      console.error("Error fetching filtres:", error);
      res.status(500).json({ error: "Failed to fetch filtres" });
    }
  });

  app.get("/api/filtres/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const filtre = await storage.getFiltre(id);
      if (!filtre) {
        return res.status(404).json({ error: "Filtre not found" });
      }
      
      res.json(filtre);
    } catch (error) {
      console.error("Error fetching filtre:", error);
      res.status(500).json({ error: "Failed to fetch filtre" });
    }
  });

  app.post("/api/filtres", async (req, res) => {
    try {
      const validatedData = insertFiltreSchema.parse(req.body);
      const filtre = await storage.createFiltre(validatedData);
      res.status(201).json(filtre);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating filtre:", error);
      res.status(500).json({ error: "Failed to create filtre" });
    }
  });

  app.put("/api/filtres/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const filtre = await storage.updateFiltre(id, req.body);
      res.json(filtre);
    } catch (error) {
      console.error("Error updating filtre:", error);
      res.status(500).json({ error: "Failed to update filtre" });
    }
  });

  app.delete("/api/filtres/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      await storage.deleteFiltre(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting filtre:", error);
      res.status(500).json({ error: "Failed to delete filtre" });
    }
  });

  // Cross reference routes
  app.get("/api/filtres/:id/cross-references", async (req, res) => {
    try {
      const filtreId = parseInt(req.params.id);
      if (isNaN(filtreId)) {
        return res.status(400).json({ error: "Invalid filtre ID" });
      }
      
      const crossRefs = await storage.getCrossReferences(filtreId);
      res.json(crossRefs);
    } catch (error) {
      console.error("Error fetching cross references:", error);
      res.status(500).json({ error: "Failed to fetch cross references" });
    }
  });

  app.post("/api/cross-references", async (req, res) => {
    try {
      const validatedData = insertCrossReferenceSchema.parse(req.body);
      const crossRef = await storage.createCrossReference(validatedData);
      res.status(201).json(crossRef);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating cross reference:", error);
      res.status(500).json({ error: "Failed to create cross reference" });
    }
  });

  app.delete("/api/cross-references/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      await storage.deleteCrossReference(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting cross reference:", error);
      res.status(500).json({ error: "Failed to delete cross reference" });
    }
  });

  // Maintenance routes
  app.get("/api/maintenance", async (req, res) => {
    try {
      const enginId = req.query.enginId ? parseInt(req.query.enginId as string) : undefined;
      const maintenanceRecords = await storage.getMaintenanceRecords(enginId);
      res.json(maintenanceRecords);
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      res.status(500).json({ error: "Failed to fetch maintenance records" });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const validatedData = insertMaintenancePreventiveSchema.parse(req.body);
      const maintenance = await storage.createMaintenanceRecord(validatedData);
      res.status(201).json(maintenance);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating maintenance record:", error);
      res.status(500).json({ error: "Failed to create maintenance record" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}