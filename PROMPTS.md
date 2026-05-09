# Prompts

## AI summary prompt (used in `/api/summary`)

```
You are a concise financial advisor for tech startups. Write a 80-100 word personalized audit summary for a team with the following AI tool spending analysis:

Team size: {teamSize}
Primary use case: {useCase}
Total monthly savings identified: ${totalMonthlySavings}

Tool-by-tool findings:
{toolSummary}

Write in second person ("Your team..."). Be specific, mention actual tools and numbers. End with one concrete next step. Flowing paragraph only, no bullet points.
```

## Why I wrote it this way

**"Financial advisor" framing**: Telling the model it's a financial advisor keeps the tone grounded and numeric. Early versions without this framing produced generic "AI is amazing" copy that didn't mention actual dollar amounts.

**Second person + specific numbers**: The summary is shown directly to the user on their results page. "Your team" makes it feel personalized. Without explicitly asking for numbers, the model would paraphrase vaguely ("significant savings") instead of saying "$44/month."

**"Flowing paragraph only, no bullet points"**: The results page already has a bullet-style breakdown per tool. The AI summary is meant to be the human-readable narrative above it. Without this constraint, every model defaulted to bullets, which made the page feel redundant.

**Concrete next step at the end**: This was added after noticing early outputs ended with vague encouragement ("consider reviewing your tools"). Explicitly asking for one concrete next step produces actionable closing sentences like "Start by downgrading Cursor from Business to Pro this week."

## What I tried that didn't work

**Longer prompts with examples**: Adding few-shot examples made outputs more consistent but also more templated — they started to sound copy-pasted rather than personalized. Removed the examples.

**Asking for HTML output**: Tried getting the model to return formatted HTML directly. It would hallucinate CSS classes that didn't exist in the codebase. Switched to plain text rendered inside a styled div.

**Using `llama3-8b-8192`**: Initial model choice. Outputs were grammatically correct but shallow — wouldn't engage with specific tool names. Switched to `llama-3.1-8b-instant` which handles the tool-specific reasoning better.

**Temperature 0**: Deterministic outputs were noticeably repetitive across similar audits. Raised to 0.7 for natural variation while keeping outputs coherent.

## Fallback behavior

If the Groq API fails (rate limit, network error, invalid key), the frontend falls back to a templated string:

```
Your AI stack audit is complete. We analyzed {N} tool(s) and identified ${savings}/month 
in potential savings. {savings > 0 ? "Switching plans and right-sizing seats could save 
you ${annual} annually." : "Your current stack looks well-optimized."}
```

This ensures the results page never shows a broken or empty summary section regardless of API status.