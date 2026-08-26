## Author

**Kalyan Boosara**

Playwright / Test Automation Engineer

- GitHub: https://github.com/pentesterkaly
- LinkedIn: https://www.linkedin.com/in/kalyan-boosara-2847222a/

# AI Playwright Automation Framework

## Architecture

```text
                    ┌─────────────┐
                    │   Planner   │
                    │             │
                    │ What to test│
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Generator  │
                    │             │
                    │ How to test │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Reviewer   │
                    │             │
                    │ Does it     │
                    │ meet plan + │
                    │ rules?      │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │             │
                  FAIL           APPROVE
                    │             │
                    ▼             ▼
              Fix test        ┌───────┐
              / human          │  ✅   │
              review           │ Done  │
                              └───────┘


              ┌───────────────────────┐
              │   Playwright Test     │
              │       Execution       │
              └───────────┬───────────┘
                          │
                    ┌─────┴─────┐
                    │           │
                  PASS         FAIL
                    │           │
                    ▼           ▼
                   ✅      ┌───────────┐
                           │  Healer   │
                           └─────┬─────┘
                                 │
                         Diagnose first
                                 │
                       ┌─────────┴─────────┐
                       │                   │
                 Test/automation       Application/
                    defect               env issue
                       │                   │
                       ▼                   ▼
                  Minimum fix          DON'T FIX
                       │                   │
                       ▼                   ▼
                   Run twice           Report
                       │
                       ▼
                     PASS
                       │
                       ▼
                      ✅
```

## Agent Responsibilities

| Agent | Responsibility | Can modify files? |
|---|---|---|
| Planner | Explore application and create test plans | `specs/*.md` only |
| Generator | Convert approved plans into Playwright tests | Test files |
| Reviewer | Check requirement coverage and project rules | No |
| Healer | Diagnose and safely fix execution failures | Failing test only, within rules |

## Workflow

1. Planner creates an approved Markdown test plan.
2. Generator converts a specific scenario into a Playwright test.
3. Playwright executes the test.
4. Reviewer checks the implementation against the plan and `AGENTS.md`.
5. If Reviewer approves, the test is ready.
6. If Playwright execution fails, Healer diagnoses the failure.
7. Healer fixes only genuine automation defects.
8. Healer never weakens assertions or hides application failures.

## Core Principle

```text
AI agents provide reasoning.
Playwright provides execution.
Project rules provide constraints.
Review provides quality control.
```