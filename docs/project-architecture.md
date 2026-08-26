## Author

**Kalyan Boosara**

Playwright / Test Automation Engineer

- GitHub: https://github.com/pentesterkaly
- LinkedIn: https://www.linkedin.com/in/kalyan-boosara-2847222a/

# Playwright AI Framework Architecture

## 1. Purpose

This document describes the architecture, design principles, AI workflow, repository structure, and portability model of the Playwright AI Test Automation Framework.

The framework is designed to support multiple web applications while keeping reusable automation infrastructure separate from application-specific implementation.

The central objective is:

> Build a repeatable Playwright automation workflow in which AI assists with planning, test generation, review, diagnosis, and safe healing without turning the reusable framework into an application-specific codebase.

---

## 2. High-Level Architecture

```text
                    PLAYWRIGHT AI FRAMEWORK
                              |
        +---------------------+---------------------+
        |                     |                     |
     Planner              Generator             Reviewer
        |                     |                     |
        +---------------------+---------------------+
                              |
                            Healer
                              |
                              v
                       CURRENT APPLICATION
                              |
                 +------------+------------+
                 |                         |
          application.md                 .env
                 |                         |
                 +------------+------------+
                              v
                     playwright.config.ts
                              |
                              v
                           BASE_URL
                              |
                              v
                         Page Objects
                              |
                              v
                            Tests
```

The architecture has two primary boundaries:

1. Reusable framework infrastructure.
2. Application-specific implementation.

---

## 3. Repository Structure

```text
playwright-ai-framework/
|
+-- framework/                         # Reusable framework code
|   +-- fixtures/                      # Shared Playwright fixtures
|   +-- pages/                         # Shared/base Page Objects
|   +-- utils/                         # Reusable helper functions
|
+-- applications/                      # Application-specific implementation
|   +-- saucedemo/
|       +-- config/
|       |   +-- application.md
|       |
|       +-- pages/
|       |   +-- LoginPage.ts
|       |   +-- InventoryPage.ts
|       |
|       +-- specs/
|       |   +-- login-functionality.md
|       |   +-- saucedemo-login-v2.md
|       |
|       +-- tests/
|           +-- auth/
|           |   +-- standard-login.spec.ts
|           |
|           +-- data/
|           |   +-- users.json
|           |
|           +-- seed.spec.ts
|           +-- login-success.spec.ts
|           +-- healer-regression-test.spec.ts
|
+-- .github/
|   +-- agents/
|   |   +-- playwright-test-planner.agent.md
|   |   +-- playwright-test-generator.agent.md
|   |   +-- playwright-test-reviewer.agent.md
|   |   +-- playwright-test-healer.agent.md
|   |
|   +-- workflows/
|
+-- .vscode/
|   +-- mcp.json
|
+-- docs/
|   +-- ai-playwright-framework.md
|   +-- project-architecture.md
|
+-- AGENTS.md
+-- README.md
+-- playwright.config.ts
+-- tsconfig.json
+-- package.json
+-- package-lock.json
+-- .gitignore
```

---

## 4. Reusable Framework vs Application Code

### Reusable framework

```text
framework/
```

This directory should contain code that is genuinely reusable across applications.

Examples:

- Shared Playwright fixtures
- Base Page Objects
- Generic utility functions
- Framework-level abstractions

Application-specific URLs, credentials, page names, locators, and workflows should not be placed here unless they are genuinely reusable.

### Application-specific implementation

```text
applications/<application-name>/
```

This contains everything specific to one application.

Typical contents:

```text
applications/<application-name>/
+-- config/
+-- pages/
+-- specs/
+-- tests/
    +-- data/
```

For SauceDemo:

```text
applications/saucedemo/
```

contains the SauceDemo Page Objects, test plans, test data, configuration, and tests.

---

## 5. Multi-Application Model

The architecture is intentionally project-based.

```text
applications/
|
+-- saucedemo/
|   +-- config/
|   +-- pages/
|   +-- specs/
|   +-- tests/
|
+-- acx/
|   +-- config/
|   +-- pages/
|   +-- specs/
|   +-- tests/
|
+-- another-application/
    +-- config/
    +-- pages/
    +-- specs/
    +-- tests/
```

Adding a new application should not require copying the framework.

The target model is:

```text
Same framework
      |
      +---- SauceDemo
      |
      +---- ACX
      |
      +---- Another application
```

rather than:

```text
SauceDemo framework
ACX framework
Another application framework
```

---

## 6. AI Agent Pipeline

The four specialist agents have separate responsibilities.

```text
Application
    |
    v
 Planner
    |
    v
Approved test plan
    |
    v
 Generator
    |
    v
Generated Playwright test
    |
    v
 Reviewer
    |
    +---- Rejected -> improve/regenerate
    |
    v
 Approved
    |
    v
 Test execution
    |
    +---- PASS -> complete
    |
    +---- FAIL
             |
             v
           Healer
             |
             v
          Diagnose
```

This creates explicit quality gates rather than allowing one AI agent to freely explore, modify, and approve its own work.

---

## 7. Planner Agent

File:

```text
.github/agents/playwright-test-planner.agent.md
```

### Responsibility

The Planner explores the current application and creates a human-readable test plan.

It should:

- Read `AGENTS.md`.
- Read the current application's configuration when application context is required.
- Read the application's seed test.
- Explore the running application when necessary.
- Identify meaningful test scenarios.
- Record expected behaviour.
- Record observed behaviour.
- Identify gaps where requirements cannot be verified.
- Avoid assuming the application is SauceDemo or any other specific application.

### Output

Planner output belongs under:

```text
applications/<application-name>/specs/
```

Example:

```text
applications/saucedemo/specs/login-functionality.md
```

The Planner does not generate Playwright test code.

---

## 8. Generator Agent

File:

```text
.github/agents/playwright-test-generator.agent.md
```

### Responsibility

The Generator converts an approved test scenario into a runnable Playwright TypeScript test.

It should:

- Read `AGENTS.md`.
- Read the approved test plan.
- Read the application configuration when needed.
- Read the seed test.
- Reuse existing application Page Objects.
- Reuse shared framework fixtures.
- Reuse application test data.
- Verify locators and workflows when necessary.
- Follow the project's coding and assertion rules.
- Avoid creating duplicate infrastructure.

### Output

Generated tests belong under:

```text
applications/<application-name>/tests/
```

Application-specific Page Objects belong under:

```text
applications/<application-name>/pages/
```

Shared fixtures belong under:

```text
framework/fixtures/
```

---

## 9. Reviewer Agent

File:

```text
.github/agents/playwright-test-reviewer.agent.md
```

### Responsibility

The Reviewer is a quality gate.

It reviews:

- The approved scenario.
- The generated test.
- Relevant Page Objects.
- Fixtures.
- Test data.
- Application configuration.
- Application behaviour when browser verification is necessary.

It checks:

- Scenario preservation.
- Page Object contract.
- Correct application-specific paths.
- Approved test data usage.
- Locator compliance.
- Assertion quality.
- Unnecessary or contradictory assertions.
- Direct UI locator usage in tests.
- Framework/application separation.
- Whether the generated test actually represents the approved requirement.

The Reviewer should produce an explicit Reviewer Report.

It should not silently modify the test during review.

---

## 10. Healer Agent

File:

```text
.github/agents/playwright-test-healer.agent.md
```

### Responsibility

The Healer diagnoses test failures and may correct a test only when evidence supports that the test itself is defective.

It should investigate:

- Failure output.
- Browser behaviour.
- DOM evidence.
- Console information.
- Network information.
- Requirements.
- Approved test plan.
- Page Objects.
- Fixtures.
- Test data.
- Application configuration.

### Required classification

Every failure should be considered as:

```text
A — Test defect
B — Application defect
C — Environment/infrastructure issue
D — Cannot be confidently classified
```

A failing test is not automatically a test defect.

---

## 11. Healer Safety Model

The intended healing workflow is:

```text
                     TEST FAILURE
                          |
                          v
                      DIAGNOSE
                          |
             +------------+------------+
             |            |            |
             v            v            v
        Test defect   App defect   Environment/
                                   Unknown
             |            |            |
             v            v            v
         Safe fix     Do not fix     Report/
             |         the test      Escalate
             v
          Run test
             |
             v
        Run test again
             |
             v
            PASS
```

The Healer must preserve assertion intent.

It must not weaken an assertion simply to make the test pass.

For example, changing:

```typescript
await expect(inventoryPage.productsHeader).toHaveText('Products');
```

to:

```typescript
await expect(inventoryPage.productsHeader).toBeVisible();
```

would be inappropriate if the text itself is part of the requirement.

---

## 12. Page Object Architecture

The Page Object Model is split between shared/base functionality and application-specific pages.

### Shared Page Objects

```text
framework/pages/
```

Example:

```text
framework/pages/BasePage.ts
```

### Application Page Objects

```text
applications/<application-name>/pages/
```

Example:

```text
applications/saucedemo/pages/LoginPage.ts
applications/saucedemo/pages/InventoryPage.ts
```

### Page Object contract

The project rules require:

- One class per page.
- Page classes extend `BasePage`.
- Constructors take `page: Page`.
- Locators are declared as `readonly`.
- Action methods return `Promise<void>` or the next Page Object.
- No `expect()` calls inside Page Objects.
- UI interaction belongs in Page Objects.
- Tests should not contain direct UI locator definitions.

---

## 13. Locator Strategy

Locator priority is intentionally strict:

1. `getByRole()` with accessible name.
2. `getByLabel()` for form fields.
3. `getByTestId()` using `data-test-id`.
4. `getByText()` only for genuinely static UI text.
5. CSS/XPath only when explicitly approved.

Tests should interact through Page Objects:

```text
Test
  |
  v
Page Object
  |
  v
Locator / Action
  |
  v
Application
```

This keeps tests focused on behaviour rather than implementation details.

---

## 14. Test Data

Application-specific test data belongs under:

```text
applications/<application-name>/tests/data/
```

Example:

```text
applications/saucedemo/tests/data/users.json
```

Test data should be reused rather than duplicated inline.

Secrets must not be stored in test data committed to source control.

Credentials, API keys, tokens, and other secrets should use the approved environment or secret-management mechanism.

---

## 15. Application Configuration

Each application can have:

```text
applications/<application-name>/config/application.md
```

This file contains non-secret application and environment information.

It must not contain:

- Passwords
- API keys
- Tokens
- Authentication secrets
- Other sensitive credentials

Application-specific context should be discovered from the current application's directory rather than hard-coded into reusable AI agent instructions.

---

## 16. Environment Configuration

Environment-specific values should be provided through environment variables.

Example:

```text
BASE_URL=https://www.saucedemo.com
```

The Playwright configuration uses the environment value rather than hard-coding an application URL into the reusable framework.

This allows the same test architecture to be used across environments.

---

## 17. Test Structure

Application tests follow the application directory structure.

Example:

```text
applications/saucedemo/tests/
|
+-- auth/
|   +-- standard-login.spec.ts
|
+-- data/
|   +-- users.json
|
+-- seed.spec.ts
+-- login-success.spec.ts
+-- healer-regression-test.spec.ts
```

Tests should:

- Use the shared fixture.
- Reuse Page Objects.
- Load test data from application test data.
- Use feature-focused `test.describe` blocks.
- Use `test.step` when a flow has more than three actions.
- Use meaningful tags such as `@smoke`, `@regression`, and `@critical`.
- Avoid business logic and UI locator definitions.

---

## 18. Seed Test

Each application can have a seed/baseline test:

```text
applications/<application-name>/tests/seed.spec.ts
```

The seed test provides a basic environment baseline.

It should not be treated as proof that the entire application is healthy.

Relevant application behaviour still needs to be verified when generating, reviewing, or healing tests.

---

## 19. Configuration Boundaries

The reusable AI agents should not contain application-specific assumptions.

They should not hard-code:

```text
SauceDemo
specific URLs
specific credentials
specific page names
specific locators
specific workflows
```

Instead, agents should discover application-specific information from:

```text
applications/<application-name>/
```

This is one of the main mechanisms that makes the framework portable.

---

## 20. Development Methodology

The framework was developed incrementally rather than by creating a large amount of automation infrastructure without validation.

The development sequence was:

1. Establish a minimal Playwright project.
2. Validate the Playwright environment.
3. Establish TypeScript configuration.
4. Add required type support.
5. Add environment configuration.
6. Establish shared fixtures.
7. Establish base Page Object functionality.
8. Separate reusable framework code from application-specific code.
9. Create the application-based directory model.
10. Update project-wide AI rules.
11. Update the Planner.
12. Update the Generator.
13. Update the Reviewer.
14. Update the Healer.
15. Validate TypeScript compilation.
16. Validate the seed test.
17. Generate a real application test.
18. Review the generated test.
19. Create a controlled test defect.
20. Validate Healer diagnosis.
21. Validate safe healing.
22. Run the healed test twice.

This incremental approach provides evidence that each major component works instead of assuming the architecture is correct because it looks correct.

---

## 21. Validation Performed

The framework has been validated against SauceDemo.

### TypeScript

```text
npx tsc --noEmit
```

Result:

```text
PASS
```

### Seed test

Result:

```text
PASS
```

### Standard login test

Result:

```text
PASS
```

### Planner

Validated that the Planner generated application-specific plans under:

```text
applications/saucedemo/specs/
```

### Generator

Validated that the Generator created:

```text
applications/saucedemo/tests/login-success.spec.ts
```

and reused:

- Shared fixtures.
- Existing Page Objects.
- Existing test data.

### Reviewer

Reviewer result:

```text
APPROVED
```

The Reviewer confirmed:

- Page Object compliance.
- Correct application paths.
- Approved test data usage.
- Assertion compliance.
- No direct UI locators.
- Scenario preservation.
- No unnecessary framework duplication.

### Healer

A deliberate test defect was introduced:

```text
Expected: THIS TEXT DOES NOT EXIST
Received: Products
```

The Healer correctly classified the problem as:

```text
A — Test defect
```

It investigated browser evidence, corrected the assertion, preserved the assertion intent, and ran the healed test twice.

Result:

```text
Run 1: PASS
Run 2: PASS
```

---

## 22. Healer Regression Baseline

The project retains:

```text
applications/saucedemo/tests/healer-regression-test.spec.ts
```

This test originated from the controlled failure used to validate the Healer.

It is retained as a known-good baseline for the healing workflow.

It is not intended to replace ordinary application coverage.

The test should not be weakened merely to make it pass.

---

## 23. Adding a New Application

Example:

```text
mkdir -p applications/acx/{config,pages,specs,tests/data}
```

Then add:

```text
applications/acx/
+-- config/
|   +-- application.md
|
+-- pages/
|
+-- specs/
|
+-- tests/
    +-- data/
    +-- seed.spec.ts
```

### Step 1 — Application configuration

Create:

```text
applications/acx/config/application.md
```

with non-secret application information.

### Step 2 — Page Objects

Add only the Page Objects required by the new application.

### Step 3 — Test data

Store application-specific JSON/CSV data under:

```text
applications/acx/tests/data/
```

### Step 4 — Seed test

Create:

```text
applications/acx/tests/seed.spec.ts
```

### Step 5 — Planner

Use the Planner to explore the application and create test plans under:

```text
applications/acx/specs/
```

### Step 6 — Generator

Use the Generator to create tests under:

```text
applications/acx/tests/
```

### Step 7 — Reviewer

Review generated tests before treating them as accepted automation.

### Step 8 — Healer

Use the Healer only when a failure needs diagnosis.

---

## 24. What Should Not Change When Adding an Application

Normally, adding a new application should not require copying or duplicating:

```text
framework/
.github/agents/
AGENTS.md
```

If the new application exposes a capability that is genuinely reusable, the framework may be enhanced deliberately.

The rule is:

> Add reusable capability to the framework; keep application-specific behaviour inside the application directory.

---

## 25. Security and Repository Hygiene

The following must not be committed:

```text
.env
credentials
API keys
tokens
storage-state.json
authentication state
private certificates
```

Generated artifacts should also remain excluded where appropriate:

```text
node_modules/
test-results/
playwright-report/
.playwright-mcp/
.DS_Store
```

The project `.gitignore` is responsible for preventing these files from being staged accidentally.

Before committing:

```bash
git status
```

should be reviewed carefully.

---

## 26. Current Status

```text
Playwright + TypeScript              PASS
Reusable framework layer             PASS
Application isolation                PASS
Environment configuration            PASS
Page Object architecture             PASS
AI Planner                           PASS
AI Generator                         PASS
AI Reviewer                          PASS
AI Healer                            PASS
Controlled healing validation        PASS
TypeScript validation                PASS
SauceDemo validation                 PASS
Second application validation        PENDING
```

The framework has been validated as a working architecture against the first application.

The next major validation is to prove portability by adding a second application without duplicating the framework.

---

## 27. Design Principles

### Application independence

The reusable framework should not depend on one application.

### Separation of concerns

Planning, generation, review, healing, framework infrastructure, and application implementation have separate responsibilities.

### Evidence before healing

A failure must be diagnosed before changing a test.

### Preserve test intent

Healing must not weaken requirements merely to produce a passing result.

### Reuse before duplication

Existing Page Objects, fixtures, utilities, and test data should be reused where appropriate.

### Explicit quality gates

Planner -> Generator -> Reviewer creates a controlled test-development process.

### Small, focused changes

Agents should avoid unnecessary refactoring.

### Human-readable automation

Generated tests should remain understandable and maintainable by engineers.

### Environment independence

Environment details should be configurable rather than embedded in application-independent code.

### Framework evolution through reusable capability

Framework changes should solve genuinely reusable problems, not application-specific problems.

---

## 28. End-to-End Workflow

The complete intended workflow is:

```text
                         RUNNING APPLICATION
                                  |
                                  v
                              PLANNER
                                  |
                                  v
                           TEST PLAN / SPEC
                                  |
                                  v
                             GENERATOR
                                  |
                                  v
                           PLAYWRIGHT TEST
                                  |
                                  v
                             REVIEWER
                                  |
                         +--------+--------+
                         |                 |
                      APPROVED          CHANGES
                         |                 |
                         v                 |
                      EXECUTE <------------+
                         |
                  +------+------+
                  |             |
                 PASS          FAIL
                  |             |
                  v             v
                 DONE         HEALER
                                |
                                v
                             DIAGNOSE
                                |
                +---------------+---------------+
                |               |               |
                v               v               v
          TEST DEFECT      APP DEFECT      UNKNOWN/
                |               |           ENVIRONMENT
                v               v               |
             SAFE FIX       DO NOT FIX          v
                |            THE TEST          REPORT
                v
            RUN TWICE
                |
                v
               PASS
```

The AI is intentionally given boundaries rather than unrestricted authority.

The key engineering principle is:

> A test should not be changed merely because it fails. First determine why it failed.

---

## 29. Long-Term Objective

The framework is intended to evolve into a reusable foundation for multiple application automation projects.

The target model is:

```text
One reusable Playwright framework
             |
             +-- Application A
             |
             +-- Application B
             |
             +-- Application C
             |
             +-- Future applications
```

while retaining the same:

- Engineering rules.
- Page Object standards.
- Fixture architecture.
- AI planning process.
- AI generation process.
- AI review process.
- AI healing safeguards.
- Environment configuration strategy.

The framework is therefore designed around **repeatability, isolation, maintainability, and evidence-based AI assistance**, rather than simply generating Playwright tests as quickly as possible.
