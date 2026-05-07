export type ToolName =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolEntry {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface FormData {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
  email?: string;
  companyName?: string;
  role?: string;
}

export interface ToolAuditResult {
  tool: ToolName;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedTool?: string;
  recommendedPlan?: string;
  estimatedCost: number;
  monthlySavings: number;
  reason: string;
  severity: "high" | "medium" | "low" | "optimal";
}

export interface AuditResult {
  id: string;
  formData: FormData;
  results: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary?: string;
  createdAt: string;
}