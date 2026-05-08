import { runAudit } from "@/lib/auditEngine";
import { FormData } from "@/types";

// ── Test 1: Cursor Business with 2 seats → should recommend downgrade to Pro
test("Cursor Business with ≤2 seats recommends downgrade to Pro", () => {
  const form: FormData = {
    tools: [{ tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(form);
  const cursorResult = result.results[0];

  expect(cursorResult.recommendedAction).toMatch(/downgrade/i);
  expect(cursorResult.monthlySavings).toBeGreaterThan(0);
  expect(cursorResult.severity).not.toBe("optimal");
});

// ── Test 2: GitHub Copilot Individual for coder → should be optimal
test("GitHub Copilot Individual for solo coder is optimal", () => {
  const form: FormData = {
    tools: [{ tool: "github_copilot", plan: "individual", monthlySpend: 10, seats: 1 }],
    teamSize: 1,
    useCase: "coding",
  };
  const result = runAudit(form);
  const copilotResult = result.results[0];

  expect(copilotResult.severity).toBe("optimal");
  expect(copilotResult.monthlySavings).toBe(0);
});

// ── Test 3: Claude Max with 1 seat → should recommend downgrade to Pro
test("Claude Max recommends downgrade to Pro", () => {
  const form: FormData = {
    tools: [{ tool: "claude", plan: "max", monthlySpend: 100, seats: 1 }],
    teamSize: 1,
    useCase: "writing",
  };
  const result = runAudit(form);
  const claudeResult = result.results[0];

  expect(claudeResult.monthlySavings).toBeGreaterThan(0);
  expect(claudeResult.estimatedCost).toBeLessThan(100);
});

// ── Test 4: Total savings math is correct across multiple tools
test("Total monthly savings equals sum of individual tool savings", () => {
  const form: FormData = {
    tools: [
      { tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 },
      { tool: "claude", plan: "max", monthlySpend: 100, seats: 1 },
    ],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(form);
  const expectedTotal = result.results.reduce((sum, r) => sum + r.monthlySavings, 0);

  expect(result.totalMonthlySavings).toBe(expectedTotal);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});

// ── Test 5: Gemini Ultra always flags as high savings opportunity
test("Gemini Ultra is flagged as high severity overspend", () => {
  const form: FormData = {
    tools: [{ tool: "gemini", plan: "ultra", monthlySpend: 250, seats: 1 }],
    teamSize: 1,
    useCase: "research",
  };
  const result = runAudit(form);
  const geminiResult = result.results[0];

  expect(geminiResult.severity).toBe("high");
  expect(geminiResult.monthlySavings).toBeGreaterThan(100);
});

// ── Test 6: Audit result always has a valid UUID id
test("Audit result always returns a valid UUID", () => {
  const form: FormData = {
    tools: [{ tool: "chatgpt", plan: "plus", monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: "writing",
  };
  const result = runAudit(form);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  expect(result.id).toMatch(uuidRegex);
});

// ── Test 7: High Anthropic API spend flags model optimization
test("High Anthropic API spend recommends model optimization", () => {
  const form: FormData = {
    tools: [{ tool: "anthropic_api", plan: "pay_as_you_go", monthlySpend: 300, seats: 1 }],
    teamSize: 5,
    useCase: "coding",
  };
  const result = runAudit(form);
  const apiResult = result.results[0];

  expect(apiResult.severity).not.toBe("optimal");
  expect(apiResult.monthlySavings).toBeGreaterThan(0);
});