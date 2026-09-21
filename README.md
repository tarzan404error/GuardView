# 🛡️ GuardView

### Privacy-Preserving Browser AI Agent with Local Perception

> **SIH26171** — On-device Visual Perception for Light-weight Browser Agents  
> Smart India Hackathon 2026

---

## The Problem We're Solving

AI-powered browser agents are becoming incredibly useful — they can fill forms, navigate websites, and automate tasks for you. But here's the catch:

**These agents need to see your screen.**

That means they potentially have access to your emails, passwords, credit card numbers, phone numbers, and other private information. Most current solutions send all of this raw data straight to a cloud AI for processing.

**That's a privacy nightmare.**

---

## What is GuardView?

GuardView is our answer to this problem. Instead of sending everything to the cloud and hoping for the best, we put a **privacy boundary** right inside your browser.

Here's the simple version:

```
❌ Without GuardView:
   Your webpage (with all your private data) → Cloud AI

✅ With GuardView:
   Your webpage → Local scan → Sensitive data detected → Redacted locally
   → Only safe, sanitized data → Cloud AI
```

**Your sensitive information never leaves your device.** The AI only sees what it needs to see — nothing more.

---

## How It Works

We break the process into 5 clear steps:

### 1. 👁️ See
The browser agent captures and understands the webpage locally — reading the DOM structure, running OCR on visible text, and analyzing the visual layout. All of this happens **on your device**.

### 2. 🔍 Detect
Our detection engine scans for sensitive information: emails, phone numbers, payment cards, passwords, addresses, and other PII. We use DOM semantics, pattern matching, and visual signals to find them.

### 3. 🔒 Protect
This is where the **Privacy Gate** kicks in. Every piece of sensitive data gets redacted locally before anything crosses the network boundary. If we're not sure whether something is sensitive, we redact it anyway (fail-safe approach).

### 4. 🧠 Reason
Only the sanitized, safe version of the page is sent to the AI/VLM for reasoning. The AI can still understand the page layout and structure — it just can't see your actual private data.

### 5. ✅ Act
The AI returns a structured action (like "click the Continue button"). Before executing it, we validate the action locally — checking that the target exists, is visible, and the action makes sense. Only then does it execute.

---

## The Privacy Gate — Our Core Idea

The Privacy Gate is the heart of GuardView. Think of it as a security checkpoint:

```
┌─────────────────────────────┐
│     YOUR DEVICE (LOCAL)     │
│                             │
│  Webpage → Scan → Redact    │
│                             │
├─────────── 🔒 ──────────────┤  ← Privacy Gate
│                             │
│     NETWORK / CLOUD AI      │
│                             │
│  Sanitized Context → AI     │
│  → Action → Validate → Act  │
└─────────────────────────────┘
```

**Raw PII stays above the line. Only cleaned data goes below.**

---

## Live Demo

This prototype demonstrates the full pipeline with a simulated customer account page containing:

- Name, email, phone number
- Payment card details
- Password field

### Demo Flow (takes about 60-90 seconds):

1. You see a realistic customer portal with sensitive data
2. Click **"Run Local Privacy Scan"** — watch as 4 sensitive items are detected one by one
3. Click **"Protect & Sanitize"** — sensitive values transform into `[REDACTED]` blocks
4. The Privacy Gate activates — only sanitized context is allowed through
5. Click **"Send Safe Context to AI"** — the AI reasons on clean data and returns an action
6. Click **"Validate & Execute"** — 5 safety checks pass, action executes

### View Modes

| Mode | For Whom | What It Shows |
|------|----------|---------------|
| **Simple View** | Non-technical judges | Clean labels like "Local Privacy Scan", "Safe Data for AI" |
| **Technical View** | Technical evaluators | Architecture details, JSON payloads, model references |
| **Presentation Mode** | Live demos on projector | Larger text, focused flow, no distractions |

---

## Tech Stack

### Current Prototype
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- No frameworks, no build tools, no API keys needed
- Just open `index.html` and it works

### Production Roadmap
| Component | Current | Target |
|-----------|---------|--------|
| DOM Analysis | Simulated | Browser Extension API (Manifest V3) |
| OCR | Simulated | Tesseract.js / Custom ONNX model |
| Vision | Simulated | ONNX Runtime Web + WebGPU |
| PII Detection | Simulated | Transformers.js NER / Custom classifier |
| AI Reasoning | Simulated | External VLM API |
| Action Execution | Simulated | Browser Extension content scripts |

---

## Architecture

```
WEBPAGE
   │
   ▼
LOCAL PERCEPTION ─────────────────── All on-device
   ├── DOM extraction
   ├── OCR (Tesseract.js / ONNX)
   └── Vision (lightweight model)
   │
   ▼
PII DETECTION ────────────────────── Pattern + ML based
   │
   ▼
PRIVACY GATE ─────────────────────── The boundary
   │
   ▼
SANITIZED CONTEXT ────────────────── Safe for network
   │
   ▼
VLM / AI REASONING ──────────────── Cloud or local LLM
   │
   ▼
ACTION VALIDATOR ─────────────────── Safety checks
   │
   ▼
BROWSER ACTION ───────────────────── Execute if approved
```

---

## Project Structure

```
GuardView/
├── index.html     → Complete UI with all sections
├── style.css      → Design system (glassmorphism, responsive)
├── app.js         → Modular JS with isolated simulation functions
└── README.md      → You're reading it
```

### Code Architecture

All simulation functions are isolated and designed to be swapped out with real implementations:

```javascript
// These can be replaced with actual ML/AI components:
runLocalScan()         // → ONNX/WebGPU perception pipeline
detectPII()            // → Transformers.js NER model
applyRedaction()       // → Content masking engine
sendSanitizedContext() // → VLM API call (sanitized only)
generateAction()       // → VLM response parser
validateAction()       // → DOM inspection + security policy
executeAction()        // → Browser extension DOM interaction
```

---

## How to Run

```bash
# Option 1: Just open the file
# Double-click index.html in any modern browser (Chrome/Edge/Firefox)

# Option 2: Local server (if you prefer)
npx serve .
# Then open http://localhost:3000
```

**No Node.js, npm, API keys, or build process required.**

---

## Security Considerations

- **Privacy Gate**: Sensitive data is blocked from leaving the device before redaction
- **Prompt Injection Defense**: Webpage content is treated as untrusted data — not instructions. Malicious page content like "ignore previous instructions" is flagged and blocked
- **Action Validation**: Every AI-generated action goes through 5 safety checks before execution
- **Fail-safe Policy**: If detection confidence is low, we default to redacting (better safe than sorry)

### What We Don't Claim

We're being honest here — this is a prototype. We don't claim:
- ~~100% PII detection accuracy~~
- ~~Zero data leakage~~
- ~~Guaranteed security~~
- ~~Production-ready AI models~~

What we do claim: **the architecture is sound, the concept is proven, and the implementation path is clear.**

---

## What's Simulated vs What's Real

| Feature | Status | Notes |
|---------|--------|-------|
| UI/UX Pipeline | ✅ Real | Fully functional interactive demo |
| Privacy Gate concept | ✅ Real | Visual boundary is the core innovation |
| PII Detection | 🔶 Simulated | Deterministic logic, replaceable with ONNX models |
| VLM Reasoning | 🔶 Simulated | Returns hardcoded action, replaceable with real API |
| Action Validation | 🔶 Simulated | Checks are simulated, logic is real |
| Redaction Engine | 🔶 Simulated | Visual redaction works, needs ML backing |

The prototype clearly indicates `DEMO MODE` in the UI with a tooltip explaining exactly what's simulated.

---

## Future Work

1. **Browser Extension**: Package as Manifest V3 Chrome/Edge extension
2. **ONNX Runtime Web**: Integrate real PII detection models running on WebGPU/WASM
3. **Tesseract.js**: Add real OCR for screenshot-based perception
4. **Transformers.js**: Deploy NER models for named entity recognition
5. **VLM Integration**: Connect to actual vision-language model APIs
6. **Multi-page Support**: Handle navigation across multiple pages
7. **User Controls**: Let users configure what gets redacted and what doesn't

---

## Team

Built for **Smart India Hackathon 2026** | Problem Statement **SIH26171**

---

## Keywords

`On-device AI` · `Browser AI Agent` · `Privacy-preserving AI` · `Local Inference` · `WebGPU` · `WebAssembly` · `ONNX Runtime Web` · `Transformers.js` · `DOM Analysis` · `OCR` · `Computer Vision` · `PII Detection` · `PII Redaction` · `Privacy Gate` · `Sanitized Context` · `VLM` · `Multimodal AI` · `Action Validation` · `Prompt Injection Defense` · `Browser Automation` · `Lightweight AI` · `Client-side AI`

---

*This prototype is a concept demonstration. All displayed user data is fictional. No real credentials are used or stored.*
