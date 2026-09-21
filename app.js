/* ============================================================
   GuardView — Application Logic
   SIH26171 · Privacy-Preserving Browser Agent Prototype
   
   Architecture note:
   All simulation functions (runLocalScan, detectPII, applyRedaction,
   sendSanitizedContext, generateAction, validateAction, executeAction)
   are isolated and can be replaced with real implementations
   (ONNX Runtime Web, WebGPU, VLM APIs) without modifying the UI layer.
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. DOM REFERENCES
  // ============================================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {
    // Buttons
    btnScan: $('#btn-scan'),
    btnExecute: $('#btn-execute'),
    btnReset: $('#btn-reset'),
    btnSimple: $('#btn-simple'),
    btnTechnical: $('#btn-technical'),
    btnPresentation: $('#btn-presentation'),

    // Status badges
    inspectorStatus: $('#inspector-status'),
    payloadStatus: $('#payload-status'),
    agentStatus: $('#agent-status'),
    validationStatus: $('#validation-status'),

    // Inspector
    inspectorTitle: $('#inspector-title'),
    inspectorDesc: $('#inspector-desc'),
    findingsCount: $('#findings-count'),
    findingsList: $('#findings-list'),

    // Gate
    privacyGate: $('#privacy-gate'),
    gateLock: $('#gate-lock'),
    gateStatus: $('#gate-status'),

    // Agent
    validationText: $('#validation-text'),
    validationResult: $('#validation-result'),

    // Browser
    continueBtn: $('#continue-btn'),

    // Log
    logBody: $('#log-body'),

    // Pipeline
    pipeline: $$('.pipeline-step'),
    howSteps: $$('.how-step'),
  };

  const sensitiveFields = $$('.data-field-value.sensitive');
  const dataFields = $$('.data-field');
  const checkIcons = [
    $('#check-1'),
    $('#check-2'),
    $('#check-3'),
    $('#check-4'),
    $('#check-5'),
  ];

  // ============================================================
  // 2. UTILITY FUNCTIONS
  // ============================================================
  
  /** Promise-based delay */
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Add a timestamped log entry */
  function addLog(source, message) {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    const entry = document.createElement('p');
    entry.innerHTML = `<time>${time}</time> <span class="log-source">${source}</span> — ${message}`;
    els.logBody.appendChild(entry);
    els.logBody.scrollTop = els.logBody.scrollHeight;
  }

  /** Set status badge text, class, and color */
  function setStatus(element, text, className) {
    element.textContent = text;
    element.className = 'status-badge ' + className;
  }

  /** Activate a specific pipeline step (0-indexed) */
  function setPipelineStep(index) {
    els.pipeline.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < index) step.classList.add('completed');
      if (i === index) step.classList.add('active');
    });
  }

  /** Activate a how-it-works step (0-indexed) */
  function setHowStep(index) {
    els.howSteps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < index) step.classList.add('completed');
      if (i === index) step.classList.add('active');
    });
  }

  // ============================================================
  // 3. SIMULATION FUNCTIONS (replaceable with real implementations)
  // ============================================================

  /**
   * Simulates local DOM + OCR + Vision scan.
   * In production: Replace with ONNX Runtime Web inference,
   * Tesseract.js OCR, and DOM structure analysis.
   */
  function runLocalScan() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          domNodes: 14,
          visibleRegions: 8,
          formFields: 4,
          scanComplete: true,
        });
      }, 400);
    });
  }

  /**
   * Simulates PII/sensitive data detection.
   * In production: Replace with Transformers.js NER model
   * or custom ONNX PII classifier.
   */
  function detectPII() {
    return [
      {
        id: 'email',
        name: 'Email address',
        method: 'DOM + visual signal',
        type: 'PII',
        fieldId: 'field-email',
      },
      {
        id: 'phone',
        name: 'Phone number',
        method: 'DOM + visual signal',
        type: 'PII',
        fieldId: 'field-phone',
      },
      {
        id: 'card',
        name: 'Payment card',
        method: 'DOM + visual signal',
        type: 'FINANCIAL',
        fieldId: 'field-card',
      },
      {
        id: 'password',
        name: 'Password field',
        method: 'DOM semantics',
        type: 'CREDENTIAL',
        fieldId: 'field-password',
      },
    ];
  }

  /**
   * Simulates local redaction of sensitive data.
   * In production: Apply actual content masking/replacement
   * in the DOM snapshot or screenshot.
   */
  function applyRedaction(findings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          redactedCount: findings.length,
          method: 'local-replacement',
          reversible: false,
        });
      }, 350);
    });
  }

  /**
   * Simulates sending sanitized context to VLM.
   * In production: Replace with actual API call to VLM service
   * with only the sanitized payload.
   */
  function sendSanitizedContext() {
    return {
      page: 'customer-account',
      url: 'secure-demo.local/account',
      elements: ['email', 'phone', 'card', 'password', 'button'],
      sensitive_data: '[REDACTED]',
      layout: 'preserved',
    };
  }

  /**
   * Simulates VLM generating a structured action.
   * In production: Replace with actual VLM API response parsing.
   */
  function generateAction() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          action: 'click',
          target: 'Continue to Dashboard',
          selector: '#continue-btn',
          confidence: 0.94,
        });
      }, 600);
    });
  }

  /**
   * Simulates action validation checks.
   * In production: Replace with actual DOM inspection
   * and security policy checks.
   */
  function validateAction(action) {
    return [
      { check: 'Target element exists on page', passed: true },
      { check: 'Target element is visible to user', passed: true },
      { check: 'Action type is allowed', passed: true },
      { check: 'Page state matches expected context', passed: true },
      { check: 'No sensitive value exposed in action', passed: true },
    ];
  }

  /**
   * Simulates executing the validated browser action.
   * In production: Replace with actual browser extension
   * DOM interaction (click, type, navigate).
   */
  function executeAction(action) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, action: action.action, target: action.target });
      }, 250);
    });
  }

  // ============================================================
  // 4. DEMO FLOW — 13 Steps
  // ============================================================

  let currentPhase = 'idle'; // idle, scanning, detected, redacting, protected, sending, reasoning, action-ready, validating, validated, executing, completed

  /**
   * PHASE 1: Scan — Steps 1-4
   * Captures webpage, runs local detection, shows findings
   */
  async function handleScan() {
    if (currentPhase !== 'idle') return;
    currentPhase = 'scanning';

    // Step 1: Button state change
    els.btnScan.disabled = true;
    els.btnScan.textContent = 'Scanning locally…';
    els.btnScan.classList.add('animate-pulse');

    // Update status
    setStatus(els.inspectorStatus, 'SCANNING', 'status-scanning');
    setPipelineStep(1);
    setHowStep(0);

    addLog('Local Gate', 'Captured visible webpage state + DOM structure.');

    // Step 2: Run local scan
    const scanResult = await runLocalScan();
    addLog('Detector', 'Running DOM semantics, OCR and vision checks locally.');

    await sleep(400);

    // Step 3: Detect PII
    const findings = detectPII();

    // Step 4: Show findings one by one with animation
    els.findingsList.innerHTML = '';
    for (let i = 0; i < findings.length; i++) {
      await sleep(250);

      const f = findings[i];
      const item = document.createElement('div');
      item.className = 'finding-item';
      item.style.animationDelay = '0ms';
      item.innerHTML = `
        <span class="finding-icon" aria-hidden="true">!</span>
        <div class="finding-info">
          <div class="finding-name">${f.name}</div>
          <div class="finding-method">Detected from ${f.method}</div>
        </div>
        <span class="finding-type">${f.type}</span>
      `;
      els.findingsList.appendChild(item);

      // Highlight corresponding field in browser
      const field = document.getElementById(f.fieldId);
      if (field) {
        field.classList.add('highlight');
      }

      // Update counter
      els.findingsCount.textContent = i + 1;
    }

    currentPhase = 'detected';

    // Update UI
    setStatus(els.inspectorStatus, '4 FINDINGS', 'status-detected');
    els.inspectorTitle.textContent = 'Sensitive data detected';
    els.inspectorDesc.textContent =
      'Privacy Gate will redact sensitive regions before external reasoning.';

    els.btnScan.classList.remove('animate-pulse');
    els.btnScan.disabled = false;
    els.btnScan.textContent = 'Protect & Sanitize';
    els.btnScan.setAttribute('aria-label', 'Protect and sanitize detected sensitive data');

    addLog('Detector', 'Found 4 sensitive regions: email, phone, card and password.');
  }

  /**
   * PHASE 2: Redact — Steps 5-7
   * Applies redaction, activates privacy gate
   */
  async function handleRedact() {
    if (currentPhase !== 'detected') return;
    currentPhase = 'redacting';

    els.btnScan.disabled = true;
    els.btnScan.textContent = 'Applying redaction…';
    els.btnScan.classList.add('animate-pulse');

    setStatus(els.inspectorStatus, 'REDACTING', 'status-scanning');
    setPipelineStep(2);
    setHowStep(1);

    addLog('Privacy Gate', 'Applying local redaction to 4 sensitive regions…');

    // Step 5-6: Redact fields one by one
    const findings = detectPII();
    await applyRedaction(findings);

    for (let i = 0; i < dataFields.length; i++) {
      await sleep(200);
      dataFields[i].classList.remove('highlight');
      dataFields[i].classList.add('redacted');

      // Mark finding as protected
      const findingItems = els.findingsList.querySelectorAll('.finding-item');
      if (findingItems[i]) {
        findingItems[i].classList.add('protected');
        const icon = findingItems[i].querySelector('.finding-icon');
        if (icon) icon.textContent = '✓';
        const typeEl = findingItems[i].querySelector('.finding-type');
        if (typeEl) typeEl.textContent = 'SAFE';
      }
    }

    // Step 7: Activate privacy gate
    els.privacyGate.classList.add('active');
    els.gateLock.classList.add('animate-glow');
    els.gateStatus.textContent = 'Only sanitized context can cross this boundary';

    // Update statuses
    currentPhase = 'protected';

    setStatus(els.inspectorStatus, 'PROTECTED', 'status-protected');
    setStatus(els.payloadStatus, 'SANITIZED', 'status-protected');
    els.inspectorTitle.textContent = 'Privacy boundary active';
    els.inspectorDesc.textContent =
      'Only sanitized context is eligible for external reasoning.';

    els.btnScan.classList.remove('animate-pulse');
    els.btnScan.disabled = false;
    els.btnScan.textContent = 'Send Safe Context to AI';
    els.btnScan.setAttribute('aria-label', 'Send sanitized context to AI for reasoning');

    addLog('Privacy Gate', '✓ Redacted 4 sensitive regions before network transmission.');
    addLog('Privacy Gate', 'Raw PII blocked. Sanitized context ready.');
  }

  /**
   * PHASE 3: Send & Reason — Steps 8-10
   * Sends sanitized context, receives AI action
   */
  async function handleSend() {
    if (currentPhase !== 'protected') return;
    currentPhase = 'sending';

    els.btnScan.disabled = true;
    els.btnScan.textContent = 'Preparing sanitized context…';

    setPipelineStep(3);
    setHowStep(2);
    setStatus(els.payloadStatus, 'SANITIZED ONLY', 'status-protected');
    setStatus(els.agentStatus, 'REASONING', 'status-reasoning');

    addLog('Network', 'Sending sanitized page structure to VLM. Raw PII excluded.');

    // Step 8-9: Generate action
    const context = sendSanitizedContext();
    await sleep(400);

    addLog('VLM', 'Received sanitized context. Processing reasoning…');

    currentPhase = 'reasoning';
    const action = await generateAction();

    // Step 10: Show action ready
    currentPhase = 'action-ready';

    setStatus(els.agentStatus, 'ACTION READY', 'status-protected');
    els.validationText.textContent =
      '• Action returned: click "Continue to Dashboard"';
    els.btnExecute.disabled = false;

    // Hide scan button, show execute is ready
    els.btnScan.style.display = 'none';

    setPipelineStep(4);
    setHowStep(3);

    addLog('VLM', 'Returned structured action: click "Continue to Dashboard".');
  }

  /**
   * PHASE 4: Validate & Execute — Steps 11-13
   * Validates action, executes browser action
   */
  async function handleExecute() {
    if (currentPhase !== 'action-ready') return;
    currentPhase = 'validating';

    els.btnExecute.disabled = true;
    els.btnExecute.textContent = 'Validating…';

    setStatus(els.agentStatus, 'VALIDATING', 'status-scanning');
    setStatus(els.validationStatus, 'CHECKING', 'status-scanning');
    els.validationText.textContent =
      '• Checking target, action type and current page state…';

    addLog('Validator', 'Running safety checks on AI-generated action…');

    // Step 11: Run validation checks one by one
    const action = { action: 'click', target: 'Continue to Dashboard', selector: '#continue-btn' };
    const checks = validateAction(action);

    for (let i = 0; i < checks.length; i++) {
      await sleep(300);
      checkIcons[i].textContent = '✓';
      checkIcons[i].classList.add('passed');
      checkIcons[i].setAttribute('aria-label', 'Passed');
    }

    // Step 12: Validation complete
    currentPhase = 'validated';

    await sleep(300);
    els.validationResult.classList.add('show');
    setStatus(els.validationStatus, 'APPROVED', 'status-protected');
    els.validationText.textContent = '✓ Action validated against current page state.';
    els.validationText.classList.add('success');

    addLog('Validator', '✓ All 5 safety checks passed. Action approved.');

    // Step 13: Execute action
    await sleep(400);
    currentPhase = 'executing';

    setStatus(els.agentStatus, 'EXECUTING', 'status-scanning');
    addLog('Executor', 'Executing browser action: click "Continue to Dashboard".');

    const result = await executeAction(action);

    currentPhase = 'completed';

    // Transform the button
    els.continueBtn.textContent = 'Dashboard Opened ✓';
    els.continueBtn.classList.add('success');

    // Final statuses
    setStatus(els.agentStatus, 'COMPLETED', 'status-protected');
    setPipelineStep(5);
    setHowStep(4);

    els.btnExecute.textContent = '✓ Action Completed';
    els.btnExecute.classList.add('success');

    addLog('Executor', '✓ Browser action completed successfully.');
    addLog('System', 'Demo complete. The entire flow ran with privacy protection.');
  }

  // ============================================================
  // 5. BUTTON ROUTING
  // ============================================================

  /** Route the main scan button through phases */
  function handleMainButton() {
    switch (currentPhase) {
      case 'idle':
        handleScan();
        break;
      case 'detected':
        handleRedact();
        break;
      case 'protected':
        handleSend();
        break;
    }
  }

  // ============================================================
  // 6. VIEW MODE MANAGEMENT
  // ============================================================

  function setView(mode) {
    // Remove all view classes
    document.body.classList.remove('view-technical', 'view-presentation');

    // Reset button states
    els.btnSimple.classList.remove('active');
    els.btnTechnical.classList.remove('active');
    els.btnPresentation.classList.remove('active');
    els.btnSimple.setAttribute('aria-pressed', 'false');
    els.btnTechnical.setAttribute('aria-pressed', 'false');
    els.btnPresentation.setAttribute('aria-pressed', 'false');

    switch (mode) {
      case 'technical':
        document.body.classList.add('view-technical');
        els.btnTechnical.classList.add('active');
        els.btnTechnical.setAttribute('aria-pressed', 'true');
        break;
      case 'presentation':
        document.body.classList.add('view-presentation');
        els.btnPresentation.classList.add('active');
        els.btnPresentation.setAttribute('aria-pressed', 'true');
        break;
      default:
        els.btnSimple.classList.add('active');
        els.btnSimple.setAttribute('aria-pressed', 'true');
        break;
    }
  }

  // ============================================================
  // 7. RESET
  // ============================================================

  function resetDemo() {
    location.reload();
  }

  // ============================================================
  // 8. INITIALIZATION
  // ============================================================

  function init() {
    // Initial log entries
    addLog('System', 'Privacy Gate initialized locally.');
    addLog('System', 'Waiting for page inspection.');

    // Set initial pipeline state
    setPipelineStep(0);

    // Bind event listeners
    els.btnScan.addEventListener('click', handleMainButton);
    els.btnExecute.addEventListener('click', handleExecute);
    els.btnReset.addEventListener('click', resetDemo);

    // View mode buttons
    els.btnSimple.addEventListener('click', () => setView('simple'));
    els.btnTechnical.addEventListener('click', () => setView('technical'));
    els.btnPresentation.addEventListener('click', () => setView('presentation'));

    // Keyboard support: Enter/Space for view buttons
    [els.btnSimple, els.btnTechnical, els.btnPresentation].forEach((btn) => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // Start
  init();
})();
