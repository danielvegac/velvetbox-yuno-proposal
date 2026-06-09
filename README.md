# VelvetBox × Yuno — Deal Strategy & Commercial Proposal

> AI Challenge submission for Yuno Global SDR role  
> Built in under 2 hours using a deliberate multi-tool AI orchestration workflow

**🔗 Live microsite:** https://velvetbox-yuno-proposal.vercel.app  
**📊 Financial model (Excel):** https://docs.google.com/spreadsheets/d/1ytigyt6Q5uuCBeJ3l-EmQMGBbMN0H3XJ/edit?usp=sharing

---

## What this is

A full deal strategy and commercial proposal package positioning Yuno to win
VelvetBox — a $420M-subscription / $588M-total-TPV beauty subscription platform
— away from Stripe + Mercado Pago, against a competing Adyen bid.

The deliverable is a deployed, interactive microsite containing all five required
sections:

1. **Deal Qualification & Strategic Assessment** — Tier 1 verdict, top risks,
   5 critical unknowns with resolution paths, 3 dossier contradictions named
2. **Stakeholder Engagement Strategy** — emotionally distinct pitches for
   Daniela (Head of Payments), Kevin (CTO), and Laura (CFO); multi-threading plan
3. **Commercial Proposal + Financial Impact Model** — market-by-market approval
   lift, interchange++ pricing at ~2.35%, Year-1 impact $23.3M, steady-state
   $35.9M, 3-scenario sensitivity, live interactive ROI calculator
4. **Objection Handling** — scripted responses to all 4 named objections,
   empathy + evidence + competitive reframe
5. **90-Day Deal Plan** — 5 phases to close before the Stripe renewal, pilot
   scoped to Mexico + Brazil

---

## Interactive ROI Calculator

The microsite includes a live ROI calculator with:
- Per-market base approval-rate lifts (14 markets, hardcoded from the verified model)
- Group multiplier sliders (LatAm / Mature / SEA) — at default 1.0× outputs
  exactly **$23.0M subscription recovered / $32.2M gross** (verified)
- Conservative / Base / Aggressive presets matching the proposal's sensitivity table
- Live-computed Year-1 impact, processing savings, operational savings, payback

---

## AI Orchestration Methodology

This challenge was built using a deliberate multi-tool workflow:

| Tool | Purpose |
|---|---|
| **Perplexity Pro** | Grounded research: Adyen pricing, local acquiring lift benchmarks (+14–21pp in MX confirmed), network token uplift (Visa +4.6%), PIX/OXXO recurring nuances — all cited |
| **Claude (Opus 4.8, High)** | Financial modeling (market-by-market gross-up, 3-scenario sensitivity, pricing strategy), stakeholder strategy, objection handling, 90-day plan — across parallel chat sessions |
| **Claude Code (Opus 4.8 + Sonnet)** | React + Vite + Tailwind microsite build including the interactive calculator; math self-verified via Node.js before deploy |
| **Vercel** | Production deployment via CLI — zero-config Vite detection |
| **Gemini Pro** | Adversarial red-team: identified 2 legitimate model weaknesses (add-on lift methodology, attempted-volume decay assumption) acknowledged in the submission notes |

The `claude_code_prompt.md` in this repo is the exact prompt used to build the
microsite — transparent documentation of the AI-to-code workflow.

---

## Tech Stack

- **React 18** + **Vite 5** + **Tailwind CSS 3**
- Single-page app, sticky nav, smooth scroll
- Self-contained — no external API dependencies
- Deployed to Vercel (auto-detected Vite build)

---

## Local Development

```bash
npm install
npm run dev        # dev server at localhost:5173
npm run build      # production build (zero errors)
```

---

## Key Numbers (base case, verified)

| Metric | Value |
|---|---|
| Recommended take rate | ~2.35% (vs current 2.89%, vs CFO target <2.5%) |
| Year-1 total impact | $23.3M gross |
| Steady-state impact | $35.9M gross |
| Mexico + Brazil recovered | $11.0M (of $23.0M subscription base) |
| Processing savings | $3.18M/yr |
| Payback | Before first quarterly close |
| Deal tier | Tier 1 |

---

## Financial Model

A full formula-driven Excel model is available separately — Assumptions,
per-market engine, Cost & Payback, P&L Summary, and Sensitivity tabs, all live
formulas so any input can be flexed:

→ https://docs.google.com/spreadsheets/d/1ytigyt6Q5uuCBeJ3l-EmQMGBbMN0H3XJ/edit?usp=sharing
