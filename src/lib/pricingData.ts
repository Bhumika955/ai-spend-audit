// All prices in USD/user/month unless noted
// Sources documented in PRICING_DATA.md

export const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 40, // custom, use 40 as floor
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
    enterprise: 30, // custom, use 30 as floor
    api_direct: 0,  // usage-based, captured via monthlySpend
  },
  chatgpt: {
    plus: 20,
    team: 30,
    enterprise: 30, // custom
    api_direct: 0,
  },
  anthropic_api: {
    pay_as_you_go: 0, // usage-based
  },
  openai_api: {
    pay_as_you_go: 0,
  },
  gemini: {
    pro: 19.99,
    ultra: 249.99, // per month flat (Google One AI Premium)
    api: 0,
  },
  windsurf: {
    free: 0,
    pro: 15,
    teams: 35,
  },
};

export const TOOL_LABELS: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export const PLANS_BY_TOOL: Record<string, string[]> = {
  cursor: ["hobby", "pro", "business", "enterprise"],
  github_copilot: ["individual", "business", "enterprise"],
  claude: ["free", "pro", "max", "team", "enterprise", "api_direct"],
  chatgpt: ["plus", "team", "enterprise", "api_direct"],
  anthropic_api: ["pay_as_you_go"],
  openai_api: ["pay_as_you_go"],
  gemini: ["pro", "ultra", "api"],
  windsurf: ["free", "pro", "teams"],
};