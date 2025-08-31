import { pgTable, text, serial, integer, timestamp, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Engins (machines/equipment) table
export const engins = pgTable("engins", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  designation: text("designation").notNull(),
  marque: text("marque").notNull(),
  type: text("type").notNull(),
  heures: integer("heures"),
  derniere_maintenance_preventive: date("derniere_maintenance_preventive"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Filtres (filters) table
export const filtres = pgTable("filtres", {
  id: serial("id").primaryKey(),
  reference_principale: varchar("reference_principale", { length: 100 }).notNull().unique(),
  type: text("type").notNull(),
  fabricant: text("fabricant").notNull(),
  designation: text("designation"),
  prix: integer("prix"), // Price in cents to avoid decimal issues
  stock: integer("stock"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Cross references table (alternative part numbers for filters)
export const cross_references = pgTable("cross_references", {
  id: serial("id").primaryKey(),
  filtre_id: integer("filtre_id").references(() => filtres.id, { onDelete: "cascade" }),
  reference: varchar("reference", { length: 100 }).notNull(),
  fabricant: text("fabricant").notNull(),
  prix: integer("prix"), // Price in cents
  stock: integer("stock"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Engin-filtre compatibility table (which filters are compatible with which machines)
export const engin_filtre_compatibility = pgTable("engin_filtre_compatibility", {
  id: serial("id").primaryKey(),
  engin_id: integer("engin_id").references(() => engins.id, { onDelete: "cascade" }),
  filtre_id: integer("filtre_id").references(() => filtres.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
});

// Maintenance schedule (gammes d'entretien)
export const gammes_entretien = pgTable("gammes_entretien", {
  id: serial("id").primaryKey(),
  gamme: varchar("gamme", { length: 1 }).notNull(), // C, D, E, F
  sequence_order: integer("sequence_order").notNull(),
  heures_interval: integer("heures_interval").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Maintenance preventive records
export const maintenance_preventive = pgTable("maintenance_preventive", {
  id: serial("id").primaryKey(),
  engin_id: integer("engin_id").references(() => engins.id, { onDelete: "cascade" }),
  gamme_id: integer("gamme_id").references(() => gammes_entretien.id),
  heures_service: integer("heures_service").notNull(),
  date_execution: date("date_execution").defaultNow(),
  filtres_remplaces: integer("filtres_remplaces").array(), // Array of filter IDs
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Schema exports for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEnginSchema = createInsertSchema(engins).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFiltreSchema = createInsertSchema(filtres).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertCrossReferenceSchema = createInsertSchema(cross_references).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertMaintenancePreventiveSchema = createInsertSchema(maintenance_preventive).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Engin = typeof engins.$inferSelect;
export type InsertEngin = z.infer<typeof insertEnginSchema>;

export type Filtre = typeof filtres.$inferSelect;
export type InsertFiltre = z.infer<typeof insertFiltreSchema>;

export type CrossReference = typeof cross_references.$inferSelect;
export type InsertCrossReference = z.infer<typeof insertCrossReferenceSchema>;

export type MaintenancePreventive = typeof maintenance_preventive.$inferSelect;
export type InsertMaintenancePreventive = z.infer<typeof insertMaintenancePreventiveSchema>;

export type GammeEntretien = typeof gammes_entretien.$inferSelect;