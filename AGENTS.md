# Project rules for AI agents

You are working in a Playwright TypeScript automation project.

Follow these rules for every code change.

## Stack

- Playwright 1.56+ with TypeScript
- Node 20+
- Test runner: @playwright/test
- Reporter: Allure + built-in HTML
- CI: GitHub Actions, sharded

## Folder structure

### Reusable framework

- `framework/pages/` — Page Object classes and shared/base Page Objects
- `framework/fixtures/` — Custom fixtures extending base test
- `framework/utils/` — Pure helpers, no test logic

### Application-specific projects

Application-specific files must live under:

- `applications/<application-name>/pages/` — Application-specific Page Object classes
- `applications/<application-name>/tests/` — Application-specific test specs, mirroring the app URL structure
- `applications/<application-name>/tests/data/` — JSON/CSV test data
- `applications/<application-name>/specs/` — Planner output (Markdown plans)
- `applications/<application-name>/config/application.md` — Application-under-test configuration; contains non-secret application and environment details

The reusable framework under `framework/` must remain application-independent.

Do not place application-specific Page Objects, tests, test data, or test plans under `framework/`.

Do not assume legacy root-level `src/`, `tests/`, `specs/`, or `config/` directories exist.

## Application configuration

- `applications/<application-name>/config/application.md` defines the current application under test and its environment.
- Agents must read the active application's `config/application.md` when application-specific context is required.
- Do not store passwords, API keys, tokens, or other secrets in `applications/<application-name>/config/application.md`.
- Application-specific credentials must remain in the project's approved test-data or environment/secret mechanism.
- The framework and AI agents must remain application-independent.
- When moving this framework to another application, update the application-specific configuration and application infrastructure rather than rewriting the AI agent framework.

## Coding conventions

- Import test from `framework/fixtures/base.ts`, never from `@playwright/test` directly
- Use `test.describe` per feature area
- One logical assertion group per test
- Use `test.step` for readability when a flow has more than 3 actions
- File names: kebab-case (`add-to-cart.spec.ts`)

## Locator priority (STRICT — do not deviate)

1. `getByRole` with accessible name
2. `getByLabel` for form fields
3. `getByTestId` (attribute is `data-test-id`)
4. `getByText` only for genuinely static UI text
5. CSS / XPath — forbidden unless approved in PR

## Page Object contract

- One class per page, extends `BasePage`
- Constructor takes `page: Page` only
- All locators declared as `readonly` in constructor
- Action methods return `Promise<void>` OR the next page object
- No `expect()` calls inside page objects — assertions belong in tests
- No business logic in tests — put it in page objects or helpers
- UI locators must be declared and accessed through Page Objects.
- Test specs must not use direct `page.getByRole()`, `page.getByLabel()`, `page.getByTestId()`, `page.getByText()`, or `page.locator()` calls.
- Assertions may target locators exposed by Page Objects.

## Assertion rules

- Web-first assertions only (`expect(locator).toBeVisible()`)
- No `page.waitForTimeout` — ever
- No `waitForSelector` — use locator auto-waiting
- Custom timeouts only when justified in a code comment

## When adding a new test

- Mirror the app URL structure inside `applications/<application-name>/tests/`
- Reuse existing page objects — do not create parallel infra
- Load test data from `applications/<application-name>/tests/data/`, not inline
- Tag tests with `@smoke`, `@regression`, or `@critical` as appropriate

## Forbidden

- Do not skip or comment out failing tests to make CI green
- Do not use `page.evaluate` unless there is no MCP tool alternative
- Do not commit `.env`, credentials, `storage-state.json`, or auth tokens
- Do not modify `playwright.config.ts` without asking
- Do not add new npm dependencies without asking
- Do not use `page.pause()` in committed code

## When you (the agent) are unsure

- Ask a clarifying question before generating code
- Prefer a smaller, focused change over a big refactor
- If a required file does not exist, ask before creating it