# Test Plan: SauceDemo Login

**Target:** https://www.saucedemo.com
**Seed:** applications/saucedemo/tests/seed.spec.ts
**Date:** 2026-08-26

## Overview
This plan covers the SauceDemo authentication flow from the login page through successful access and the most relevant rejection states. It focuses on the user-visible behaviors that determine whether the user can enter the app or must remain on the login screen.

## Preconditions
- The browser is opened to the SauceDemo login page at https://www.saucedemo.com.
- The user is not authenticated and has no active session.
- The Username, Password, and Login form controls are visible.
- Demo authentication data is sourced from the project’s approved test data rather than hard-coded in this plan.

## Scenarios

### Scenario 1.1 — Standard user login succeeds
- **Priority:** P0
- **Tags:** @smoke @critical
- **Requirement covered:** A valid demo user should be able to authenticate and reach the inventory page.
- **Expected result:** The user is redirected to the inventory view and is no longer blocked by the login form.
- **Specialist coverage:** Security
- **Preconditions:** A valid SauceDemo user is available and the user is on the login page with no active session.
- **Steps:**
  1. Enter the standard demo username in Username — expected: the field accepts the value.
  2. Enter the matching password in Password — expected: the field accepts the value without error.
  3. Click Login — expected: the app leaves the login page and loads the inventory page.
- **Assertions:**
  - The inventory page is visible and the Products heading is displayed.
  - The login fields are no longer visible after successful authentication.
  - The browser URL matches the inventory route rather than the login page.
- **Edge cases considered:**
  - Browser autofill or stale cached username/password values
  - Re-submitting the form after a successful login
  - Submitting with the keyboard instead of the mouse

### Scenario 1.2 — Locked-out user is blocked from access
- **Priority:** P0
- **Tags:** @critical @regression
- **Requirement covered:** A locked account must remain blocked from entering the application.
- **Expected result:** The user stays on the login screen and cannot reach the inventory page.
- **Specialist coverage:** Security
- **Preconditions:** The user is on the login page and has not previously authenticated in the current session.
- **Steps:**
  1. Enter the locked-out demo username in Username — expected: the value is accepted.
  2. Enter the matching password in Password — expected: the value is accepted.
  3. Click Login — expected: the app rejects the login attempt and remains on the current page.
- **Assertions:**
  - An access error is displayed indicating the account is locked.
  - The inventory page is not rendered.
  - The login form remains available for another attempt.
- **Edge cases considered:**
  - Multiple successive failed attempts from the same locked account
  - Previous successful credentials still cached in the browser
  - Validation timing while the error message appears after submit

### Scenario 1.3 — Empty username is rejected
- **Priority:** P1
- **Tags:** @regression
- **Requirement covered:** The application must require a username before allowing login.
- **Expected result:** The user cannot authenticate until a username is entered.
- **Specialist coverage:** None
- **Preconditions:** The user is on the login page with the form reset to empty values.
- **Steps:**
  1. Leave Username empty — expected: the field remains blank.
  2. Enter the valid password in Password — expected: the password field accepts the value.
  3. Click Login — expected: the app rejects the request and stays on the login screen.
- **Assertions:**
  - A required-field validation message is shown for the username.
  - No inventory page content appears.
  - The login form remains visible and interactive.
- **Edge cases considered:**
  - Username field contains only whitespace
  - Browser auto-fill repopulates a stale username
  - Submission using the Enter key instead of clicking the button

### Scenario 1.4 — Empty password is rejected
- **Priority:** P1
- **Tags:** @regression
- **Requirement covered:** The application must require a password before allowing login.
- **Expected result:** The user remains unauthenticated until the password is supplied.
- **Specialist coverage:** None
- **Preconditions:** The user is on the login page with the form reset to empty values.
- **Steps:**
  1. Enter the valid username in Username — expected: the field accepts the value.
  2. Leave Password empty — expected: the field remains blank.
  3. Click Login — expected: the app rejects the request and does not redirect.
- **Assertions:**
  - A required-field validation message is shown for the password.
  - The inventory page does not render.
  - The login page remains available for correction and retry.
- **Edge cases considered:**
  - Password field contains only whitespace
  - Browser auto-fill repopulates a stale password
  - Keyboard-only submission using the Enter key

### Scenario 1.5 — Invalid credentials are rejected
- **Priority:** P1
- **Tags:** @regression
- **Requirement covered:** Unknown or mismatched credentials must not authenticate the user.
- **Expected result:** The app blocks access and continues to show the login form for another try.
- **Specialist coverage:** Security
- **Preconditions:** The user is on the login page and has no active session.
- **Steps:**
  1. Enter an invalid username in Username — expected: the field accepts the value.
  2. Enter a non-matching password in Password — expected: the field accepts the value.
  3. Click Login — expected: the app rejects the attempt and remains on the login screen.
- **Assertions:**
  - A login failure message is displayed.
  - The inventory page is not visible.
  - The username and password fields remain editable for retry.
- **Edge cases considered:**
  - Valid username with wrong password
  - Valid password with wrong username
  - Repeated invalid attempts after a prior validation error

## Not covered (and why)
- Logout or session expiry behavior is out of scope because the request is limited to login functionality.
- Inventory browsing and cart actions are excluded because they are beyond the authentication flow being planned.
- Additional demo or admin users are not covered unless the application exposes them in project data or browser evidence.
