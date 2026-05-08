import { NextRequest, NextResponse } from "next/server";
import { AuditResult } from "@/types";
import { TOOL_LABELS } from "@/lib/pricingData";

export async function POST(req: NextRequest) {
  try {
    const audit: AuditResult = await req.json();

    const toolSummary = audit.results
      .map((r) => `${TOOL_LABELS[r.tool]}: ${r.recommendedAction} (save $${r.monthlySavings}/mo)`)
      .join("\n");

    const prompt = `You are a concise financial advisor for tech startups. Write a 80-100 word personalized audit summary for a team with the following AI tool spending analysis:

Team size: ${audit.formData.teamSize}
Primary use case: ${audit.formData.useCase}
Total monthly savings identified: $${audit.totalMonthlySavings}

Tool-by-tool findings:
${toolSummary}

Write in second person ("Your team..."). Be specific, mention actual tools and numbers. End with one concrete next step. Flowing paragraph only, no bullet points.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // updated model name
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Groq error details:", JSON.stringify(errorBody));
      throw new Error(`Groq API failed: ${errorBody?.error?.message}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content ?? null;

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Summary generation failed:", err);
    // Graceful templated fallback
    return NextResponse.json({ summary: null, fallback: true });
  }
}