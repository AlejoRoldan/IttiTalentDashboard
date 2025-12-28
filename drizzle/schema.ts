import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Empleados y perfiles
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  role: varchar("role", { length: 100 }),
  bootcamp: varchar("bootcamp", { length: 100 }),
  seniority: mysqlEnum("seniority", ["junior", "mid", "senior", "lead"]),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  joinDate: timestamp("joinDate"),
  managerId: int("managerId"),
  avatar: text("avatar"),
  bio: text("bio"),
  industryInterest: text("industryInterest"),
  careerGoal: mysqlEnum("careerGoal", ["technical_expert", "tech_lead", "mentor", "manager", "entrepreneur"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

// Competencias (catálogo)
export const competencies = mysqlTable("competencies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["technical", "soft"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Competency = typeof competencies.$inferSelect;
export type InsertCompetency = typeof competencies.$inferInsert;

// Evaluaciones de competencias por empleado
export const employeeCompetencies = mysqlTable("employee_competencies", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  competencyId: int("competencyId").notNull().references(() => competencies.id, { onDelete: "cascade" }),
  currentLevel: int("currentLevel").notNull().default(0),
  potentialLevel: int("potentialLevel").notNull().default(0),
  status: mysqlEnum("status", ["manifested", "emerging", "latent", "not_evaluated"]).default("not_evaluated"),
  lastEvaluated: timestamp("lastEvaluated"),
  evaluatedBy: int("evaluatedBy").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmployeeCompetency = typeof employeeCompetencies.$inferSelect;
export type InsertEmployeeCompetency = typeof employeeCompetencies.$inferInsert;

// Fuentes de detección de talento invisible
export const talentDetectors = mysqlTable("talent_detectors", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  source: mysqlEnum("source", [
    "github",
    "community",
    "mentor_feedback",
    "portfolio",
    "brainstorming",
    "learning_speed",
    "questions_quality",
    "peer_mentoring",
    "problem_solving",
    "creativity",
    "teaching",
    "improvement_initiatives"
  ]).notNull(),
  description: text("description"),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
  detectedBy: int("detectedBy").references(() => users.id),
});

export type TalentDetector = typeof talentDetectors.$inferSelect;
export type InsertTalentDetector = typeof talentDetectors.$inferInsert;

// Oportunidades de carrera
export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["technical", "mentoring", "leadership"]).notNull(),
  industry: varchar("industry", { length: 100 }),
  timing: mysqlEnum("timing", ["immediate", "3_6_months", "6_12_months"]),
  developmentLevel: mysqlEnum("developmentLevel", ["entry", "intermediate", "advanced"]),
  requiredCompetencies: text("requiredCompetencies"),
  status: mysqlEnum("status", ["open", "assigned", "closed"]).default("open"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = typeof opportunities.$inferInsert;

// Asignación de oportunidades a empleados
export const employeeOpportunities = mysqlTable("employee_opportunities", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  opportunityId: int("opportunityId").notNull().references(() => opportunities.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending"),
});

export type EmployeeOpportunity = typeof employeeOpportunities.$inferSelect;
export type InsertEmployeeOpportunity = typeof employeeOpportunities.$inferInsert;

// Planes de desarrollo individual
export const developmentPlans = mysqlTable("development_plans", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  objective: text("objective"),
  strengths: text("strengths"),
  emergingAreas: text("emergingAreas"),
  latentPotential: text("latentPotential"),
  limitingFactors: text("limitingFactors"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["draft", "active", "completed", "archived"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DevelopmentPlan = typeof developmentPlans.$inferSelect;
export type InsertDevelopmentPlan = typeof developmentPlans.$inferInsert;

// Hitos de desarrollo
export const developmentMilestones = mysqlTable("development_milestones", {
  id: int("id").autoincrement().primaryKey(),
  planId: int("planId").notNull().references(() => developmentPlans.id, { onDelete: "cascade" }),
  month: int("month").notNull(),
  description: text("description"),
  metric: text("metric"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "delayed"]).default("pending"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DevelopmentMilestone = typeof developmentMilestones.$inferSelect;
export type InsertDevelopmentMilestone = typeof developmentMilestones.$inferInsert;

// Asignación de mentores
export const mentorships = mysqlTable("mentorships", {
  id: int("id").autoincrement().primaryKey(),
  menteeId: int("menteeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  mentorId: int("mentorId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  planId: int("planId").references(() => developmentPlans.id, { onDelete: "set null" }),
  frequency: varchar("frequency", { length: 100 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["active", "completed", "paused"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Mentorship = typeof mentorships.$inferSelect;
export type InsertMentorship = typeof mentorships.$inferInsert;

// Indicadores de progreso
export const progressIndicators = mysqlTable("progress_indicators", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  learningSpeed: int("learningSpeed").default(0),
  skillApplication: int("skillApplication").default(0),
  teamImpact: int("teamImpact").default(0),
  consistency: int("consistency").default(0),
  mentoringOffered: int("mentoringOffered").default(0),
  initiative: int("initiative").default(0),
  adaptability: int("adaptability").default(0),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type ProgressIndicator = typeof progressIndicators.$inferSelect;
export type InsertProgressIndicator = typeof progressIndicators.$inferInsert;

// Recomendaciones IA
export const aiRecommendations = mysqlTable("ai_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").references(() => employees.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["organizational", "individual", "mentorship"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  status: mysqlEnum("status", ["pending", "reviewed", "implemented", "dismissed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertAIRecommendation = typeof aiRecommendations.$inferInsert;