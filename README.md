# NY.gov SelfRegV3 Registration Fix

A JavaScript hotfix that resolves a critical bug in the NY.gov ID self-registration system where the Social Security Number field fails to render, blocking all account registrations.

## 🚨 The Problem

The NY.gov ID registration page (`my.ny.gov/SelfRegV3`) has a **rendering bug** that causes the SSN input field to be completely missing from the form. Without this field, identity verification fails 100% of the time.

### Symptoms

- User fills out Steps 1 and 2 of registration
- User clicks "Create Account" on Step 3
- **Result:** "Unfortunately, your identity was not able to be verified..."

### Root Cause

The SSN panel in the DOM is empty:

```html
<span id="selfregform:ssnPanel"></span>  <!-- Should contain SSN input -->
```

The page loads SSN masking scripts (`jquery.maskssn.js`) but the actual input field never renders.

## ✅ The Fix

This repository provides a JavaScript injection that:

1. **Injects the missing SSN field** on Step 2 with proper JSF naming
2. **Auto-formats SSN input** as user types (XXX-XX-XXXX)
3. **Persists SSN to Step 3** by injecting hidden fields on the confirmation page
4. **Provides visual confirmation** that the fix is active

## Usage

### Quick Fix (Browser Console)

1. Navigate to `https://my.ny.gov/SelfRegV3/selfregsteptwo.xhtml`
2. Open browser DevTools (F12)
3. Paste the contents of `selfreg-fix.js`
4. Fill in your information including SSN
5. Continue to Step 3

**Important:** On Step 3, paste `step3-fix.js` before clicking "Create Account"

### Bookmarklet

Create a bookmark with this URL:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://raw.githubusercontent.com/barkleesanders/nygov-selfreg-fix/main/selfreg-fix.js';document.body.appendChild(s);})();
```

## Files

| File | Purpose |
|------|---------|
| `selfreg-fix.js` | Main SSN field injection for Step 2 |
| `step3-fix.js` | Hidden field injection for Step 3 confirmation |
| `complete-fix.js` | Combined fix that handles both steps |

## Technical Details

### Affected System

- **Application:** SelfRegV3
- **URL:** `https://my.ny.gov/SelfRegV3/`
- **Framework:** JavaServer Faces (JSF) + PrimeFaces
- **Build:** 12/05/2025 9:11 PM W: (NULL) A: 169PB_1

### Why This Works

The JSF framework expects form fields to be server-rendered, but the SSN panel is empty due to a server-side rendering failure. By injecting a properly-named input field (`selfregform:ssn`), we provide the missing component that the server-side validation expects.

The fix must be applied to **both** Step 2 and Step 3 because:
- Step 2 → Step 3 transition doesn't persist client-injected fields
- Step 3's form submission needs the SSN value present

### Identity Verification

After the SSN is submitted, NY.gov's backend performs identity verification (likely via LexisNexis or similar service) matching:
- Name
- Date of Birth
- Address
- SSN

All four must match public records for verification to succeed.

## Disclaimer

⚠️ **This is a workaround for a government website bug.**

- Use this fix only to register your own account
- Never share your SSN with anyone
- This fix is provided as-is with no warranty
- Report the underlying bug to NY.gov

## Related

- [FOIL Request R000252-010326](https://github.com/barkleesanders/turnstile-debug-harness) - Freedom of Information request about this bug
- [NY.gov Support](https://my.ny.gov/support) - Official support channel

## License

MIT - Use at your own risk.
