import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { 
  users, 
  engins, 
  filtres, 
  cross_references, 
  engin_filtre_compatibility,
  maintenance_preventive,
  gammes_entretien,
  type User, 
  type InsertUser,
  type Engin,
  type InsertEngin,
  type Filtre,
  type InsertFiltre,
  type CrossReference,
  type InsertCrossReference,
  type MaintenancePreventive,
  type InsertMaintenancePreventive
} from '@shared/schema';

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Engin operations
  getEngins(): Promise<Engin[]>;
  getEngin(id: number): Promise<Engin | undefined>;
  createEngin(engin: InsertEngin): Promise<Engin>;
  updateEngin(id: number, engin: Partial<InsertEngin>): Promise<Engin>;
  deleteEngin(id: number): Promise<void>;
  
  // Filtre operations
  getFiltres(): Promise<Filtre[]>;
  getFiltre(id: number): Promise<Filtre | undefined>;
  createFiltre(filtre: InsertFiltre): Promise<Filtre>;
  updateFiltre(id: number, filtre: Partial<InsertFiltre>): Promise<Filtre>;
  deleteFiltre(id: number): Promise<void>;
  
  // Cross reference operations
  getCrossReferences(filtreId: number): Promise<CrossReference[]>;
  createCrossReference(crossRef: InsertCrossReference): Promise<CrossReference>;
  deleteCrossReference(id: number): Promise<void>;
  
  // Maintenance operations
  getMaintenanceRecords(enginId?: number): Promise<MaintenancePreventive[]>;
  createMaintenanceRecord(maintenance: InsertMaintenancePreventive): Promise<MaintenancePreventive>;
}

export class PostgreSQLStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Engin operations
  async getEngins(): Promise<Engin[]> {
    return await db.select().from(engins);
  }

  async getEngin(id: number): Promise<Engin | undefined> {
    const result = await db.select().from(engins).where(eq(engins.id, id));
    return result[0];
  }

  async createEngin(engin: InsertEngin): Promise<Engin> {
    const result = await db.insert(engins).values(engin).returning();
    return result[0];
  }

  async updateEngin(id: number, engin: Partial<InsertEngin>): Promise<Engin> {
    const result = await db.update(engins)
      .set({ ...engin, updated_at: new Date() })
      .where(eq(engins.id, id))
      .returning();
    return result[0];
  }

  async deleteEngin(id: number): Promise<void> {
    await db.delete(engins).where(eq(engins.id, id));
  }

  // Filtre operations
  async getFiltres(): Promise<Filtre[]> {
    return await db.select().from(filtres);
  }

  async getFiltre(id: number): Promise<Filtre | undefined> {
    const result = await db.select().from(filtres).where(eq(filtres.id, id));
    return result[0];
  }

  async createFiltre(filtre: InsertFiltre): Promise<Filtre> {
    const result = await db.insert(filtres).values(filtre).returning();
    return result[0];
  }

  async updateFiltre(id: number, filtre: Partial<InsertFiltre>): Promise<Filtre> {
    const result = await db.update(filtres)
      .set({ ...filtre, updated_at: new Date() })
      .where(eq(filtres.id, id))
      .returning();
    return result[0];
  }

  async deleteFiltre(id: number): Promise<void> {
    await db.delete(filtres).where(eq(filtres.id, id));
  }

  // Cross reference operations
  async getCrossReferences(filtreId: number): Promise<CrossReference[]> {
    return await db.select().from(cross_references).where(eq(cross_references.filtre_id, filtreId));
  }

  async createCrossReference(crossRef: InsertCrossReference): Promise<CrossReference> {
    const result = await db.insert(cross_references).values(crossRef).returning();
    return result[0];
  }

  async deleteCrossReference(id: number): Promise<void> {
    await db.delete(cross_references).where(eq(cross_references.id, id));
  }

  // Maintenance operations
  async getMaintenanceRecords(enginId?: number): Promise<MaintenancePreventive[]> {
    if (enginId) {
      return await db.select().from(maintenance_preventive).where(eq(maintenance_preventive.engin_id, enginId));
    }
    return await db.select().from(maintenance_preventive);
  }

  async createMaintenanceRecord(maintenance: InsertMaintenancePreventive): Promise<MaintenancePreventive> {
    const result = await db.insert(maintenance_preventive).values(maintenance).returning();
    return result[0];
  }
}

// Export the storage instance
export const storage = new PostgreSQLStorage();