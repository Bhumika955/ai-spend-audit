# Metrics

## North Star metric

**Qualified leads generated per week** — defined as email submissions from users whose audit showed ≥$100/month in savings.

**Why this and not something else:**

- Not "audits completed" — that measures top-of-funnel activity, not business value. A tool that generates 1,000 audits with $0 savings identified is useless to Credex.
- Not "emails captured" — someone who's already optimized and submits their email to "get notified" is a weaker signal than someone with a real savings opportunity.
- Not "consultations booked" — too far down the funnel to optimize against early. With low volume, this number is too noisy (0 or 1 per week).
- Not "DAU" — this tool is used once per quarter per team, not daily. DAU would always look terrible and would be misleading.

Qualified leads per week directly measures whether the tool is doing its job: finding people with real overspend and getting their contact info into Credex's hands.

**Target for week 1**: 5 qualified leads. **Target for month 3**: 40/week.

## 3 input metrics that drive the North Star

**1. Audit completion rate** (visits → audit submitted)
Target: ≥18%. If this drops below 12%, the form is too long or confusing. This is the first conversion gate — everything downstream depends on it.

**2. High-savings audit rate** (audits → audits showing ≥$100/mo savings)
Target: ≥35%. Measures audit engine quality. If most users are "already optimal," either our pricing logic is wrong or we're attracting the wrong users. Both are fixable but different fixes.

**3. Email capture rate among high-savings users** (high-savings audits → email submitted)
Target: ≥30%. If users with $200/month in savings are leaving without submitting their email, the results page isn't compelling enough, or the value proposition of the email isn't clear.

North Star = Metric 1 × Metric 2 × Metric 3 × total visitors.

## What I'd instrument first

In order of priority:

1. **Audit completion funnel** — track where users drop off in the form. Is it after selecting tools? After entering spend? Knowing the drop-off point tells you exactly what to fix.

2. **Per-tool selection frequency** — which tools are users selecting most? This tells us where pricing data quality matters most and where to focus engine improvements.

3. **Savings distribution** — histogram of savings amounts across all audits. What % show $0? What % show >$500? This tells us if the engine is calibrated correctly.

4. **Shareable link clicks** — how many people who receive a shared link actually click it? This is the viral coefficient. If it's >0.3, the tool can grow organically.

5. **Time-to-email** — how long after seeing results does a user submit their email? A short time (under 2 minutes) means the results page is compelling. Long time or no submission means they're skeptical.

Implementation: Plausible Analytics (privacy-friendly, no cookie banner needed) for page-level events. Custom events via `fetch('/api/track', {...})` for funnel steps.

## What triggers a pivot decision

**If after 500 audits**: high-savings audit rate is below 20% — the engine is telling too many people they're already optimal. Either our pricing logic is wrong (we're underestimating what they're paying) or we need to expand what "optimization" means (cross-tool redundancy, not just plan downgrades).

**If after 200 audits**: email capture rate among high-savings users is below 15% — the results page isn't convincing enough that giving an email is worth it. Pivot: move email capture to before results (shows the number, blurs the breakdown until email submitted). This is a dark pattern but if the current approach isn't working, it's the obvious test.

**If after 4 weeks**: zero consultations booked despite 20+ qualified leads — the Credex offer isn't compelling enough, or users don't trust Credex yet. Pivot: add social proof (case studies, logos) before the consultation CTA. Or lower the friction (offer a free async audit via email instead of a video call).