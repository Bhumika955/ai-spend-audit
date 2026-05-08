import { FormData, ToolAuditResult, AuditResult, ToolName } from "@/types";
import { PRICING } from "./pricingData";

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Core audit logic per tool
function auditTool(
  tool: ToolName,
  plan: string,
  monthlySpend: number,
  seats: number,
  teamSize: number,
  useCase: string
): ToolAuditResult {
  const currentSpend = monthlySpend > 0 ? monthlySpend : (PRICING[tool]?.[plan] ?? 0) * seats;

  switch (tool) {
    case "cursor": {
      if (plan === "business" && seats <= 2) {
        const savings = currentSpend - 20 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Downgrade to Pro",
          recommendedPlan: "pro",
          estimatedCost: 20 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `Business plan ($40/seat) is designed for teams needing SSO and admin controls. With ${seats} seat(s), Pro ($20/seat) gives identical AI features at half the cost.`,
          severity: savings > 50 ? "high" : savings > 0 ? "medium" : "optimal",
        };
      }
      if (plan === "enterprise") {
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Evaluate if Business plan suffices",
          recommendedPlan: "business",
          estimatedCost: 40 * seats,
          monthlySavings: Math.max(0, currentSpend - 40 * seats),
          reason: "Enterprise adds audit logs and custom contracts. Unless compliance requires it, Business plan covers most team needs.",
          severity: "medium",
        };
      }
      if (plan === "hobby" && useCase === "coding" && seats >= 1) {
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Consider upgrading to Pro for coding use",
          recommendedPlan: "pro",
          estimatedCost: 20 * seats,
          monthlySavings: 0,
          reason: "Hobby plan has limited completions. For daily coding, Pro's unlimited completions typically pay for itself in productivity.",
          severity: "low",
        };
      }
      return optimal(tool, plan, currentSpend);
    }

    case "github_copilot": {
      if (plan === "enterprise" && seats <= 5) {
        const savings = currentSpend - 19 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Downgrade to Business",
          recommendedPlan: "business",
          estimatedCost: 19 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `Enterprise ($39/seat) adds Copilot policies and audit logs — worth it at 20+ seats. At ${seats} seats, Business ($19/seat) covers all core coding features.`,
          severity: savings > 50 ? "high" : "medium",
        };
      }
      if (plan === "business" && useCase !== "coding" && seats <= 3) {
        const savings = currentSpend - 10 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Downgrade to Individual",
          recommendedPlan: "individual",
          estimatedCost: 10 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `Business plan is for teams needing policy controls. For ${seats} individual developer(s) with ${useCase} use case, Individual plan saves $9/seat/month with identical AI features.`,
          severity: savings > 20 ? "medium" : "low",
        };
      }
      return optimal(tool, plan, currentSpend);
    }

    case "claude": {
      if (plan === "max" && seats >= 1) {
        const savings = currentSpend - 20 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Downgrade to Pro unless you hit limits daily",
          recommendedPlan: "pro",
          estimatedCost: 20 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `Claude Max ($100/seat) gives 5x more usage than Pro. Unless you're hitting Pro's limits regularly, Pro ($20/seat) delivers the same models at 80% lower cost.`,
          severity: savings > 100 ? "high" : "medium",
        };
      }
      if (plan === "team" && seats <= 3) {
        const savings = currentSpend - 20 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Switch to individual Pro plans",
          recommendedPlan: "pro",
          estimatedCost: 20 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `Team plan ($30/seat, 5-seat minimum) adds collaboration features. With ${seats} users, individual Pro plans ($20/seat) cost less and offer the same AI capability.`,
          severity: savings > 30 ? "medium" : "low",
        };
      }
      if (plan === "api_direct" && useCase !== "coding") {
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Compare vs Claude Pro subscription",
          estimatedCost: 20,
          monthlySavings: Math.max(0, currentSpend - 20),
          reason: `API direct billing is cost-effective for developers building apps. For general ${useCase} use, Claude Pro ($20/mo flat) may be cheaper than variable API costs.`,
          severity: currentSpend > 30 ? "medium" : "low",
        };
      }
      return optimal(tool, plan, currentSpend);
    }

    case "chatgpt": {
      if (plan === "enterprise" && seats <= 5) {
        const savings = currentSpend - 30 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Downgrade to Team",
          recommendedPlan: "team",
          estimatedCost: 30 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `ChatGPT Enterprise adds SSO, audit logs, and dedicated capacity. At ${seats} seats, Team plan provides the same GPT-4o access and custom GPTs at lower cost.`,
          severity: savings > 50 ? "high" : "medium",
        };
      }
      if (plan === "team" && seats <= 2) {
        const savings = currentSpend - 20 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Switch to Plus for each user",
          recommendedPlan: "plus",
          estimatedCost: 20 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `Team plan ($30/seat) adds shared workspace features. With only ${seats} user(s), individual Plus plans ($20/seat) deliver identical model access at lower cost.`,
          severity: savings > 20 ? "medium" : "low",
        };
      }
      return optimal(tool, plan, currentSpend);
    }

    case "anthropic_api":
    case "openai_api": {
      const label = tool === "anthropic_api" ? "Anthropic" : "OpenAI";
      if (currentSpend > 200) {
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Apply for volume discounts or committed use",
          estimatedCost: currentSpend * 0.75,
          monthlySavings: currentSpend * 0.25,
          reason: `At $${currentSpend}/mo, you qualify for ${label}'s volume discount tiers. Committing to usage levels or purchasing credits in bulk typically yields 20-25% savings.`,
          severity: "high",
        };
      }
      if (currentSpend > 50) {
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Audit model selection — use smaller models for simple tasks",
          estimatedCost: currentSpend * 0.6,
          monthlySavings: currentSpend * 0.4,
          reason: `Routing simple classification/extraction tasks to faster, cheaper models (Haiku, GPT-4o-mini) instead of flagship models typically cuts API costs 30-50%.`,
          severity: "medium",
        };
      }
      return optimal(tool, plan, currentSpend);
    }

    case "gemini": {
      if (plan === "ultra") {
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Downgrade to Gemini Pro or switch to Claude Pro",
          recommendedPlan: "pro",
          recommendedTool: useCase === "coding" ? "cursor" : "claude",
          estimatedCost: useCase === "coding" ? 20 : 20,
          monthlySavings: Math.max(0, currentSpend - 20),
          reason: `Gemini Ultra ($250/mo) is significantly more expensive than Claude Pro or ChatGPT Plus at $20/mo. For most use cases, the cheaper alternatives offer comparable quality.`,
          severity: "high",
        };
      }
      return optimal(tool, plan, currentSpend);
    }

    case "windsurf": {
      if (plan === "teams" && seats <= 3) {
        const savings = currentSpend - 15 * seats;
        return {
          tool, currentPlan: plan, currentSpend,
          recommendedAction: "Downgrade to Pro",
          recommendedPlan: "pro",
          estimatedCost: 15 * seats,
          monthlySavings: savings > 0 ? savings : 0,
          reason: `Windsurf Teams ($35/seat) adds admin controls and usage analytics. With ${seats} developer(s), Pro ($15/seat) provides the same AI coding features at less than half the price.`,
          severity: savings > 30 ? "medium" : "low",
        };
      }
      return optimal(tool, plan, currentSpend);
    }

    default:
      return optimal(tool, plan, currentSpend);
  }
}

function optimal(tool: ToolName, plan: string, currentSpend: number): ToolAuditResult {
  return {
    tool, currentPlan: plan, currentSpend,
    recommendedAction: "No changes needed",
    estimatedCost: currentSpend,
    monthlySavings: 0,
    reason: "You're on the right plan for your usage. Spending looks optimized.",
    severity: "optimal",
  };
}

export function runAudit(formData: FormData): AuditResult {
  const results: ToolAuditResult[] = formData.tools.map((entry) =>
    auditTool(
      entry.tool,
      entry.plan,
      entry.monthlySpend,
      entry.seats,
      formData.teamSize,
      formData.useCase
    )
  );

  const totalMonthlySavings = Math.round(
    results.reduce((sum, r) => sum + r.monthlySavings, 0)
  );

  return {
    id: generateId(),
    formData,
    results: results.map((r) => ({
      ...r,
      monthlySavings: Math.round(r.monthlySavings),
      estimatedCost: Math.round(r.estimatedCost),
      currentSpend: Math.round(r.currentSpend),
    })),
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    createdAt: new Date().toISOString(),
  };
}