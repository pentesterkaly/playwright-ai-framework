## Author

**Kalyan Boosara**

Playwright / Test Automation Engineer

- GitHub: https://github.com/pentesterkaly
- LinkedIn: https://www.linkedin.com/in/kalyan-boosara-2847222a/

# Playwright AI Test Automation Framework

A reusable, application-independent Playwright + TypeScript automation framework designed to work with AI-assisted test planning, generation, review, and healing.

The framework separates **reusable automation infrastructure** from **application-specific implementation**, allowing a new application to be added without rebuilding the framework or rewriting the AI agent instructions.

---

## Overview

This project was developed around a simple objective:

> Build a Playwright automation framework that can be taken from one application to another while keeping the framework, testing standards, and AI workflow reusable.

The framework combines:

- Playwright
- TypeScript
- Page Object Model
- Custom fixtures
- Environment-based configuration
- Application-specific test plans and test data
- AI-assisted planning
- AI-assisted test generation
- AI-assisted test review
- AI-assisted failure diagnosis and healing

The current implementation is validated against **SauceDemo** as the first application under test.

SauceDemo is treated as an application-specific example. It is deliberately isolated from the reusable framework.

---

## Quick Start

This section is intended for someone cloning the repository and setting it up in VS Code for the first time.

### 1. Clone the repository

```bash
git clone https://github.com/pentesterkaly/playwright-ai-framework.git
cd playwright-ai-framework
```

Open the folder in VS Code.

If the `code` command is available:

```bash
code .
```

Otherwise use **VS Code → File → Open Folder**.

### 2. Install dependencies

From the VS Code terminal:

```bash
npm install
npx playwright install chromium
```

### 3. Configure the environment

Create a local `.env` file in the project root:

```env
BASE_URL=https://www.saucedemo.com
```

Do **not** commit `.env`.

The repository `.gitignore` already excludes it.

### 4. Validate the installation

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Then run the application seed test:

```bash
npx playwright test applications/saucedemo/tests/seed.spec.ts --project=chromium --reporter=line
```

A successful TypeScript check produces no output.

The seed test should pass before continuing with the AI workflow.

### 5. Use the AI agents from VS Code

Open **GitHub Copilot Chat** in VS Code and select **Agent** mode.

The repository contains four specialist AI agents:

- **Planner** — explores the application and creates test plans.
- **Generator** — converts approved plans into Playwright tests.
- **Reviewer** — reviews generated tests against project rules and requirements.
- **Healer** — diagnoses test failures and fixes test defects only when evidence supports the fix.

Recommended workflow:

```text
Planner
   ↓
Approved specification
   ↓
Generator
   ↓
Generated Playwright test
   ↓
Reviewer
   ↓
Execute
   ↓
PASS ───────────────→ Done
   ↓
FAIL
   ↓
Healer
   ↓
Diagnose
   ↓
Fix only when justified
   ↓
Verify
```

### 6. Example Planner request

In VS Code Agent mode:

```text
Read AGENTS.md and use the Playwright Test Planner agent.
Explore the current SauceDemo application and create a test plan
for the login functionality.
```

Planner output belongs under:

```text
applications/saucedemo/specs/
```

### 7. Example Generator request

After approving a scenario:

```text
Use the Playwright Test Generator agent to implement the approved
login scenario from applications/saucedemo/specs/login-functionality.md.
Reuse the existing Page Objects, shared fixture, and approved test data.
```

Generated tests belong under:

```text
applications/saucedemo/tests/
```

### 8. Example Reviewer request

```text
Use the Playwright Test Reviewer agent to review the generated test.
Do not modify any files.
```

### 9. Example Healer request

When a test fails:

```text
Use the Playwright Test Healer agent to diagnose the failure.
Do not change the test unless evidence shows it is a test defect.
Preserve the original test intent.
```

### 10. Run tests manually

Run the complete suite:

```bash
npx playwright test
```

Run a specific test:

```bash
npx playwright test applications/saucedemo/tests/auth/standard-login.spec.ts --project=chromium --reporter=line
```

Run the generated login test:

```bash
npx playwright test applications/saucedemo/tests/login-success.spec.ts --project=chromium --reporter=line
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

---

# Architecture

The project is divided into reusable framework infrastructure and application-specific implementation.

```text
playwright-ai-framework/
│
├── framework/                         # Reusable framework code
│   ├── fixtures/                      # Shared Playwright fixtures
│   ├── pages/                         # Shared/base Page Objects
│   └── utils/                         # Reusable helper functions
│
├── applications/                      # Application-specific code
│   └── saucedemo/
│       ├── config/
│       │   └── application.md
│       │
│       ├── pages/
│       │   ├── LoginPage.ts
│       │   └── InventoryPage.ts
│       │
│       ├── specs/
│       │   ├── login-functionality.md
│       │   └── saucedemo-login-v2.md
│       │
│       └── tests/
│           ├── auth/
│           │   └── standard-login.spec.ts
│           ├── data/
│           │   └── users.json
│           ├── login-success.spec.ts
│           ├── healer-regression-test.spec.ts
│           └── seed.spec.ts
│
├── .github/
│   ├── agents/
│   │   ├── playwright-test-planner.agent.md
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-reviewer.agent.md
│   │   └── playwright-test-healer.agent.md
│   └── workflows/
│
├── .vscode/
│   └── mcp.json
│
├── docs/
│   ├── ai-playwright-framework.md
│   └── project-architecture.md
│
├── AGENTS.md
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# Core Design Principle

The most important architectural decision is the separation between:

## Reusable framework

```text
framework/
```

and:

## Application-specific implementation

```text
applications/<application-name>/
```

This prevents application-specific logic from leaking into the reusable automation framework.

For example, SauceDemo's:

- URLs
- credentials
- Page Objects
- test data
- test plans
- application-specific tests

belong under:

```text
applications/saucedemo/
```

They do not belong under:

```text
framework/
```

This makes the framework portable.

---

# Adding Another Application

A new application can be introduced by adding another application directory:

```text
applications/
├── saucedemo/
└── acx/
```

The new application would typically contain:

```text
applications/acx/
├── config/
│   └── application.md
├── pages/
├── specs/
└── tests/
    ├── data/
    └── ...
```

The reusable framework remains:

```text
framework/
```

The AI agents remain:

```text
.github/agents/
```

The project-wide rules remain:

```text
AGENTS.md
```

The objective is that adding a new application should primarily require adding its own configuration, Page Objects, test data, test plans, and tests — not rebuilding the framework.

---

# AI Agent Workflow

The framework uses four specialist AI agents.

```text
                     ┌─────────────┐
                     │   Planner   │
                     └──────┬──────┘
                            │
                            ▼
                   Approved test plan
                            │
                            ▼
                     ┌─────────────┐
                     │  Generator  │
                     └──────┬──────┘
                            │
                            ▼
                     Generated test
                            │
                            ▼
                     ┌─────────────┐
                     │  Reviewer   │
                     └──────┬──────┘
                            │
                            ▼
                        APPROVED
                            │
                            ▼
                     Test execution
                            │
                     ┌──────┴──────┐
                     │             │
                   PASS          FAIL
                                   │
                                   ▼
                            ┌─────────────┐
                            │   Healer    │
                            └──────┬──────┘
                                   │
                                   ▼
                             Diagnose first
                            /                                 Test defect          App defect
                       │                    │
                       ▼                    ▼
                   Safe fix             Do not fix
                       │                    │
                       ▼                    ▼
                   Run twice             Report
```

The agents are intentionally separated by responsibility.

---

# 1. Planner Agent

File:

```text
.github/agents/playwright-test-planner.agent.md
```

The Planner:

- Reads the project rules.
- Reads the active application's configuration.
- Reads the application seed test.
- Explores the running application when required.
- Identifies test scenarios.
- Records expected behaviour.
- Records observed behaviour.
- Identifies gaps where behaviour cannot be verified.
- Produces a human-readable Markdown test plan.

Planner output belongs under:

```text
applications/<application-name>/specs/
```

The Planner does not write Playwright test code.

It is deliberately read-only with respect to the application and only writes its planning output.

---

# 2. Generator Agent

File:

```text
.github/agents/playwright-test-generator.agent.md
```

The Generator takes an approved scenario from the application's test plan and converts it into runnable Playwright TypeScript.

The Generator is expected to:

- Read `AGENTS.md`.
- Read the application configuration.
- Read the approved scenario.
- Read the seed test.
- Reuse existing Page Objects.
- Reuse shared fixtures.
- Reuse application test data.
- Verify locators and workflows against the application when necessary.
- Generate a focused test.
- Avoid duplicate infrastructure.

Generated tests belong under:

```text
applications/<application-name>/tests/
```

Application-specific Page Objects belong under:

```text
applications/<application-name>/pages/
```

Shared framework fixtures belong under:

```text
framework/fixtures/
```

---

# 3. Reviewer Agent

File:

```text
.github/agents/playwright-test-reviewer.agent.md
```

The Reviewer provides a quality gate between test generation and accepted automation.

It reviews:

- The approved scenario.
- The generated test.
- Relevant Page Objects.
- Fixtures.
- Test data.
- Application configuration.
- Application behaviour when verification is necessary.

The Reviewer checks:

- Scenario preservation.
- Page Object compliance.
- Locator compliance.
- Assertion quality.
- Test data usage.
- Framework/application separation.
- Unnecessary or contradictory assertions.
- Whether the test actually represents the approved requirement.

The Reviewer must not silently change the test during review.

The result is a Reviewer Report with an explicit decision.

---

# 4. Healer Agent

File:

```text
.github/agents/playwright-test-healer.agent.md
```

The Healer is not simply an automatic "make the test pass" mechanism.

It must diagnose the failure first.

The failure should be classified as one of:

```text
A — Test defect
B — Application defect
C — Environment/infrastructure issue
D — Cannot be confidently classified
```

A test failing does not automatically mean the test is wrong.

The Healer should investigate:

- Test output.
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

If the application itself is behaving incorrectly, the Healer must not rewrite the test simply to make it pass.

---

# Healer Safety Model

The intended healing workflow is:

```text
Test failure
     │
     ▼
Diagnose
     │
     ├── Test defect
     │      │
     │      ▼
     │   Safe correction
     │      │
     │      ▼
     │   Run test
     │      │
     │      ▼
     │   Run test again
     │      │
     │      ▼
     │    PASS
     │
     ├── Application defect
     │      │
     │      ▼
     │   Do not change test
     │      │
     │      ▼
     │    Report
     │
     ├── Environment issue
     │      │
     │      ▼
     │    Report
     │
     └── Uncertain
            │
            ▼
         Escalate
```

The Healer must preserve the original assertion intent.

It must not turn a meaningful assertion into a weaker assertion merely to obtain a passing result.

For example, changing:

```typescript
await expect(inventoryPage.productsHeader).toHaveText('Products');
```

to:

```typescript
await expect(inventoryPage.productsHeader).toBeVisible();
```

just to make a failing test pass would be an unacceptable healing strategy when the text itself is part of the requirement.

---

# Page Object Model

The framework follows a strict Page Object contract.

## Shared Page Objects

Reusable/base Page Objects belong under:

```text
framework/pages/
```

For example:

```text
framework/pages/BasePage.ts
```

## Application Page Objects

Application-specific Page Objects belong under:

```text
applications/<application-name>/pages/
```

For example:

```text
applications/saucedemo/pages/LoginPage.ts
applications/saucedemo/pages/InventoryPage.ts
```

The Page Object rules include:

- One class per page.
- Page classes extend `BasePage`.
- Constructor accepts `page: Page`.
- Locators are declared as `readonly`.
- Page Objects contain UI interaction and page-level behaviour.
- Page Objects do not contain `expect()` assertions.
- Action methods return `Promise<void>` or the next Page Object.
- Tests should not contain direct UI locator definitions.

---

# Locator Strategy

Locators follow a strict priority:

1. `getByRole()` with accessible name
2. `getByLabel()` for form fields
3. `getByTestId()` using `data-test-id`
4. `getByText()` for genuinely static UI text
5. CSS/XPath only when explicitly approved

Tests should not directly create UI locators.

Instead:

```text
Test
  ↓
Page Object
  ↓
Locator
  ↓
Application
```

This keeps tests readable and reduces locator duplication.

---

# Test Data

Application-specific test data belongs under:

```text
applications/<application-name>/tests/data/
```

For example:

```text
applications/saucedemo/tests/data/users.json
```

Credentials and other sensitive information must not be committed to the repository.

Environment values belong in the appropriate environment/secret mechanism.

The `.env` file should not be committed.

---

# Environment Configuration

The framework uses environment variables rather than hard-coding the active environment into the Playwright configuration.

For example:

```text
BASE_URL=https://www.saucedemo.com
```

The Playwright configuration consumes:

```typescript
baseURL: process.env.BASE_URL
```

This allows the same framework to target different environments without changing test code.

---

# Application Configuration

Each application has its own:

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

The AI agents use the application configuration to understand the current application without hard-coding a particular product into the framework.

---

# Configuration Philosophy

The framework intentionally avoids putting application-specific URLs and credentials into reusable AI agents.

The agents should discover application-specific information from:

```text
applications/<application-name>/
```

rather than containing assumptions such as:

```text
SauceDemo
https://www.saucedemo.com
standard_user
```

This is important for portability.

---

# Running the Tests

Run all Playwright tests:

```bash
npx playwright test
```

Run a specific test:

```bash
./node_modules/.bin/playwright test applications/saucedemo/tests/auth/standard-login.spec.ts --project=chromium --reporter=line
```

Run the generated login test:

```bash
./node_modules/.bin/playwright test applications/saucedemo/tests/login-success.spec.ts --project=chromium --reporter=line
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

A successful TypeScript validation produces no output.

---

# Browser Projects

The current Playwright configuration includes:

- Chromium
- Firefox
- WebKit

Mobile and branded-browser projects can be enabled when required.

The framework should not assume that every application requires every browser.

Browser coverage should be based on the project's actual requirements.

---

# Test Tags

Tests can use tags such as:

```text
@smoke
@regression
@critical
```

Tags should communicate the purpose or priority of the test rather than being added without reason.

---

# Seed Test

Each application can have a seed/baseline test:

```text
applications/<application-name>/tests/seed.spec.ts
```

The seed test provides a basic environment baseline.

It should not be treated as proof that the application is completely healthy.

The Planner, Generator, Reviewer, and Healer must still validate relevant application behaviour when required.

---

# AI Agent Rules

The project-wide AI rules are stored in:

```text
AGENTS.md
```

These rules define:

- Framework architecture
- Folder structure
- Coding conventions
- Locator rules
- Page Object contract
- Assertion rules
- Forbidden practices
- Test creation rules
- Application/framework separation

The specialist agents under:

```text
.github/agents/
```

must follow these project rules.

---

# Important Separation Rule

Application-specific code must not be moved into the reusable framework simply because an agent needs it.

For example:

```text
applications/saucedemo/pages/LoginPage.ts
```

is application-specific.

It should not become:

```text
framework/pages/LoginPage.ts
```

unless the page abstraction is genuinely reusable across multiple applications.

Likewise, SauceDemo test data should not be placed into:

```text
framework/
```

The framework should remain generic.

---

# What Makes This Architecture Portable?

The framework has three layers:

```text
┌──────────────────────────────────────────────┐
│              AI WORKFLOW                    │
│ Planner / Generator / Reviewer / Healer     │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│             REUSABLE FRAMEWORK              │
│ fixtures / base pages / utilities           │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│          APPLICATION IMPLEMENTATION         │
│ config / pages / specs / tests / data       │
└──────────────────────────────────────────────┘
```

The application layer can change while the reusable layers remain stable.

---

# Development Approach

The framework was developed incrementally rather than by creating a large amount of automation infrastructure upfront.

The development process followed this pattern:

1. Establish a minimal Playwright project.
2. Validate the basic Playwright environment.
3. Add TypeScript configuration.
4. Add Node type definitions.
5. Add environment configuration using `dotenv`.
6. Establish shared fixtures and Page Objects.
7. Introduce application-specific folders.
8. Separate reusable framework code from application-specific code.
9. Update project-wide AI rules.
10. Update the Planner agent.
11. Update the Generator agent.
12. Update the Reviewer agent.
13. Update the Healer agent.
14. Validate TypeScript compilation.
15. Validate the seed test.
16. Validate generated tests.
17. Validate Reviewer approval.
18. Create a controlled test defect.
19. Validate Healer diagnosis.
20. Validate safe healing.
21. Run the healed test twice.

This incremental approach reduces the risk of creating a large framework that has never actually been validated.

---

# Validation Performed

The architecture has been tested against SauceDemo.

## TypeScript

```text
npx tsc --noEmit
```

Result:

```text
PASS
```

## Seed test

Result:

```text
PASS
```

## Standard login test

Result:

```text
PASS
```

## Planner

Validated that the Planner generated:

```text
applications/saucedemo/specs/login-functionality.md
```

rather than using the old root-level:

```text
specs/
```

## Generator

Validated that the Generator created:

```text
applications/saucedemo/tests/login-success.spec.ts
```

and reused:

- Shared fixture
- Existing Login Page Object
- Existing test data

## Reviewer

Reviewer result:

```text
APPROVED
```

The Reviewer confirmed:

- Page Object compliance
- Correct application paths
- Approved test data usage
- Assertion compliance
- No direct UI locators
- Scenario preservation
- No unnecessary framework duplication

## Healer

A deliberate test defect was introduced:

```text
Expected: THIS TEXT DOES NOT EXIST
Received: Products
```

The Healer correctly classified it as:

```text
A — test defect
```

It investigated browser evidence, corrected the assertion, preserved the assertion intent, and ran the healed test twice.

Result:

```text
Run 1: PASS
Run 2: PASS
```

No Page Objects, fixtures, configuration, or application data were modified during healing.

---

# Healer Regression Baseline

The project retains:

```text
applications/saucedemo/tests/healer-regression-test.spec.ts
```

This test originated from the deliberate failure used to validate the Healer.

It is retained as a known-good baseline for the healing workflow.

It is not intended to replace ordinary application coverage.

The test should not be weakened merely to make it pass.

---

# SauceDemo

SauceDemo is currently used as the first demonstration application.

Its application-specific implementation is isolated under:

```text
applications/saucedemo/
```

This includes:

- Application configuration
- Page Objects
- Test plans
- Test data
- Tests

The reusable framework does not depend on SauceDemo.

The project can therefore be extended with another application such as:

```text
applications/acx/
```

without turning the reusable framework into an ACX-specific or SauceDemo-specific framework.

---

# Moving to a New Application

When adding a new application:

## 1. Create the application directory

```bash
mkdir -p applications/acx/{config,pages,specs,tests/data}
```

## 2. Add application configuration

Create:

```text
applications/acx/config/application.md
```

with non-secret application information.

## 3. Add application Page Objects

Create only the Page Objects required by the new application.

## 4. Add application test data

Place JSON/CSV data under:

```text
applications/acx/tests/data/
```

Do not hard-code credentials into tests.

## 5. Add a seed test

Create:

```text
applications/acx/tests/seed.spec.ts
```

## 6. Generate test plans

Use the Planner agent.

Plans should be written to:

```text
applications/acx/specs/
```

## 7. Generate tests

Use the Generator agent.

Tests should be written to:

```text
applications/acx/tests/
```

## 8. Review

Run the Reviewer agent before accepting generated tests.

## 9. Heal only when required

Use the Healer to diagnose failures.

Do not automatically assume every failure is a test defect.

---

# What Should Not Change When Adding an Application

Normally, adding a new application should not require changing:

```text
framework/
.github/agents/
AGENTS.md
```

If the new application exposes a genuinely reusable requirement that the framework cannot currently support, then the framework may be enhanced deliberately.

The goal is:

> Extend the framework when a capability is genuinely reusable, not to move application-specific behaviour into the framework.

---

# Security and Secrets

Do not commit:

```text
.env
credentials
API keys
tokens
storage-state.json
authentication state
private certificates
```

Use environment variables or approved secret-management mechanisms.

Application configuration Markdown files should contain only non-secret information.

The repository `.gitignore` also excludes generated/local artifacts such as:

```text
node_modules/
test-results/
playwright-report/
.playwright-mcp/
.DS_Store
```

---

# Git and Repository Hygiene

Before committing changes, review:

```bash
git status
```

Check that:

- Secrets are not staged.
- Temporary debug files are not staged.
- Browser recordings/traces are not unintentionally committed.
- Application-specific changes remain under the correct application directory.
- Framework changes are genuinely reusable.

For a new checkout:

```bash
npm install
npx playwright install chromium
```

Then validate:

```bash
npx tsc --noEmit
npx playwright test applications/saucedemo/tests/seed.spec.ts --project=chromium
```

---

# Project Development Workflow

The intended engineering workflow is:

```text
Explore
   ↓
Plan
   ↓
Approve scenario
   ↓
Generate
   ↓
Review
   ↓
Execute
   ↓
PASS ───────────────→ Done
   ↓
FAIL
   ↓
Diagnose
   ↓
Classify
   ↓
Fix only if it is a test defect
   ↓
Verify twice
```

The AI is intentionally given boundaries rather than unrestricted authority.

The key engineering principle is:

> A test should not be changed merely because it fails. First determine why it failed.

---

# Long-Term Objective

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

- Engineering rules
- Page Object standards
- Fixture architecture
- AI planning process
- AI generation process
- AI review process
- AI healing safeguards
- Environment configuration strategy

The framework is designed around **repeatability, isolation, maintainability, and evidence-based AI assistance**, rather than simply generating Playwright tests as quickly as possible.
