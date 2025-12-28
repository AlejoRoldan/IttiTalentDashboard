import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  employees,
  InsertEmployee,
  competencies,
  InsertCompetency,
  employeeCompetencies,
  InsertEmployeeCompetency,
  talentDetectors,
  InsertTalentDetector,
  opportunities,
  InsertOpportunity,
  developmentPlans,
  InsertDevelopmentPlan,
  progressIndicators,
  InsertProgressIndicator,
  aiRecommendations,
  InsertAIRecommendation,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Employee queries
export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees);
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result[0];
}

export async function createEmployee(data: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(employees).values(data);
  return result;
}

export async function updateEmployee(id: number, data: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(employees).set(data).where(eq(employees.id, id));
}

export async function deleteEmployee(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(employees).where(eq(employees.id, id));
}

// Competency queries
export async function getAllCompetencies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(competencies);
}

export async function createCompetency(data: InsertCompetency) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(competencies).values(data);
  return result;
}

// Employee competencies queries
export async function getEmployeeCompetencies(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employeeCompetencies).where(eq(employeeCompetencies.employeeId, employeeId));
}

export async function upsertEmployeeCompetency(data: InsertEmployeeCompetency) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(employeeCompetencies).values(data).onDuplicateKeyUpdate({
    set: {
      currentLevel: data.currentLevel,
      potentialLevel: data.potentialLevel,
      status: data.status,
      lastEvaluated: data.lastEvaluated,
      notes: data.notes,
    },
  });
}

// Talent detectors queries
export async function getTalentDetectorsByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(talentDetectors).where(eq(talentDetectors.employeeId, employeeId));
}

export async function createTalentDetector(data: InsertTalentDetector) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(talentDetectors).values(data);
}

// Opportunities queries
export async function getAllOpportunities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(opportunities);
}

export async function createOpportunity(data: InsertOpportunity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(opportunities).values(data);
  return result;
}

// Development plans queries
export async function getDevelopmentPlanByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(developmentPlans).where(eq(developmentPlans.employeeId, employeeId)).limit(1);
  return result[0];
}

export async function createDevelopmentPlan(data: InsertDevelopmentPlan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(developmentPlans).values(data);
  return result;
}

// Progress indicators queries
export async function getProgressIndicatorsByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(progressIndicators).where(eq(progressIndicators.employeeId, employeeId));
}

export async function createProgressIndicator(data: InsertProgressIndicator) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(progressIndicators).values(data);
}

// AI Recommendations queries
export async function getAllAIRecommendations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiRecommendations);
}

export async function getAIRecommendationsByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiRecommendations).where(eq(aiRecommendations.employeeId, employeeId));
}

export async function createAIRecommendation(data: InsertAIRecommendation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(aiRecommendations).values(data);
}
