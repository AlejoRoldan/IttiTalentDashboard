import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("aiRecommendations.generate", () => {
  it("should generate AI recommendations for an employee", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Test con un empleado existente (María González, ID 1)
    const result = await caller.aiRecommendations.generate({
      employeeId: 1,
    });

    // Verificar estructura de respuesta
    expect(result).toHaveProperty("employeeId");
    expect(result).toHaveProperty("employeeName");
    expect(result).toHaveProperty("recommendations");
    expect(result).toHaveProperty("generatedAt");

    // Verificar que employeeId coincide
    expect(result.employeeId).toBe(1);

    // Verificar estructura de recommendations
    const recommendations = result.recommendations;
    expect(recommendations).toHaveProperty("courses");
    expect(recommendations).toHaveProperty("projects");
    expect(recommendations).toHaveProperty("mentorship");
    expect(recommendations).toHaveProperty("certifications");
    expect(recommendations).toHaveProperty("careerPath");
    expect(recommendations).toHaveProperty("summary");

    // Verificar que courses es un array
    expect(Array.isArray(recommendations.courses)).toBe(true);
    
    // Si hay cursos, verificar estructura del primer curso
    if (recommendations.courses.length > 0) {
      const firstCourse = recommendations.courses[0];
      expect(firstCourse).toHaveProperty("title");
      expect(firstCourse).toHaveProperty("provider");
      expect(firstCourse).toHaveProperty("duration");
      expect(firstCourse).toHaveProperty("priority");
      expect(firstCourse).toHaveProperty("competencies");
      expect(firstCourse).toHaveProperty("reason");
      expect(Array.isArray(firstCourse.competencies)).toBe(true);
      expect(["high", "medium", "low"]).toContain(firstCourse.priority);
    }

    // Verificar que projects es un array
    expect(Array.isArray(recommendations.projects)).toBe(true);

    // Verificar estructura de mentorship
    expect(recommendations.mentorship).toHaveProperty("recommendedMentor");
    expect(recommendations.mentorship).toHaveProperty("focusAreas");
    expect(recommendations.mentorship).toHaveProperty("frequency");
    expect(Array.isArray(recommendations.mentorship.focusAreas)).toBe(true);

    // Verificar que certifications es un array
    expect(Array.isArray(recommendations.certifications)).toBe(true);

    // Verificar estructura de careerPath
    expect(recommendations.careerPath).toHaveProperty("nextRole");
    expect(recommendations.careerPath).toHaveProperty("timeframe");
    expect(recommendations.careerPath).toHaveProperty("keyMilestones");
    expect(recommendations.careerPath).toHaveProperty("requiredCompetencies");
    expect(Array.isArray(recommendations.careerPath.keyMilestones)).toBe(true);
    expect(Array.isArray(recommendations.careerPath.requiredCompetencies)).toBe(true);

    // Verificar que summary es un string no vacío
    expect(typeof recommendations.summary).toBe("string");
    expect(recommendations.summary.length).toBeGreaterThan(0);

    // Verificar que generatedAt es un timestamp válido
    expect(typeof result.generatedAt).toBe("string");
    expect(new Date(result.generatedAt).toString()).not.toBe("Invalid Date");
  }, 60000); // Timeout de 60 segundos para la llamada al LLM

  it("should throw error for non-existent employee", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Test con un empleado que no existe
    await expect(
      caller.aiRecommendations.generate({
        employeeId: 99999,
      })
    ).rejects.toThrow("Employee not found");
  });
});
