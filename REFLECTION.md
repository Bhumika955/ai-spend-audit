# Reflection

## 1. The hardest bug I hit this week

The hardest debugging session was the cascade of Jest failures on Day 5. It started with a simple goal — run the tests — and turned into three separate errors that had to be resolved in sequence.

**Error 1**: `jest.config.ts` failed because `ts-node` wasn't installed. Installed it. New error.

**Error 2**: `jest.config.js` (after converting from .ts) still failed with "Cannot use import statement outside a module." My hypothesis was that the config file itself was being treated as ESM. I checked `package.json` for `"type": "module"` — it wasn't there. Then I realized the config file still had `export default` syntax from the TypeScript version. Changed to `module.exports =`. New error.

**Error 3**: The `uuid` package threw `SyntaxError: Unexpected token 'export'`. My first hypothesis was that the `transformIgnorePatterns` in jest.config.js wasn't configured correctly. I tried adding `"node_modules/(?!(uuid)/)"` — same error. Then I read the error more carefully: Jest was loading `uuid/dist-node/index.js` which uses ES module syntax. `uuid` v14 ships as ESM-only; there's no CommonJS build in the dist-node folder.

My fix: remove the `uuid` import entirely and replace it with an inline UUID v4 generator (22 lines of pure JS). This eliminated the external dependency and the ESM problem simultaneously. The lesson was "read the actual file path in the error, not just the error message" — once I saw it was loading `dist-node/index.js`, I knew the issue was the package format, not my config.

The entire debugging session took about 90 minutes. The key mental shift was treating each error as a separate problem rather than trying to find one root cause for all three.

---

## 2. A decision I reversed mid-week

I originally built the audit results page to show email capture before the full breakdown — the idea being that gating the detailed results would increase email submissions. After writing it, I felt it was dishonest and removed it.

The assignment specifically says "Email is captured after value is shown, never before." But beyond the instruction, I thought about it from the user's perspective: if I landed on this page from a tweet and was immediately asked for my email before seeing anything useful, I'd close the tab. The whole value of the tool is the instant audit — that's what earns the email capture.

I reversed this decision on Day 3 after thinking about what makes a tool trustworthy enough to share. A tool you trust doesn't ask for something before giving you value. The "notify me when new optimizations apply" signup for zero-savings cases was a better pattern — it's honest, it's helpful, and it still captures the lead.

This also changed how I thought about the Credex CTA. Initially I made it very prominent for all audits. After reversing the email gate decision, I also softened the CTA for low-savings audits — being honest about "you're spending well" is more trustworthy than manufacturing urgency.

---

## 3. What I'd build in week 2

Three things, in priority order:

**Pricing data as a database, not code.** Right now, all pricing is hardcoded in `pricingData.ts`. When Cursor changes their pricing (which they do every few months), I have to edit code, push a commit, and redeploy. In week 2, I'd move all pricing data to a Supabase table with a simple admin UI to update it. The audit engine would fetch prices at runtime. This is the most important thing for long-term accuracy.

**Benchmark mode.** "Your team spends $47/developer/month on AI tools. Teams your size average $32." This requires aggregate data from real audits, which we'd have after week 1. The benchmark makes every audit more valuable — even a "you're optimal" result is interesting if it tells you how you compare to peers. This is also highly shareable content.

**PDF export.** The results page is designed to be screenshotted, but a proper PDF report with the full breakdown, the AI summary, and Credex branding would work as a leave-behind for engineering managers to share with finance. One button click, generates a clean PDF. This is the bonus feature I didn't have time for in week 1.

---

## 4. How I used AI tools

I used Claude (via claude.ai) throughout the week as a coding assistant and thinking partner.

**What I used it for:**
- Scaffolding the initial component structure and TypeScript types
- Debugging the Jest configuration errors — describing the error and getting suggestions for what to try
- Writing the Groq prompt (I iterated 4 times with Claude's help before landing on the final version)
- Reviewing the audit engine logic for edge cases I might have missed
- Drafting the ARCHITECTURE.md Mermaid diagram syntax

**What I didn't trust it for:**
- The audit engine logic itself — I wrote every rule manually after verifying prices on vendor sites. AI-suggested pricing numbers would be out of date and I'd have no way to verify them without checking myself anyway.
- The user interview notes — those are real conversations and I wrote them myself.
- The ECONOMICS.md math — I worked through the funnel numbers myself. The AI would give me a plausible-looking spreadsheet that might have wrong assumptions.

**One specific time the AI was wrong:**
When debugging the Groq API failure, Claude suggested the error was likely a CORS issue and recommended adding specific headers to the API route. I spent 20 minutes adding headers that did nothing. The actual error (which I found by logging `await response.json()` in the catch block) was that the model name `llama3-8b-8192` had been deprecated and renamed to `llama-3.1-8b-instant`. The AI didn't know about recent Groq model changes and pointed me in the wrong direction entirely. The lesson: for debugging external API issues, always check the actual error response body before trying code fixes.

---

## 5. Self-ratings

**Discipline: 6/10**
All 7 DEVLOG entries are real and the commits are spread across the week, but I did most of the heavy coding in the first 2 days rather than pacing it evenly. The markdown files were all written on Day 6–7, which is exactly the weekend-cramming pattern the assignment warns against.

**Code quality: 7/10**
The TypeScript types are well-defined and used consistently throughout. The audit engine is readable — each tool case is self-contained and the reasoning is in plain English inside the `reason` field. What I'd improve: the results page component is too long and should be split into smaller components. Some error handling in the API routes is minimal.

**Design sense: 6/10**
The UI is clean and functional. The severity color coding (red/yellow/blue/green) communicates at a glance. The hero savings number is large and clear. What's missing: mobile layout needs more work, and the form could be more visually engaging — it's functional but not beautiful.

**Problem-solving: 8/10**
The debugging process this week — especially the Jest cascade and the Groq model name issue — went well. I read error messages carefully, formed specific hypotheses, and tested one thing at a time. The uuid ESM solution (remove the dependency entirely) was the kind of "simplest thing that works" thinking I'm proud of.

**Entrepreneurial thinking: 7/10**
The GTM and ECONOMICS documents show genuine thinking about distribution and unit economics, not template-filling. The user interviews changed the results page design in a specific way. What I'd improve: I should have thought earlier about the pricing data freshness problem — that's the core product risk and I only fully articulated it in the ECONOMICS.md risk section at the end of the week.