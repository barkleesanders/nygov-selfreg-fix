/**
 * NY.gov SelfRegV3 SSN Field Fix - Step 2
 * 
 * Injects the missing Social Security Number field into the registration form.
 * 
 * Usage: Paste in browser console on https://my.ny.gov/SelfRegV3/selfregsteptwo.xhtml
 * 
 * GitHub: https://github.com/barkleesanders/nygov-selfreg-fix
 */

(function () {
    'use strict';

    console.log('[SelfReg Fix] Initializing Step 2 fix...');

    // ========================
    // 1. Verify Correct Page
    // ========================
    if (!location.href.includes('selfregstep')) {
        console.error('[SelfReg Fix] Wrong page! Navigate to selfregsteptwo.xhtml first.');
        alert('This fix is for the NY.gov registration page (Step 2).\n\nPlease navigate to the registration form first.');
        return;
    }

    // ========================
    // 2. Find SSN Panel
    // ========================
    const ssnPanel = document.getElementById('selfregform:ssnPanel');
    if (!ssnPanel) {
        console.error('[SelfReg Fix] ssnPanel not found - page structure may have changed.');
        return;
    }

    // Check if already fixed
    if (document.getElementById('selfregform:ssn')) {
        console.log('[SelfReg Fix] SSN field already exists - skipping injection.');
        return;
    }

    // ========================
    // 3. Inject SSN Field
    // ========================
    ssnPanel.innerHTML = `
    <div id="ssn-fix-container" style="
      margin-top: 20px; 
      margin-bottom: 20px;
      padding: 15px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #0284c7;
      border-radius: 8px;
    ">
      <label for="selfregform:ssn" style="
        font-weight: bold; 
        display: block; 
        margin-bottom: 8px;
        color: #0c4a6e;
        font-size: 16px;
      ">
        Social Security Number <span style="color: #dc2626;">*</span>
      </label>
      <input type="text" 
             id="selfregform:ssn" 
             name="selfregform:ssn"
             class="ui-inputfield ui-inputtext ssnId"
             placeholder="Enter your SSN"
             maxlength="11"
             autocomplete="off"
             inputmode="numeric"
             style="
               width: 200px; 
               padding: 12px 15px; 
               font-size: 20px; 
               font-family: monospace;
               letter-spacing: 2px;
               border: 2px solid #0284c7; 
               border-radius: 6px;
               background: #ffffff;
             "
      />
      <div style="
        font-size: 13px; 
        color: #475569; 
        margin-top: 8px;
        line-height: 1.4;
      ">
        Format: XXX-XX-XXXX<br>
        <span style="color: #059669;">✓ Required for identity verification</span>
      </div>
    </div>
  `;

    console.log('[SelfReg Fix] SSN field injected successfully.');

    // ========================
    // 4. Auto-Format SSN
    // ========================
    const ssnInput = document.getElementById('selfregform:ssn');

    ssnInput.addEventListener('input', function (e) {
        // Remove non-digits
        let value = this.value.replace(/\D/g, '');

        // Limit to 9 digits
        if (value.length > 9) {
            value = value.slice(0, 9);
        }

        // Format as XXX-XX-XXXX
        if (value.length >= 6) {
            this.value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
        } else if (value.length >= 4) {
            this.value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            this.value = value;
        }
    });

    // Visual feedback on valid SSN
    ssnInput.addEventListener('blur', function () {
        const digits = this.value.replace(/\D/g, '');
        if (digits.length === 9) {
            this.style.borderColor = '#059669';
            this.style.backgroundColor = '#f0fdf4';
        } else if (digits.length > 0) {
            this.style.borderColor = '#dc2626';
            this.style.backgroundColor = '#fef2f2';
        }
    });

    // ========================
    // 5. Create Backup Fields
    // ========================
    const form = document.getElementById('selfregform');
    if (form) {
        const backupNames = ['SSN', 'socialSecurityNumber', 'ssnNumber'];
        backupNames.forEach(name => {
            if (!document.querySelector(`[name="selfregform:${name}"]`)) {
                const hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = `selfregform:${name}`;
                hidden.id = `selfregform:${name}_backup`;
                form.appendChild(hidden);
            }
        });

        // Sync visible SSN to backup fields
        ssnInput.addEventListener('change', function () {
            const val = this.value;
            backupNames.forEach(name => {
                const backup = document.querySelector(`[name="selfregform:${name}"]`);
                if (backup) backup.value = val;
            });
            console.log('[SelfReg Fix] SSN synced to backup fields.');
        });
    }

    // ========================
    // 6. Success Indicator
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
      max-width: 300px;
    ">
      <div style="font-weight: bold; margin-bottom: 5px;">✅ SSN Field Added</div>
      <div style="font-size: 12px; opacity: 0.9;">
        Enter your SSN in the blue box below, then click Continue.
        <br><br>
        <strong>Note:</strong> You'll need to run the Step 3 fix before clicking "Create Account".
      </div>
    </div>
  `;
    document.body.appendChild(indicator);

    // Auto-hide after 8 seconds
    setTimeout(() => {
        indicator.style.transition = 'opacity 0.5s';
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 500);
    }, 8000);

    // Focus the SSN field
    setTimeout(() => ssnInput.focus(), 100);

    console.log('[SelfReg Fix] Step 2 fix complete. Enter your SSN and click Continue.');

})();
