# NY.gov Security Vulnerability Report & Fix

**Comprehensive security audit and hotfixes for critical vulnerabilities in NY.gov systems.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚨 Executive Summary

This repository documents **13 security vulnerabilities** discovered in NY.gov systems during a comprehensive security audit conducted on January 3, 2026. It also provides working hotfixes for the most critical issues.

### Vulnerability Overview

| Severity | Count | Key Issues |
|----------|-------|------------|
| **CRITICAL** | 2 | Session hijacking, Registration denial |
| **HIGH** | 3 | User enumeration, Stack disclosure |
| **MEDIUM** | 4 | CAPTCHA broken, Missing SRI |
| **LOW** | 4 | Info disclosure, Config issues |

---

## 📋 All Vulnerabilities (Highest to Lowest Risk)

### CRITICAL (Immediate Action Required)

| # | Vulnerability | CVSS | System | Impact |
|---|---------------|------|--------|--------|
| 1 | **Session ID in URL** | 9.1 | GovQA FOIL | Session hijacking via Referer headers |
| 2 | **SSN Field Missing** | 8.5 | SelfRegV3 | 100% registration failure |

### HIGH

| # | Vulnerability | CVSS | System | Impact |
|---|---------------|------|--------|--------|
| 3 | User/Email Enumeration | 7.5 | SelfRegV3 | Account discovery for attacks |
| 4 | CAPTCHA Invisibility | 7.0 | GovQA | FOIL submissions blocked |
| 5 | IBM WebSphere Disclosure | 6.5 | SelfRegV3 | Targeted exploit development |

### MEDIUM

| # | Vulnerability | CVSS | System | Impact |
|---|---------------|------|--------|--------|
| 6 | Clickjacking | 6.1 | All Sites | UI redressing attacks |
| 7 | Resource Loading Failures | 5.5 | SelfRegV3 | Component malfunction |
| 8 | Password Reset Enumeration | 5.3 | FPSV4 | Username discovery |
| 9 | Missing Subresource Integrity | 5.0 | All Sites | Supply chain attacks |

### LOW

| # | Vulnerability | CVSS | System | Impact |
|---|---------------|------|--------|--------|
| 10 | Missing Security Headers | 4.0 | All Sites | Reduced protections |
| 11 | Build Info Disclosure | 3.0 | SelfRegV3 | Version fingerprinting |
| 12 | Broken Error Handler | 2.5 | All Sites | Poor hygiene |
| 13 | Device Session ID Exposure | 2.0 | SelfRegV3 | Increased attack surface |

---

## 🔧 The Fix (SSN Field Hotfix)

### The Problem

The NY.gov ID registration page has a **rendering bug** that causes the SSN input field to be completely missing:

```html
<span id="selfregform:ssnPanel"></span>  <!-- EMPTY - BUG -->
```

Without SSN, identity verification fails 100% of the time.

### Quick Fix (Browser Console)

1. Navigate to `https://my.ny.gov/SelfRegV3/selfregsteptwo.xhtml`
2. Open browser DevTools (F12)
3. Paste the contents of `selfreg-fix.js`
4. Fill in your information including SSN
5. Continue to Step 3
6. **On Step 3**, paste `step3-fix.js` before clicking "Create Account"

### Bookmarklet

Create a bookmark with this URL:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://raw.githubusercontent.com/barkleesanders/nygov-selfreg-fix/main/complete-fix.js';document.body.appendChild(s);})();
```

---

## 📁 Repository Contents

### Fix Scripts

| File | Purpose |
|------|---------|
| `selfreg-fix.js` | SSN field injection for Step 2 |
| `step3-fix.js` | Hidden field injection for Step 3 |
| `complete-fix.js` | Combined smart fix for both steps |

### Security Reports

| File | Content |
|------|---------|
| `VULNERABILITY_REPORT_FULL.md` | Complete audit with CVSS scores |
| `BLIND_SPOTS_REPORT.md` | Additional vulnerabilities (5 more) |
| `SECURITY_AUDIT_REPORT.md` | Initial findings summary |
| `SECURITY_REPORT.md` | Single-issue report for SSN bug |
| `EMAIL_TO_CISO.txt` | Ready-to-send notification email |

---

## 🔍 Key Technical Findings

### 1. Session ID in URL (CRITICAL)

```
https://itsny.govqa.us/WEBAPP/_rs/(S(k1jzg2ix...))/...
                                  ^^^^^^^^^^^^^^^^
                                  SESSION TOKEN IN URL
```

**Risk:** Anyone who receives a shared URL or sees the Referer header can hijack the session.

### 2. SSN Field Rendering Failure (CRITICAL)

```javascript
document.getElementById('selfregform:ssnPanel').innerHTML
// Returns: "" (empty string)
```

**Root Cause:** JSF/PrimeFaces server-side component fails to render. Build metadata shows `W: (NULL)`.

### 3. Missing Subresource Integrity (MEDIUM)

**8 out of 9** third-party scripts lack SRI, including:
- `sdk.dv.socure.us/device-risk-sdk.js` (Identity verification!)
- `google.com/recaptcha/enterprise.js`
- `static-assets.ny.gov/unav/js/unav-bundle.js`

**Risk:** Supply chain attack could inject credential-stealing code.

### 4. User Enumeration (HIGH)

```
Input: admin
Response: "The Username you have selected is currently in use."

Input: known@email.com  
Response: "You already have an NY.gov ID!"
```

**Risk:** Attackers can enumerate valid accounts for targeted attacks.

---

## 🛡️ Affected Systems

| System | URL | Framework |
|--------|-----|-----------|
| SelfRegV3 | `my.ny.gov/SelfRegV3/` | JSF + PrimeFaces |
| LoginV4 | `my.ny.gov/LoginV4/` | JSF + PrimeFaces |
| FPSV4 | `my.ny.gov/FPSV4/` | JSF + PrimeFaces |
| GovQA FOIL | `itsny.govqa.us` | DevExpress + ASP.NET |

**Backend:** IBM WebSphere Application Server (confirmed via error codes)

---

## 📧 Responsible Disclosure

### CISO Contact

| | |
|--|--|
| **Email** | CISO@its.ny.gov |
| **Phone** | 518-473-9687 |
| **CISO** | Chris DeSain |

### FOIL Request

A Freedom of Information Law request has been submitted:
- **Reference:** R000252-010326
- **Status:** Pending

### Disclosure Timeline

| Date | Event |
|------|-------|
| 2026-01-03 | Vulnerabilities discovered |
| 2026-01-03 | Root cause analysis completed |
| 2026-01-03 | Workarounds developed |
| 2026-01-03 | FOIL request submitted |
| 2026-01-03 | Security reports created |
| 2026-01-03 | Notification to CISO prepared |

---

## ⚠️ Disclaimer

This repository is provided for **educational and security research purposes only**.

- Use the fix scripts only for your own account registration
- Never share your SSN with untrusted parties
- This fix is a workaround, not an official solution
- No warranty is provided

---

## 👤 Contact

**Security Researcher:** Brian Sanders  
**Email:** shaqsanders73@gmail.com  
**GitHub:** [@barkleesanders](https://github.com/barkleesanders)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🔗 Related

- [Turnstile Debug Harness](https://github.com/barkleesanders/turnstile-debug-harness) - CAPTCHA bug fix and FOIL documentation
- [NY.gov Support](https://my.ny.gov/support) - Official support channel
