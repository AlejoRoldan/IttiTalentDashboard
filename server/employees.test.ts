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

describe("employees router", () => {
  it("should list all employees", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.employees.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it("should create a new employee", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const newEmployee = {
      name: "Test Employee",
      email: "test.employee@itti.com",
      role: "Developer",
      seniority: "junior" as const,
    };

    const result = await caller.employees.create(newEmployee);

    expect(result).toBeDefined();
  });
});

describe("competencies router", () => {
  it("should list all competencies", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.competencies.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it("should create a new competency", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const newCompetency = {
      name: "Test Competency",
      category: "technical" as const,
      description: "Test description",
    };

    const result = await caller.competencies.create(newCompetency);

    expect(result).toBeDefined();
  });
});

describe("opportunities router", () => {
  it("should list all opportunities", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.opportunities.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});
