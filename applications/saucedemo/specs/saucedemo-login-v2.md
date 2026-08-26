# Test Plan: SauceDemo Login

**Target:** https://www.saucedemo.com
**Seed:** tests/seed.spec.ts
**Date:** 2026-08-25

## Overview
The SauceDemo login page is the primary authentication entry point for the application. This plan covers the successful login flow, the locked-out user restriction, validation for empty required fields, and invalid user credential rejection.

## Preconditions
- The browser is opened to the SauceDemo login page at https://www.saucedemo.com.
- The user is not authenticated and has no active session.
- The login form is visible with Username, Password, and Login fields available.
- The default password for all valid demo users is secret_sauce.

## Scenarios

### Scenario 1.1 — Standard user login succeeds
- **Priority:** P0
- **Tags:** @smoke @critical
- **Requirement covered:** A valid standard user can authenticate and reach the inventory page.
- **Expected result:** The user is redirected to the inventory page after submitting valid credentials.
- **Specialist coverage:** Security
- **Preconditions:** The user is on the login page and has not yet authenticated.
- **Steps:**
  1. Enter standard_user in Username — expected: the field accepts the value and shows a non-empty state.
  2. Enter secret_sauce in Password — expected: the password field accepts the value without error.
  3. Click Login — expected: the app navigates away from the login form and loads the inventory page.
- **Assertions:**
  - The inventory page is visible and contains the Products content.
  - The URL changes from the login page to the inventory route.
  - The login form is no longer visible after successful authentication.
- **Edge cases considered:**
  - Browser autofill or cached credentials
  - Extra whitespace in the entered username
  - Repeated submission after successful login

### Scenario 1.2 — Locked-out user shows access error
- **Priority:** P0
- **Tags:** @critical @regression
- **Requirement covered:** A locked account must be denied access and must display the correct locked-out error message.
- **Expected result:** The user remains on the login page and is blocked from entering the application.
- **Specialist coverage:** Security
- **Preconditions:** The user is on the login page with no active session.
- **Steps:**
  1. Enter locked_out_user in Username — expected: the field accepts the value without redirecting.
  2. Enter secret_sauce in Password — expected: the password field accepts the value.
  3. Click Login — expected: the app blocks access and remains on the login screen.
- **Assertions:**
  - The error message Epic sadface: Sorry, this user has been locked out is visible.
  - The inventory page is not displayed.
  - Username and password fields remain editable after the failed attempt.
- **Edge cases considered:**
  - Multiple rapid retries for the same locked account
  - Previous successful credentials still cached in the browser
  - Validation timing when the error banner appears after submit

### Scenario 1.3 — Empty username submission is rejected
- **Priority:** P1
- **Tags:** @regression
- **Requirement covered:** The system must require a username before allowing login.
- **Expected result:** The user is not authenticated and sees a validation error prompting for a username.
- **Specialist coverage:** None
- **Preconditions:** The user is on the login page with the form reset to empty values.
- **Steps:**
  1. Leave Username empty — expected: the field remains blank.
  2. Enter secret_sauce in Password — expected: the password field accepts the value.
  3. Click Login — expected: the app rejects the submission and does not redirect.
- **Assertions:**
  - The error message Epic sadface: Username is required is visible.
  - No inventory page content is displayed.
  - The application remains on the login page.
- **Edge cases considered:**
  - Username field contains whitespace only
  - Browser auto-complete fills a stale value unexpectedly
  - User submits using the Enter key instead of clicking Login

### Scenario 1.4 — Empty password submission is rejected
- **Priority:** P1
- **Tags:** @regression
- **Requirement covered:** The system must require a password before allowing login.
- **Expected result:** The user is blocked from authenticating until a valid password is entered.
- **Specialist coverage:** None
- **Preconditions:** The user is on the login page with the form reset to empty values.
- **Steps:**
  1. Enter standard_user in Username — expected: the field accepts the value.
  2. Leave Password empty — expected: the field remains blank.
  3. Click Login — expected: the app does not allow access.
- **Assertions:**
  - The error message Epic sadface: Password is required is visible.
  - The login page remains active and no inventory page loads.
  - The username remains populated while the password error is displayed.
- **Edge cases considered:**
  - Password field contains whitespace only
  - Browser auto-fill repopulates a stale value
  - Keyboard-only submission using Enter

### Scenario 1.5 — Invalid credentials are rejected
- **Priority:** P1
- **Tags:** @regression
- **Requirement covered:** Unknown or mismatched credentials must be rejected with the correct generic invalid-login error.
- **Expected result:** The user is kept on the login page and cannot access the application with invalid credentials.
- **Specialist coverage:** Security
- **Preconditions:** The user is on the login page with no active session.
- **Steps:**
  1. Enter an invalid username such as invalid_user in Username — expected: the field accepts the value.
  2. Enter secret_sauce in Password — expected: the value is accepted.
  3. Click Login — expected: the request is rejected and the user remains on the login page.
- **Assertions:**
  - The error message Epic sadface: Username and password do not match any user in this service is displayed.
  - The inventory page does not appear.
  - The login form remains available for another attempt.
- **Edge cases considered:**
  - Valid username with wrong password
  - Valid password with wrong username
  - Repeated invalid attempts after a previous validation error

## Not covered (and why)
- Logout and session persistence are excluded because the request is limited to login behavior.
- Inventory item interactions are not covered because they are outside the authentication flow requested here.
- Multi-user switching beyond the provided demo credentials is excluded because the scope is limited to the login validations described in the plan.
