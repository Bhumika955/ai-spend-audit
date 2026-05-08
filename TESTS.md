# Tests

All tests cover the core audit engine logic.

## Test file
`src/__tests__/auditEngine.test.ts`

## How to run
```bash
npm test
```

## Test coverage

| # | Test | What it covers |
|---|------|----------------|
| 1 | Cursor Business ≤2 seats | Detects plan overkill, recommends Pro downgrade |
| 2 | GitHub Copilot Individual | Confirms optimal plan detection works |
| 3 | Claude Max single seat | Detects expensive plan vs cheaper alternative |
| 4 | Multi-tool savings math | Total savings = sum of individual savings |
| 5 | Gemini Ultra overspend | High-cost outlier correctly flagged as high severity |
| 6 | Audit UUID generation | Every audit gets a valid UUID v4 |
| 7 | High API spend optimization | Large API bills trigger model routing recommendation |