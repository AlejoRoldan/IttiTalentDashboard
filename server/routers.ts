import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

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
    generate: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .mutation(async ({ input }) => {
        const { getDb, getEmployeeById } = await import("./db");
        const { employeeCompetencies, competencies, developmentPlans } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Obtener datos del empleado
        const employee = await getEmployeeById(input.employeeId);
        if (!employee) throw new Error("Employee not found");
        
        // Obtener competencias y evaluaciones
        const evaluations = await db
          .select({
            competencyName: competencies.name,
            category: competencies.category,
            currentLevel: employeeCompetencies.currentLevel,
            potentialLevel: employeeCompetencies.potentialLevel,
          })
          .from(employeeCompetencies)
          .leftJoin(competencies, eq(employeeCompetencies.competencyId, competencies.id))
          .where(eq(employeeCompetencies.employeeId, input.employeeId));
        
        // Obtener plan de desarrollo
        const plans = await db
          .select()
          .from(developmentPlans)
          .where(eq(developmentPlans.employeeId, input.employeeId));
        
        // Construir prompt para el LLM
        const prompt = `Eres un experto en desarrollo profesional y gestión de talento en el sector tecnológico. Analiza el siguiente perfil y genera recomendaciones personalizadas de desarrollo profesional.

**PERFIL DEL EMPLEADO:**
Nombre: ${employee.name}
Rol Actual: ${employee.role || "No especificado"}
Seniority: ${employee.seniority || "No especificado"}
Departamento: ${employee.department || "No especificado"}
Objetivo de Carrera: ${employee.careerGoal || "No especificado"}

**COMPETENCIAS ACTUALES:**
${evaluations.map(e => `- ${e.competencyName} (${e.category}): Nivel actual ${e.currentLevel}%, Potencial ${e.potentialLevel}%`).join("\n")}

**BRECHAS IDENTIFICADAS:**
${evaluations.filter(e => (e.potentialLevel || 0) > (e.currentLevel || 0)).map(e => `- ${e.competencyName}: Brecha de ${(e.potentialLevel || 0) - (e.currentLevel || 0)}%`).join("\n")}

        **PLAN DE DESARROLLO ACTUAL:**
${plans.length > 0 ? plans.map(p => `- ${p.objective}: ${p.status}`).join("\n") : "Sin plan de desarrollo definido"}

Genera recomendaciones en formato JSON con la siguiente estructura:
{
  "courses": [
    {
      "title": "Nombre del curso",
      "provider": "Plataforma o institución",
      "duration": "Duración estimada",
      "priority": "high" | "medium" | "low",
      "competencies": ["Competencia 1", "Competencia 2"],
      "reason": "Por qué es relevante para este empleado"
    }
  ],
  "projects": [
    {
      "title": "Nombre del proyecto",
      "description": "Descripción breve",
      "competencies": ["Competencia 1"],
      "estimatedDuration": "Tiempo estimado",
      "impact": "Impacto esperado en el desarrollo"
    }
  ],
  "mentorship": {
    "recommendedMentor": "Perfil ideal del mentor",
    "focusAreas": ["Area 1", "Area 2"],
    "frequency": "Frecuencia sugerida de reunión"
  },
  "certifications": [
    {
      "name": "Nombre de la certificación",
      "issuer": "Organización emisora",
      "relevance": "Por qué es importante",
      "preparationTime": "Tiempo de preparación"
    }
  ],
  "careerPath": {
    "nextRole": "Siguiente rol sugerido",
    "timeframe": "Tiempo estimado",
    "keyMilestones": ["Hito 1", "Hito 2", "Hito 3"],
    "requiredCompetencies": ["Competencia necesaria 1", "Competencia necesaria 2"]
  },
  "summary": "Resumen ejecutivo de las recomendaciones (2-3 oraciones)"
}`;
        
        // Llamar al LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Eres un experto en desarrollo profesional y gestión de talento en tecnología. Generas recomendaciones precisas, accionables y basadas en datos.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "career_recommendations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  courses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        provider: { type: "string" },
                        duration: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        competencies: { type: "array", items: { type: "string" } },
                        reason: { type: "string" },
                      },
                      required: ["title", "provider", "duration", "priority", "competencies", "reason"],
                      additionalProperties: false,
                    },
                  },
                  projects: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        competencies: { type: "array", items: { type: "string" } },
                        estimatedDuration: { type: "string" },
                        impact: { type: "string" },
                      },
                      required: ["title", "description", "competencies", "estimatedDuration", "impact"],
                      additionalProperties: false,
                    },
                  },
                  mentorship: {
                    type: "object",
                    properties: {
                      recommendedMentor: { type: "string" },
                      focusAreas: { type: "array", items: { type: "string" } },
                      frequency: { type: "string" },
                    },
                    required: ["recommendedMentor", "focusAreas", "frequency"],
                    additionalProperties: false,
                  },
                  certifications: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        issuer: { type: "string" },
                        relevance: { type: "string" },
                        preparationTime: { type: "string" },
                      },
                      required: ["name", "issuer", "relevance", "preparationTime"],
                      additionalProperties: false,
                    },
                  },
                  careerPath: {
                    type: "object",
                    properties: {
                      nextRole: { type: "string" },
                      timeframe: { type: "string" },
                      keyMilestones: { type: "array", items: { type: "string" } },
                      requiredCompetencies: { type: "array", items: { type: "string" } },
                    },
                    required: ["nextRole", "timeframe", "keyMilestones", "requiredCompetencies"],
                    additionalProperties: false,
                  },
                  summary: { type: "string" },
                },
                required: ["courses", "projects", "mentorship", "certifications", "careerPath", "summary"],
                additionalProperties: false,
              },
            },
          },
        });
        
        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No response from LLM");
        
        const contentString = typeof content === "string" ? content : JSON.stringify(content);
        const recommendations = JSON.parse(contentString);
        
        return {
          employeeId: input.employeeId,
          employeeName: employee.name,
          recommendations,
          generatedAt: new Date().toISOString(),
        };
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
