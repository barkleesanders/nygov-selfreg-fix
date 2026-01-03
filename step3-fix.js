/**
 * NY.gov SelfRegV3 SSN Field Fix - Step 3 (Confirmation Page)
 * 
 * Injects hidden SSN fields into the confirmation form before final submission.
 * This ensures the SSN value is included when "Create Account" is clicked.
 * 
 * Usage: Paste in browser console on the confirmation page BEFORE clicking "Create Account"
 * 
 * GitHub: https://github.com/barkleesanders/nygov-selfreg-fix
 */

(function () {
    'use strict';

    console.log('[SelfReg Fix] Initializing Step 3 fix...');

    // ========================
    // 1. Verify Correct Page
    // ========================
    if (!location.href.includes('confirmation')) {
        console.error('[SelfReg Fix] Wrong page! This fix is for the confirmation page.');
        alert('This fix is for the NY.gov confirmation page (Step 3).\n\nPlease run this after clicking Continue on Step 2.');
        return;
    }

    // ========================
    // 2. Prompt for SSN
    // ========================
    let ssn = prompt(
        'NY.gov Registration Fix - Step 3\n\n' +
        'Enter your SSN (format: XXX-XX-XXXX):\n\n' +
        'This value will be added to the form before submission.\n' +
        'Your SSN is NOT stored or transmitted anywhere except to NY.gov.'
    );

    if (!ssn) {
        console.log('[SelfReg Fix] SSN entry cancelled.');
        return;
    }

    // Validate format
    ssn = ssn.replace(/\D/g, '');
    if (ssn.length !== 9) {
        alert('Invalid SSN format. Please enter exactly 9 digits.');
        return;
    }

    // Format SSN
    const formattedSSN = ssn.slice(0, 3) + '-' + ssn.slice(3, 5) + '-' + ssn.slice(5);

    // ========================
    // 3. Find Form
    // ========================
    const form = document.querySelector('form');
    if (!form) {
        console.error('[SelfReg Fix] Form not found on page.');
        alert('Could not find the registration form. Page structure may have changed.');
        return;
    }

    // ========================
    // 4. Inject Hidden SSN Fields
    // ========================
    const fieldNames = [
        'selfregform:ssn',
        'confirmationpage:ssn',
        'SSN',
        'socialSecurityNumber'
    ];

    fieldNames.forEach(name => {
        // Check if field already exists
        let existing = document.querySelector(`[name="${name}"]`);
        if (existing) {
            existing.value = formattedSSN;
            console.log(`[SelfReg Fix] Updated existing field: ${name}`);
        } else {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = name;
            hidden.value = formattedSSN;
            form.appendChild(hidden);
            console.log(`[SelfReg Fix] Created hidden field: ${name}`);
        }
    });

    // ========================
    // 5. Success Indicator
    // ========================
    const indicator = document.createElement('div');
    indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      max-width: 320px;
    ">
      <div style="font-weight: bold; margin-bottom: 5px;">✅ Step 3 Fix Applied</div>
      <div style="font-size: 12px; opacity: 0.9;">
        SSN ending in <strong>***-**-${ssn.slice(5)}</strong> has been added to the form.
        <br><br>
        You can now click <strong>"Create Account"</strong> to complete registration.
      </div>
    </div>
  `;
    document.body.appendChild(indicator);

    console.log('[SelfReg Fix] Step 3 fix complete. SSN hidden fields injected.');
    console.log('[SelfReg Fix] You can now click "Create Account".');

})();
