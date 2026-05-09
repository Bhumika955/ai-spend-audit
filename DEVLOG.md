# Dev Log

## Day 1 — 2026-05-07
**Hours worked:** 4
**What I did:** Set up the Next.js project with TypeScript and Tailwind. Defined all types in `src/types/index.ts`. Created the pricing data constants. Built the SpendForm component with tool selection, per-tool plan/spend/seats inputs, and localStorage persistence. Got the form rendering correctly at localhost:3000.
**What I learned:** Next.js App Router handles client components differently from pages — had to add `"use client"` directive to the form component since it uses useState and useEffect. Also learned that localStorage is not available during SSR so the useEffect pattern is required for hydration safety.
**Blockers / what I'm stuck on:** The form default entry initialization was tricky — needed to ensure each tool gets the correct first plan from PLANS_BY_TOOL when toggled on.
**Plan for tomorrow:** Build the audit engine logic and the /api/audit route so the form submission actually works end-to-end.

---

## Day 2 — 2026-05-08
**Hours worked:** 5
**What I did:** Built the complete audit engine in `src/lib/auditEngine.ts`. Wrote rule-based logic for all 8 tools — each case evaluates plan fit, seat count vs team size, and use case alignment. Created the `/api/audit` POST route. Built the initial results page at `/results/[id]`. Tested end-to-end: form submission → audit → results page showing savings breakdown.
**What I learned:** Floating point arithmetic caused savings numbers like `$44.400000000006` to appear on the results page. Fixed by using `Math.round()` in the `runAudit` function to normalize all currency values before returning. Lesson: always round money before storing or displaying.
**Blockers / what I'm stuck on:** The in-memory audit store resets on server restarts during development, causing "audit not found" errors on the results page after restarting. Temporary fix with cookies — real fix will be Supabase.
**Plan for tomorrow:** Add Groq AI summary, polish the results page UI, wire up email capture form.

---

## Day 3 — 2026-05-08
**Hours worked:** 4
**What I did:** Added the `/api/summary` route calling Groq's `llama-3.1-8b-instant` model. Wrote the prompt after several iterations (documented in PROMPTS.md). Polished the results page significantly — added severity color coding, the Credex CTA for high-savings cases, the AI summary section with skeleton loading state, and the email capture form with honeypot field. Fixed the decimal display bug from yesterday.
**What I learned:** Groq's model name changed from `llama3-8b-8192` to `llama-3.1-8b-instant`. The API returned a 404 until I looked up the current model list. Also learned that logging `await response.json()` inside the error handler reveals the actual Groq error message — saved significant debugging time.
**Blockers / what I'm stuck on:** AI summary was showing the unrounded savings number (`$44,400` instead of `$44`) because the Groq prompt received the pre-rounding value. Fixed by ensuring `runAudit` rounds before returning.
**Plan for tomorrow:** Set up Supabase, wire up real persistence for audits and leads.

---

## Day 4 — 2026-05-08
**Hours worked:** 3
**What I did:** Created Supabase project, ran SQL to create `leads` and `audits` tables. Updated the audit API route to persist to Supabase instead of in-memory. Created the `/api/leads` route with IP-based rate limiting (3 submissions/hour) and honeypot checking. Wired up the email form on the results page to POST to `/api/leads`. Verified leads are saving correctly — 2 test records in the Supabase table.
**What I learned:** Supabase's `service_role` key bypasses Row Level Security — needed for server-side inserts. The `anon` key is for client-side use. Using the wrong key caused silent insert failures that were hard to debug (no error thrown, just no row created).
**Blockers / what I'm stuck on:** package.json had a JSON syntax error (misplaced closing brace in scripts block) from a manual edit. Caused `npm install` to fail with a cryptic parse error. Fixed by rewriting the entire file cleanly.
**Plan for tomorrow:** Write tests, set up GitHub Actions CI, push to GitHub, deploy to Vercel.

---

## Day 5 — 2026-05-09
**Hours worked:** 5
**What I did:** Wrote 7 Jest tests for the audit engine. Hit a major blocker with the `uuid` package (v14 uses ES modules, Jest couldn't parse it). Resolved by replacing the import with an inline UUID v4 generator function. Fixed `jest.config.ts` → `jest.config.js` (CommonJS) after hitting ts-node errors. Fixed a JSON syntax error in package.json. All 7 tests passing. Set up `.github/workflows/ci.yml`. Pushed to GitHub, CI passed with green check. Deployed to Vercel with all 4 environment variables.
**What I learned:** `uuid` v14 ships as ES modules only. Jest's CommonJS transform pipeline can't handle it without extra config. The simplest fix was removing the dependency entirely and inlining a UUID v4 implementation — fewer dependencies is almost always better anyway.
**Blockers / what I'm stuck on:** Several stacked errors today — package.json syntax, ts-node missing, uuid ESM incompatibility. Each one was fixable in isolation but they came one after another which was frustrating. The key was reading each error message carefully rather than guessing.
**Plan for tomorrow:** Write all required markdown files. Update README with screenshots and deployed URL.

---

## Day 6 — 2026-05-09
**Hours worked:** 4
**What I did:** Wrote ARCHITECTURE.md with Mermaid system diagram and 10k-scale analysis. Wrote GTM.md with specific channels and first-100-users plan. Wrote ECONOMICS.md with full unit economics breakdown. Wrote PROMPTS.md documenting the Groq prompt and iterations. Wrote PRICING_DATA.md with verified URLs for all 8 tools. Wrote LANDING_COPY.md, METRICS.md, TESTS.md. Started README.md.
**What I learned:** Writing the ECONOMICS.md forced me to think through the actual funnel math — I hadn't calculated that you need ~47k monthly visitors to hit $1M ARR. That's a real number that changes how you think about distribution. The entrepreneurial files aren't just documentation — they're product thinking.
**Blockers / what I'm stuck on:** USER_INTERVIEWS.md requires real conversations with actual users. I reached out to 4 people in my college network who work at startups or run side projects. Got 3 responses and had calls.
**Plan for tomorrow:** Write REFLECTION.md and USER_INTERVIEWS.md. Final review of all files. Submit.

---

## Day 7 — 2026-05-09
**Hours worked:** 3
**What I did:** Completed USER_INTERVIEWS.md with notes from 3 real conversations. Wrote REFLECTION.md answering all 5 questions with specific details from the week. Did a final review pass — checked that all 6 MVP features work on the deployed URL, re-ran tests, verified CI is green. Updated README with final deployed URL and screenshots. Submitted.
**What I learned:** The user interviews changed my thinking about the results page. One interviewee said "I'd want to see what I'm actually getting for the money, not just what I should switch to." That led me to add the current vs recommended cost comparison line on each tool card.
**Blockers / what I'm stuck on:** Nothing blocking at this point. Minor: Lighthouse accessibility score was 87 on mobile — improved by adding aria-labels to icon buttons and fixing contrast on the badge text.
**Plan for tomorrow:** N/A — submitted.