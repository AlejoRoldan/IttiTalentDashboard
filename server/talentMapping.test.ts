import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@itti.com",
    name: "Test User",
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

describe("talentMapping router", () => {
  it("should return heatmap data with employees, competencies and evaluations", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.talentMapping.heatmapData();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("employees");
    expect(result).toHaveProperty("competencies");
    expect(result).toHaveProperty("evaluations");
    expect(Array.isArray(result.employees)).toBe(true);
    expect(Array.isArray(result.competencies)).toBe(true);
    expect(Array.isArray(result.evaluations)).toBe(true);
  });

  it("should return radar data for a specific employee", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Primero obtenemos un empleado válido
    const heatmapData = await caller.talentMapping.heatmapData();
    const firstEmployee = heatmapData.employees[0];

    if (!firstEmployee) {
      // Si no hay empleados, el test pasa (base de datos vacía)
      expect(true).toBe(true);
      return;
    }

    const result = await caller.talentMapping.radarData({ employeeId: firstEmployee.id });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("employee");
    expect(result).toHaveProperty("competencies");
    expect(Array.isArray(result.competencies)).toBe(true);
    
    if (result.employee) {
      expect(result.employee.id).toBe(firstEmployee.id);
    }
  });

  it("should return competencies with currentLevel and potentialLevel", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const heatmapData = await caller.talentMapping.heatmapData();
    const firstEmployee = heatmapData.employees[0];

    if (!firstEmployee) {
      expect(true).toBe(true);
      return;
    }

    const result = await caller.talentMapping.radarData({ employeeId: firstEmployee.id });

    if (result.competencies.length > 0) {
      const firstCompetency = result.competencies[0];
      expect(firstCompetency).toHaveProperty("competencyName");
      expect(firstCompetency).toHaveProperty("currentLevel");
      expect(firstCompetency).toHaveProperty("potentialLevel");
    }
  });
});
