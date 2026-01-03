# Security Vulnerability Report: NY.gov SelfRegV3 SSN Field Rendering Failure

**Date:** January 3, 2026  
**Reported By:** Anonymous Researcher  
**Severity:** HIGH - Complete service denial for all users  
**Affected System:** NY.gov ID Self Registration (SelfRegV3)

---

## Executive Summary

A critical rendering bug in the NY.gov ID registration system causes the Social Security Number (SSN) input field to fail to render, making identity verification impossible and blocking 100% of new account registrations.

---

## Vulnerability Details

### Affected URLs
- `https://my.ny.gov/SelfRegV3/selfregsteptwo.xhtml`
- Build: `12/05/2025 9:11 PM W: (NULL) A: 169PB_1`

### Technical Description

The registration form contains an empty SSN panel that should contain a user input field:

```html
<!-- EXPECTED: SSN input field inside this span -->
<span id="selfregform:ssnPanel"></span>

<!-- ACTUAL: Span is completely empty -->
```

The application loads SSN-related JavaScript (`jquery.maskssn.js`) expecting to find elements with class `.ssnId`, but no such elements exist because the server-side JSF component fails to render.

### Root Cause

The JSF/PrimeFaces server-side rendering is failing to populate the `ssnPanel` component. The `W: (NULL)` in the build footer suggests possible null configuration values that may be affecting component rendering.

### Impact

1. **Service Denial:** 100% of users attempting to register are blocked
2. **Identity Verification Failure:** Without SSN, the backend verification service cannot match user identity
3. **User Error Message:** Users receive "Unfortunately, your identity was not able to be verified" with no explanation of the actual cause
4. **Public Trust:** Users may believe their identity cannot be verified when the actual issue is a rendering bug

---

## Proof of Concept

### Reproduction Steps

1. Navigate to `https://my.ny.gov/SelfRegV3/selfregstepone.xhtml`
2. Complete Step 1 (name, email, password)
3. On Step 2, observe: No SSN field is visible
4. Fill remaining fields and click Continue
5. On Step 3, click "Create Account"
6. Result: Redirected to `selfregblocked.xhtml`

### Verification

Open browser DevTools console:
```javascript
document.getElementById('selfregform:ssnPanel').innerHTML
// Returns: "" (empty string)
```

---

## Workaround Discovered

A client-side JavaScript injection can create the missing SSN field, allowing registration to complete successfully. This workaround has been documented at:

- **GitHub:** [REPOSITORY]/nygov-selfreg-fix
- **FOIL Reference:** R000252-010326 (submitted January 3, 2026)

---

## Recommendations

1. **Immediate:** Investigate JSF rendering failure for `ssnPanel` component
2. **Short-term:** Add server-side validation to detect missing SSN and provide clear error messaging
3. **Medium-term:** Implement client-side form validation to catch missing required fields before submission
4. **Long-term:** Add monitoring for registration form field rendering to detect similar issues

---

## Additional Vulnerabilities Noted

During investigation, the following related issues were observed:

### GovQA FOIL Portal (itsny.govqa.us)
- **Issue:** BotDetect CAPTCHA renders with 0x0 dimensions due to CSS layout collapse
- **Impact:** Users cannot complete CAPTCHA, blocking FOIL submissions
- **Reference:** [REPOSITORY]/turnstile-debug-harness

### SelfRegV3 reCAPTCHA Implementation
- **Issue:** `setToken()` function not called on Step 3 "Create Account" button
- **Impact:** May result in stale or missing reCAPTCHA tokens affecting verification scoring

---

## Contact Information

**Reporter:** Anonymous Researcher  
**Email:** [REDACTED]  
**GitHub:** [REPOSITORY]  

I am available to provide additional technical details or assist with remediation efforts.

---

## Disclosure Timeline

| Date | Action |
|------|--------|
| Jan 3, 2026 | Vulnerability discovered during registration attempt |
| Jan 3, 2026 | Root cause analysis completed |
| Jan 3, 2026 | Workaround developed and tested |
| Jan 3, 2026 | FOIL request R000252-010326 submitted |
| Jan 3, 2026 | Public GitHub repositories created for workarounds |
| Jan 3, 2026 | Security report submitted to CISO@its.ny.gov |
