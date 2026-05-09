# Tests

All tests cover the core audit engine logic. The audit engine is the most critical part of the product — incorrect savings calculations would destroy user trust, so this is where automated testing matters most.

## Test file

`src/__tests__/auditEngine.test.ts`

## How to run

```bash
npm test
```

## Test coverage

| # | Test name | What it covers |
|---|-----------|----------------|
| 1 | Cursor Business with ≤2 seats recommends downgrade to Pro | Detects plan overkill — Business plan at $40/seat is unnecessary for small teams; engine correctly flags and recommends Pro at $20/seat |
| 2 | GitHub Copilot Individual for solo coder is optimal | Confirms the engine doesn't manufacture savings — a solo developer on the Individual plan is correctly marked optimal |
| 3 | Claude Max recommends downgrade to Pro | Detects expensive tier misuse — Claude Max at $100/seat is flagged when Pro at $20/seat covers the same models |
| 4 | Total monthly savings equals sum of individual tool savings | Math integrity check — totalMonthlySavings must equal the sum of per-tool savings, and annual must be exactly 12× monthly |
| 5 | Gemini Ultra is flagged as high severity overspend | High-cost outlier detection — Gemini Ultra at $250/mo is correctly flagged as high severity with >$100/mo savings identified |
| 6 | Audit result always returns a valid UUID | Every audit gets a unique UUID v4 — ensures shareable URLs will always be valid and unique |
| 7 | High Anthropic API spend recommends model optimization | Large API bills trigger model routing recommendation — spending $300/mo on API should flag model selection optimization |

## Why these tests

The audit engine uses hardcoded rules (intentionally — using AI for the math would be unreliable). These tests act as a contract: if pricing logic changes, a failing test tells us immediately. Tests 1–3 cover the most common user scenarios. Test 4 catches floating-point math bugs. Test 5 covers the high-severity path that triggers the Credex CTA. Test 6 ensures the viral sharing loop won't break. Test 7 covers the API-direct user segment which tends to have the highest spend.