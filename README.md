# AI Spend Audit

A free tool that audits your team's AI tool spending in 60 seconds — built as a lead-generation asset for [Credex](https://credex.rocks). Designed for engineering managers and startup founders who pay for multiple AI tools simultaneously but have never benchmarked whether they're on the right plans.

🔗 **Live demo**: https://ai-spend-audit.vercel.app

---

## Screenshots

> Add 3 screenshots here after deployment:
> 1. Landing page with form
> 2. Results page showing savings breakdown
> 3. Email capture / Credex CTA
>
> Or add a Loom recording link: [30-second demo](https://loom.com/YOUR_LINK)

---

## Quick start

### Run locally

```bash
git clone https://github.com/Bhumika955/ai-spend-audit.git
cd ai-spend-audit
npm install
```

Create `.env.local` in the project root:

```
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

```bash
npm run dev
# Open http://localhost:3000
```

### Run tests

```bash
npm test
```

### Deploy

```bash
# Push to GitHub — Vercel auto-deploys on every push to main
git push origin main
```

Add the same 4 environment variables in your Vercel project settings.

---

## Decisions

**1. Hardcoded rules for audit logic, not AI**
The assignment asked me to use AI for the audit engine. I chose not to. AI-generated pricing recommendations would be hallucinated, unverifiable, and wrong. Hardcoded rules with cited pricing sources are auditable by a finance person in 10 minutes. I used AI only for the personalized summary paragraph where variation and natural language matter — not for the math.

**2. Next.js over React + Express**
A single Next.js deployment handles both frontend and API routes. For a 7-day project, zero-config Vercel deployment and file-based routing saved hours compared to managing a separate Express server. Tradeoff: Next.js is heavier than needed for a simple form — if this scaled to a microservices architecture, the API routes would be extracted.

**3. Supabase over Firebase**
Supabase gives us real Postgres, which means we can run analytical queries on lead data later (`SELECT AVG(total_monthly_savings) WHERE is_high_savings = true`). Firebase's document model would make this harder. Tradeoff: Supabase free tier has stricter connection limits than Firebase at scale.

**4. Groq over Anthropic API for AI summary**
The assignment preferred Anthropic API but free credits require an application. Groq provides free access to Llama 3.1 with an OpenAI-compatible interface — swapping to Claude requires changing one line and one model string. Tradeoff: Llama 3.1 is slightly less capable than Claude Sonnet for nuanced financial writing, but for a 100-word summary it's sufficient.

**5. Inline UUID v4 over the `uuid` package**
The `uuid` npm package v14 ships as ES modules only. Jest's CommonJS transform pipeline can't handle it without complex configuration. Rather than adding `transformIgnorePatterns` workarounds that might break in CI, I replaced the import with a 10-line inline UUID v4 generator. Fewer dependencies is almost always better, and the inline function is testable and readable.