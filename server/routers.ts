import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  employees: router({
    list: protectedProcedure.query(async () => {
      const { getAllEmployees } = await import("./db");
      return getAllEmployees();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getEmployeeById } = await import("./db");
      return getEmployeeById(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email().optional(),
          role: z.string().optional(),
          bootcamp: z.string().optional(),
          seniority: z.enum(["junior", "mid", "senior", "lead"]).optional(),
          department: z.string().optional(),
          position: z.string().optional(),
          joinDate: z.date().optional(),
          managerId: z.number().optional(),
          avatar: z.string().optional(),
          bio: z.string().optional(),
          industryInterest: z.string().optional(),
          careerGoal: z.enum(["technical_expert", "tech_lead", "mentor", "manager", "entrepreneur"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createEmployee } = await import("./db");
        return createEmployee(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          role: z.string().optional(),
          bootcamp: z.string().optional(),
          seniority: z.enum(["junior", "mid", "senior", "lead"]).optional(),
          department: z.string().optional(),
          position: z.string().optional(),
          managerId: z.number().optional(),
          avatar: z.string().optional(),
          bio: z.string().optional(),
          industryInterest: z.string().optional(),
          careerGoal: z.enum(["technical_expert", "tech_lead", "mentor", "manager", "entrepreneur"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const { updateEmployee } = await import("./db");
        return updateEmployee(id, data);
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const { deleteEmployee } = await import("./db");
      return deleteEmployee(input.id);
    }),
  }),

  competencies: router({
    list: protectedProcedure.query(async () => {
      const { getAllCompetencies } = await import("./db");
      return getAllCompetencies();
    }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          category: z.enum(["technical", "soft"]),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createCompetency } = await import("./db");
        return createCompetency(input);
      }),
    getByEmployee: protectedProcedure.input(z.object({ employeeId: z.number() })).query(async ({ input }) => {
      const { getEmployeeCompetencies } = await import("./db");
      return getEmployeeCompetencies(input.employeeId);
    }),
  }),

  opportunities: router({
    list: protectedProcedure.query(async () => {
      const { getAllOpportunities } = await import("./db");
      return getAllOpportunities();
    }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          type: z.enum(["technical", "mentoring", "leadership"]),
          industry: z.string().optional(),
          timing: z.enum(["immediate", "3_6_months", "6_12_months"]).optional(),
          developmentLevel: z.enum(["entry", "intermediate", "advanced"]).optional(),
          requiredCompetencies: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createOpportunity } = await import("./db");
        return createOpportunity(input);
      }),
  }),

  developmentPlans: router({
    getByEmployee: protectedProcedure.input(z.object({ employeeId: z.number() })).query(async ({ input }) => {
      const { getDevelopmentPlanByEmployee } = await import("./db");
      return getDevelopmentPlanByEmployee(input.employeeId);
    }),
    create: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          objective: z.string().optional(),
          strengths: z.string().optional(),
          emergingAreas: z.string().optional(),
          latentPotential: z.string().optional(),
          limitingFactors: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createDevelopmentPlan } = await import("./db");
        return createDevelopmentPlan(input);
      }),
  }),

  aiRecommendations: router({
    list: protectedProcedure.query(async () => {
      const { getAllAIRecommendations } = await import("./db");
      return getAllAIRecommendations();
    }),
    getByEmployee: protectedProcedure.input(z.object({ employeeId: z.number() })).query(async ({ input }) => {
      const { getAIRecommendationsByEmployee } = await import("./db");
      return getAIRecommendationsByEmployee(input.employeeId);
    }),
  }),

  talentMapping: router({
    heatmapData: protectedProcedure.query(async () => {
      const { getDb } = await import("./db");
      const { employeeCompetencies } = await import("../drizzle/schema");
      const db = await getDb();
      if (!db) return { employees: [], competencies: [], evaluations: [] };
      
      const { getAllEmployees, getAllCompetencies } = await import("./db");
      const employeesList = await getAllEmployees();
      const competenciesList = await getAllCompetencies();
      const evaluations = await db.select().from(employeeCompetencies);
      
      return {
        employees: employeesList,
        competencies: competenciesList,
        evaluations,
      };
    }),
    radarData: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input }) => {
        const { getDb, getEmployeeById } = await import("./db");
        const { employeeCompetencies, competencies } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDb();
        if (!db) return { employee: null, competencies: [] };
        
        const employee = await getEmployeeById(input.employeeId);
        const evaluations = await db
          .select({
            competencyId: employeeCompetencies.competencyId,
            competencyName: competencies.name,
            currentLevel: employeeCompetencies.currentLevel,
            potentialLevel: employeeCompetencies.potentialLevel,
          })
          .from(employeeCompetencies)
          .leftJoin(competencies, eq(employeeCompetencies.competencyId, competencies.id))
          .where(eq(employeeCompetencies.employeeId, input.employeeId));
        
        return {
          employee,
          competencies: evaluations,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
