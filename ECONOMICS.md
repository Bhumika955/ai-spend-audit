# Unit Economics

## What a converted lead is worth to Credex

Credex sells discounted AI credits. A typical deal:
- Customer buys $10,000 of Cursor/Claude credits at 30% discount
- Credex margin on resale: ~15–20% → **$1,500–$2,000 gross profit per deal**
- Larger customers (Series A+, 20+ devs) buy $30,000–$50,000 in credits
- At 15% margin: **$4,500–$7,500 per deal**

Conservative LTV estimate per converted customer: **$2,000** (assuming one purchase, no repeat).
Optimistic (repeat buyer over 12 months): **$6,000**.

I'll use **$2,000 LTV** for conservative math below.

## CAC by channel

| Channel | Effort | Expected visitors | Audit completion rate | Email capture rate | Consult booking rate | CAC |
|---------|--------|-------------------|-----------------------|--------------------|----------------------|-----|
| Hacker News (Show HN) | 2 hours writing | 800 | 18% = 144 audits | 25% = 36 emails | 5% = 1.8 consults | ~$0 / 1–2 customers |
| Reddit (r/SaaS, r/startups) | 3 hours/week | 200/week | 15% = 30 | 20% = 6 emails | 4% = 0.24 | ~$0 / 0.24 customers/week |
| X direct reply outreach | 1 hour/day | 50/day | 12% = 6 | 20% = 1.2 | 3% = 0.04 | ~$0 / 0.04/day |
| Credex existing customers (email) | 1 email send | 500 (warm) | 30% = 150 | 40% = 60 | 10% = 6 | ~$0 / 6 customers |

**Key insight**: All channels above are $0 paid CAC. The cost is time. At Credex's LTV of $2,000/customer, even a 1% conversion from audit → purchase makes the tool profitable on day 1.

## Conversion funnel math

```
Landing page visit       → 100%
Audit completed          → 18%   (form is low-friction, no login)
Email submitted          → 25% of completers = 4.5% of visitors
Consult booked           → 5% of emails = 0.22% of visitors
Credit purchase          → 40% of consults = 0.09% of visitors
```

So per 1,000 visitors: **~1 paying customer at $2,000 LTV = $2 revenue per visitor.**

For the tool to be worth maintaining: it needs to drive >500 visitors/month consistently, which is achievable after a single HN post or newsletter mention.

## What has to be true to drive $1M ARR in 18 months

$1M ARR = ~$83,000/month in gross profit to Credex.
At $2,000 LTV and ~12-month average customer lifespan: need **~42 new customers/month**.

Working backwards:
- 42 customers/month
- At 40% consult → purchase rate: need **105 consultations/month**
- At 5% email → consult rate: need **2,100 emails/month**
- At 25% audit → email rate: need **8,400 audits/month**
- At 18% visit → audit rate: need **46,700 visitors/month**

**46,700 visitors/month is the number that has to be true.**

How to get there:
- Month 1–3: Organic (HN, Reddit, X) → 2,000–5,000 visitors/month
- Month 4–6: SEO starts compounding on "AI tool pricing" queries → 10,000/month
- Month 6–12: Credex customer base referrals + word of mouth → 20,000/month
- Month 12–18: Embeddable widget on developer blogs + newsletter sponsorships → 50,000/month

This is achievable but requires consistent distribution investment — it doesn't happen passively. The tool has to be maintained (pricing data updated quarterly, new tools added) to stay relevant.

## The risk

The biggest risk isn't CAC — it's **audit quality decay**. AI tool pricing changes every 3–6 months. If the audit engine shows stale prices, users will notice immediately (they can check in 30 seconds). A wrong recommendation destroys trust faster than any marketing can rebuild it. The economics only work if the tool stays accurate. This means pricing data needs a quarterly audit and the engine needs to be updatable without a full redeploy (ideally pulled from a CMS or database rather than hardcoded).