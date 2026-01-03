/**
 * NY.gov SelfRegV3 Complete Fix
 * 
 * Combined fix that handles both Step 2 and Step 3 automatically.
 * Detects which page you're on and applies the appropriate fix.
 * 
 * Usage: 
 * 1. Paste in browser console on Step 2 (selfregsteptwo.xhtml)
 * 2. Fill in your info and click Continue
 * 3. When Step 3 loads, paste again (or it may auto-prompt)
 * 
 * GitHub: https://[REPOSITORY]/nygov-selfreg-fix
 */

(function () {
    'use strict';

    const VERSION = '1.0.0';
    console.log(`[SelfReg Fix v${VERSION}] Initializing...`);

    // ========================
    // Detect Current Page
    // ========================
    const url = location.href.toLowerCase();

    if (url.includes('selfregsteptwo') || url.includes('selfregstepone')) {
        applyStep2Fix();
    } else if (url.includes('confirmation')) {
        applyStep3Fix();
    } else if (url.includes('success')) {
        console.log('[SelfReg Fix] Success page detected. Registration complete!');
        showMessage('🎉 Registration Successful!', 'Check your email for the activation link.', 'success');
    } else if (url.includes('blocked')) {
        console.log('[SelfReg Fix] Blocked page detected. Registration failed.');
        showMessage('❌ Registration Blocked', 'Identity verification failed. Try with accurate address info.', 'error');
    } else {
        console.log('[SelfReg Fix] Unknown page. Navigate to the registration form first.');
        showMessage('⚠️ Wrong Page', 'Navigate to my.ny.gov registration first.', 'warning');
    }

    // ========================
    // Step 2 Fix
    // ========================
    function applyStep2Fix() {
        console.log('[SelfReg Fix] Applying Step 2 fix...');

        const ssnPanel = document.getElementById('selfregform:ssnPanel');
        if (!ssnPanel) {
            console.error('[SelfReg Fix] ssnPanel not found.');
            return;
        }

        if (document.getElementById('selfregform:ssn')) {
            console.log('[SelfReg Fix] SSN field already exists.');
            return;
        }

        // Inject SSN field
        ssnPanel.innerHTML = `
      <div id="ssn-fix-container" style="
        margin: 20px 0;
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
        ">
          Social Security Number <span style="color: #dc2626;">*</span>
        </label>
        <input type="text" 
               id="selfregform:ssn" 
               name="selfregform:ssn"
               class="ui-inputfield ui-inputtext ssnId"
               placeholder="XXX-XX-XXXX"
               maxlength="11"
               autocomplete="off"
               inputmode="numeric"
               style="
                 width: 200px; 
                 padding: 12px; 
                 font-size: 18px; 
                 font-family: monospace;
                 border: 2px solid #0284c7; 
                 border-radius: 6px;
               "
        />
        <div style="font-size: 12px; color: #475569; margin-top: 5px;">
          Required for identity verification
        </div>
      </div>
    `;

        const ssnInput = document.getElementById('selfregform:ssn');

        // Auto-format
        ssnInput.addEventListener('input', function () {
            let val = this.value.replace(/\D/g, '').slice(0, 9);
            if (val.length >= 6) this.value = val.slice(0, 3) + '-' + val.slice(3, 5) + '-' + val.slice(5);
            else if (val.length >= 4) this.value = val.slice(0, 3) + '-' + val.slice(3);
            else this.value = val;
        });

        // Store SSN for Step 3
        ssnInput.addEventListener('change', function () {
            sessionStorage.setItem('nygov_ssn_fix', this.value);
        });

        // Create backup fields
        const form = document.getElementById('selfregform');
        if (form) {
            ['SSN', 'socialSecurityNumber'].forEach(n => {
                if (!document.querySelector(`[name="selfregform:${n}"]`)) {
                    const h = document.createElement('input');
                    h.type = 'hidden';
                    h.name = `selfregform:${n}`;
                    form.appendChild(h);
                }
            });

            ssnInput.addEventListener('change', function () {
                document.querySelectorAll('[name^="selfregform:"][name*="SSN"], [name^="selfregform:"][name*="ssn"]').forEach(f => {
                    if (f !== ssnInput) f.value = this.value;
                });
            });
        }

        showMessage('✅ SSN Field Added', 'Enter your SSN below, then click Continue.', 'success');
        setTimeout(() => ssnInput.focus(), 100);
    }

    // ========================
    // Step 3 Fix
    // ========================
    function applyStep3Fix() {
        console.log('[SelfReg Fix] Applying Step 3 fix...');

        // Try to get SSN from sessionStorage (from Step 2)
        let ssn = sessionStorage.getItem('nygov_ssn_fix');

        if (!ssn) {
            ssn = prompt('Enter your SSN (XXX-XX-XXXX):');
            if (!ssn) return;
        }

        ssn = ssn.replace(/\D/g, '');
        if (ssn.length !== 9) {
            alert('Invalid SSN. Enter exactly 9 digits.');
            return;
        }

        const formatted = ssn.slice(0, 3) + '-' + ssn.slice(3, 5) + '-' + ssn.slice(5);

        const form = document.querySelector('form');
        if (!form) {
            console.error('[SelfReg Fix] Form not found.');
            return;
        }

        ['selfregform:ssn', 'confirmationpage:ssn', 'SSN'].forEach(name => {
            let el = document.querySelector(`[name="${name}"]`);
            if (!el) {
                el = document.createElement('input');
                el.type = 'hidden';
                el.name = name;
                form.appendChild(el);
            }
            el.value = formatted;
        });

        // Clear stored SSN
        sessionStorage.removeItem('nygov_ssn_fix');

        showMessage('✅ Ready to Submit', `SSN ending in ${ssn.slice(5)} added. Click "Create Account".`, 'success');
    }

    // ========================
    // Helper: Show Message
    // ========================
    function showMessage(title, text, type) {
        const colors = {
            success: { bg: '#059669', border: '#047857' },
            error: { bg: '#dc2626', border: '#b91c1c' },
            warning: { bg: '#d97706', border: '#b45309' }
        };
        const c = colors[type] || colors.success;

        const div = document.createElement('div');
        div.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${c.bg};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-family: -apple-system, sans-serif;
        font-size: 14px;
        z-index: 999999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        max-width: 300px;
      ">
        <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
        <div style="font-size: 12px; opacity: 0.9;">${text}</div>
      </div>
    `;
        document.body.appendChild(div);
        setTimeout(() => { div.style.transition = 'opacity 0.5s'; div.style.opacity = '0'; }, 6000);
        setTimeout(() => div.remove(), 6500);
    }

})();
