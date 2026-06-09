Build a complete, production-ready React + Vite + Tailwind CSS microsite for a
sales proposal. This will be deployed to Vercel. Everything in a single repo.

TECH STACK: Vite + React 18 + Tailwind CSS. No other external dependencies.
Self-contained. Must pass `npm run build` cleanly.

BRANDING: Yuno palette — primary: #4F46E5 (indigo), accent: #7C3AED (violet),
background: #0F0F1A (near-black), surface: #1A1A2E, text: white/#F9FAFB.
Clean, modern, confident. Font: Inter (Google Fonts CDN). No drop shadows —
use subtle borders and gradients instead.

STRUCTURE: Single-page app with sticky navigation. Smooth scroll between sections.
Sections in order:
  1. Hero / Executive Summary
  2. Deal Qualification & Strategic Assessment
  3. Stakeholder Engagement Strategy
  4. Commercial Proposal (includes the ROI Calculator — see below)
  5. Objection Handling
  6. 90-Day Deal Plan

HERO SECTION: Large headline "Yuno × VelvetBox", subhead "How Yuno recovers
$23.3M in Year 1 and drops your take rate from 2.89% to 2.35%".
Three stat cards:
  - Year-1 Total Impact: $23.3M
  - Processing Savings: $3.18M/yr
  - Payback: < 1 quarter

ROI CALCULATOR (inside Section 4 — Commercial Proposal):
Hardcode each market's BASE lift (pp). Three sliders apply a MULTIPLIER to each
region group (default 1.0x = reproduces the locked base case exactly):
  - LatAm multiplier slider: 0.5x to 1.5x, default 1.0x (label: "LatAm Lift Multiplier")
  - Mature markets multiplier slider: 0.5x to 1.5x, default 1.0x (label: "Mature Markets Lift Multiplier")
  - SEA multiplier slider: 0.5x to 1.5x, default 1.0x (label: "SEA Lift Multiplier")
  - Yuno blended take rate slider: 2.0% to 2.6%, step 0.01%, default 2.35%
  - Net migration cost input: default $180,000

Big-number output cards (live-computed):
  - Subscription Recovered (steady-state)
  - Gross Recovered incl. Add-ons (steady-state)
  - Year-1 Recovered Revenue (65% ramp)
  - Year-1 Processing Savings
  - Operational Savings
  - Total Year-1 Impact
  - Payback (months)

MATH LOGIC — implement exactly. At all multipliers = 1.0x this MUST output
subscription recovered = $23.0M and gross recovered = $32.2M:

  Market data [label, captured $M, currentRate, baseLiftPP, group]:
    US:  [180, 0.87, 2,  "mature"]
    CA:  [24,  0.85, 2,  "mature"]
    UK:  [42,  0.84, 3,  "mature"]
    DE:  [28,  0.83, 3,  "mature"]
    FR:  [18,  0.82, 3,  "mature"]
    ES:  [14,  0.81, 3,  "mature"]
    MX:  [38,  0.71, 10, "latam"]
    BR:  [32,  0.68, 12, "latam"]
    CO:  [12,  0.74, 8,  "latam"]
    CL:  [8,   0.73, 8,  "latam"]
    SG:  [10,  0.79, 4,  "sea"]
    TH:  [6,   0.76, 5,  "sea"]
    ID:  [4,   0.72, 6,  "sea"]
    MY:  [4,   0.77, 4,  "sea"]

  For each market:
    effectiveLiftPP = baseLiftPP * groupMultiplier
    attempted = captured / currentRate
    recovered = attempted * (effectiveLiftPP / 100)

  subscriptionRecovered = sum of recovered across all markets   // $23.0M at 1.0x
  grossRecovered = subscriptionRecovered * 1.4                  // $32.2M at 1.0x
  year1Recovered = grossRecovered * 0.65                        // phased ramp

  processingSavings = 588000000 * (0.0289 - yunoTakeRate)       // $3.18M at 2.35%
  opsSavings = 160000 + (2400000 * 0.15)                        // $520K fixed
  year1ProcessingSavings = processingSavings * 0.65
  year1OpsSavings = opsSavings * 0.65
  totalYear1Impact = year1Recovered + year1ProcessingSavings + year1OpsSavings
  paybackMonths = netMigration / ((processingSavings + opsSavings) / 12)

Display three preset buttons: "Conservative (0.65x)" / "Base (1.0x)" / "Aggressive (1.35x)"
that set all three multipliers simultaneously — matching the proposal sensitivity table.

CONTENT RENDERING: Render the full proposal text below in each section.
Use styled cards, callout boxes, and Tailwind tables. Highlight key numbers in
indigo/violet. Section 2 stakeholders must render as distinct persona cards
(Daniela / Kevin / Laura) with title, value prop, and top objection preempt.
Section 5 (90-Day Plan) must render as a visual timeline with 5 phases.
Section 3 market table must render as a styled HTML table, not prose.

DELIVERABLE FILES:
  - package.json (Vite + React + Tailwind, correct scripts)
  - vite.config.js
  - tailwind.config.js
  - index.html (with Inter font CDN link)
  - src/main.jsx
  - src/App.jsx (main component, all sections)
  - src/index.css (Tailwind directives)

Must pass `npm install && npm run build` cleanly with zero errors.

===BEGIN PROPOSAL CONTENT===

# VelvetBox × Yuno — Deal Strategy & Commercial Proposal

Account: VelvetBox — $420M subscription GMV / $588M total TPV, 940K subscribers,
18 countries, 40% YoY. Incumbent: Stripe (global) + Mercado Pago (MX/BR).
Competing bid: Adyen. Compelling event: Stripe renewal in 90 days.

Volume convention: $420M = annual subscription GMV; $588M = total TPV including
$168M one-time add-ons. Modeled and priced off these two lines separately.

==EXECUTIVE SUMMARY==

Recommendation: pursue as Tier 1, full resourcing — named exec sponsor and
Yuno-funded embedded solutions engineer on standby from week 1. VelvetBox's
stated pain is Yuno's category almost line for line: collapsing cross-border
recurring approval rates in exactly the LATAM markets where we hold named proof,
multi-PSP sprawl burning two payment engineers, and expired-card churn that is
the textbook case for NOVA + network tokens. There is a clock (90-day Stripe
renewal), an inbound champion (Daniela), and ICP fit (their worst markets are
our strongest references).

The number:
- Recommended pricing: interchange++ landing an all-in ~2.35% blended take rate
  on $588M TPV — below the current 2.89% and inside CFO Laura's <2.5% target.
- Year-1 total impact: ~$23.3M (gross recovered revenue + hard cost savings).
- Steady-state total impact: ~$35.9M. Year-1 is modeled at 65% of steady-state
  throughout (phased migration; full lift by month 6-9).
- Recovered revenue (steady, gross): $32.2M — $23.0M from subscriptions + $9.2M
  from add-ons. Mexico + Brazil alone are worth ~$11.0M.
- Hard cost savings (steady): ~$3.7M/yr — $3.18M processing + $160K (reduce 1
  of 2 payment FTEs) + $360K (~15% chargeback reduction).
- Payback: the hard cost savings alone repay the one-time migration before
  VelvetBox's first quarterly close — before counting a dollar of recovered revenue.

Win theme vs Adyen: live LATAM results inside the 90-day window plus
multi-provider routing Adyen structurally lacks — against a 4-6 month enterprise
integration that blows through the renewal. We compete on total value +
performance terms, never on headline rate alone.

==SECTION 1 — Deal Qualification & Strategic Assessment==

Fit verdict: Strong fit. Pursue hard.

VelvetBox's stated pain is Yuno's category, almost line for line. They have:
(a) cross-border recurring approval rates collapsing in exactly the markets where
we have named proof — Mexico 71%, Brazil 68%; (b) multi-PSP sprawl that's burning
two payment engineers; and (c) expired-card / failed-renewal churn that is the
textbook use case for NOVA and network tokens. Yuno doesn't ask them to rip out
Stripe — orchestration sits on top and routes around the weak rails, which converts
the "third vendor" liability into a complexity-reducing move. Our LATAM evidence
(inDrive: 90% approval, 10 markets in <8 months; Reserva: +4pp in Brazil in <3
months; McDonald's LATAM: 21 countries; Rappi: integration time → zero) lands
precisely where VelvetBox is bleeding.

One honest caveat that shapes the whole pitch: this is a subscription business,
so the local-payment-method story is nuanced. OXXO and Boleto don't recur, and
PIX only recurs via the still-emerging Pix Automático. Our LATAM value is
therefore driven by local acquiring + smart routing + network tokens + NOVA
recovery, not by bolting cash vouchers onto renewals. We win the first payment
with the local method, then migrate to card-on-file + network token for rebills.
Leading with "we'll add OXXO and fix everything" would be a credibility own-goal
with a former PayPal risk operator.

TOP 3 RISKS:

1. Competitive — the "Adyen is the safe choice" reflex (highest risk). Adyen's
"we process trillions" brand is a credibility cudgel against a smaller player,
and it's aimed at the one buyer who can least afford a miss: a 9-month-tenured,
first-time Head of Payments. If we let this become "startup vs. enterprise," we
lose. We must reframe it as "live LATAM results inside 90 days vs. a 4-6 month
enterprise integration that misses your renewal."

2. Technical / execution — Kevin's veto and the Mercado Pago scar. Kevin can kill
any vendor that smells like eng lift, and he has fresh trauma (6-month MP
integration: bad docs, breaking changes, flaky webhooks). A live $588M subscription
book is also genuinely risky to migrate — tokenization migration, network-token
re-enrollment, parallel-run discipline. A botched cutover is simultaneously Kevin's
nightmare and Daniela's career risk.

3. Commercial — the approval-vs-cost framing trap. Daniela is measured on recovered
revenue; Laura is measured on take rate < 2.5%. If those two optimize separately,
Laura can veto on pure price while Daniela fights for approval lift. The deal dies
if our ROI model doesn't fuse approval lift and cost into one unit-economics narrative.

CRITICAL UNKNOWNS (how/who/when):

Unknown 1 — $420M vs $588M scope. Are add-ons in scope for orchestration, or
subscriptions first? Ask Daniela on the next call: "Confirming — $420M is
subscription GMV and $588M is total TPV incl. $168M add-ons. Do we orchestrate
the full $588M, or land subscriptions first?"

Unknown 2 — Real effective rates by market + actual Stripe/MP terms. We've
estimated ~2.89% blended; we don't have their invoices. Request last 3 months of
Stripe + Mercado Pago settlement statements under NDA. Owner: Daniela + Laura's
finance team. This week.

Unknown 3 — Tokenization & churn baseline. What % of the book is tokenized today?
What's the expired-card involuntary churn rate? Daniela / her analytics team, next
call. Tie directly to her "half our churn is expired cards" comment.

Unknown 4 — Adyen's actual offer. We have intel (0.60% + $0.10, 4-6 mo
integration) but not the live terms or whether they're discounting. Ask Daniela
directly: "What's Adyen proposing on rate and go-live date?" Next call.

Unknown 5 — Decision process & exact renewal date. Laura signs >$500K; Kevin can
veto; Daniela recommends. Is there a committee? Hard renewal date? Ask Daniela
for the eval process and the precise Stripe renewal date this week.

THREE DOSSIER CONTRADICTIONS:

Daniela (approval rate) vs. Laura (cost). These are not actually opposed —
recovered revenue is the unit-economics story — but they'll behave as if they are
unless we fuse them. Resolution: build one model where approval lift and take-rate
compression are two lines of the same P&L impact.

Kevin "no more complex integrations" vs. evaluating Adyen (4-6 months of eng).
He's entertaining the single most complex integration on the table while telling
us complexity is a dealbreaker. Resolution + exploit: get Kevin into a technical
session comparing integration scope side by side.

$420M vs. $588M. Realistic seller confusion. Resolution: lead the next call by
stating our assumption back to her and asking her to confirm scope. Demonstrating
we already untangled it is itself a trust signal.

TIER: Tier 1. Defensible on all the things that actually predict a close:
(1) compelling event with a clock — 90-day Stripe renewal; (2) inbound champion —
Daniela reached out off our content; (3) ICP fit — their worst markets are our
strongest references; (4) large, expanding account — ~$17M annual payment spend,
40% YoY growth; (5) multiple matched proofs (inDrive, Reserva, McDonald's LATAM,
Rappi). Recommendation: full resourcing, named exec sponsor, embedded SE on
standby from week 1.

==SECTION 2 — Stakeholder Engagement Strategy==

Three buyers, three different fears, three different pitches.

DANIELA MONTERO — Head of Payments & Fraud (Champion / Recommender)

What's really going on: Nine months in, first head-of-payments role, and the
Mercado Pago bet she personally championed is underdelivering. She's measured on
recovered revenue, she's slightly defensive when MP comes up, and underneath the
data-driven exterior she needs a visible win — and is quietly terrified a botched
migration ends her here.

Value prop: "Turn the LATAM numbers that embarrass you into the win that makes
your name." Recovered revenue she can put in front of the CFO and the board within
one quarter, sourced from her two worst markets.

Lead with NOVA — recovers up to 75% of failed payments via WhatsApp/voice with
zero eng lift (Viva Aerobus). Direct hit on her own words: "half our churn is
expired cards." Pair with network tokens (auto-update on reissue) and smart
routing (+~8% auth). Reserva (+4pp in Brazil in <3 months) is the emotional
anchor. inDrive (90% approval, 10 LATAM markets) is the ceiling.

Protect her MP decision. Don't make her relitigate it. Position Yuno as the layer
that salvages the MP investment — route around its weak spots, fallback recovers
~8% — rather than a confession that she chose wrong.

Her #1 objection: "Adyen is the proven enterprise vendor. Why bet my credibility
on a smaller player?" Preempt it: invert the risk. The career risk isn't choosing
the nimble vendor — it's a 4-6 month Adyen integration that slips past her renewal
and leaves LATAM bleeding for two more quarters. We de-risk her bet structurally:
pilot-first in Mexico + Brazil, approval-rate SLA with performance-based pricing,
reference calls with inDrive/Reserva/McDonald's LATAM, and an exec sponsor who
stands behind the SLA in writing.

KEVIN ZHAO — CTO & Co-Founder (Veto power)

What's really going on: He built this platform from scratch and takes engineering
quality personally. Mercado Pago burned him — poor docs, breaking API changes,
flaky webhooks — and he has zero appetite for "yet another integration." His real
currency is his team's velocity.

Value prop: "One no-code API that removes providers from your team's plate instead
of adding one." Today every PSP is a direct integration his team owns and maintains;
with Yuno he integrates once and adds/swaps providers config-side, no eng work.

Rappi is his reference, not Daniela's: provider integration time → zero, analyst
workload −80%, disruption response from minutes to milliseconds. That's the precise
anti-Mercado-Pago story. Reliability and governance in writing: SOC 2 Type 2, ISO
27001, ISO 27701, PCI DSS; documented API; live sandbox; webhook and uptime SLAs
committed in the contract. It's not his team's burn: a Yuno-funded embedded
solutions engineer for 60 days does the heavy lifting, and NOVA + Payments
Concierge ship with zero eng build.

His #1 objection: "What's the actual integration effort, and how do I know your
webhooks won't be flaky like Mercado Pago's?" Preempt it: book an
engineer-to-engineer technical deep-dive early — sandbox access, API docs,
webhook/retry architecture, uptime SLA — and let him pressure-test it. Reframe
the vendor count: orchestration takes him from N direct PSP integrations down to
one API surface he controls; Stripe stays as a rail underneath.

LAURA SÁNCHEZ — CFO (Final approver, >$500K)

What's really going on: Payments are her #2 cost line after COGS; she came from
Glossier so she knows beauty-subscription economics cold; she's a sharp negotiator
who wants transparent, predictable pricing and hates long lock-ins.

Value prop: "Under your 2.5% target, plus a bigger durable lever — recovered
revenue — without a multi-year handcuff."

Take rate: interchange++ at a blended ~2.3-2.4% beats both her <2.5% target and
the current 2.89% — ~$3M+ in processing savings, with local acquiring compressing
LATAM interchange further. Transparency she can audit: interchange++ passes
interchange through transparently — she sees every cent, unlike Stripe's blended
rate or Adyen's opaque pricing. Operational + risk savings: reduce 1 of 2 payment
FTEs (~$160K) via no-code + Payments Concierge; model a conservative ~15%
chargeback reduction (~$360K) against the $2.4M base. Terms she'll accept: no
long lock-in (shorter term + ramp-based commitment), performance element that
aligns incentives. The hard cost savings alone repay the migration before the
first quarterly close.

Her #1 objection: "Even if pricing's slightly better, migration cost and risk
aren't worth pulling eng off product for 3-4 months." Preempt it: show the payback
math — repaid before the first quarterly close — and make clear the migration
isn't on her P&L or Kevin's headcount: Yuno funds the embedded SE, and the phased
MX/BR pilot proves it before any scale spend. Then reframe the cost of inaction:
renewing Stripe locks in 2.89% for another term while LATAM approval losses
compound against 40% volume growth.

MULTI-THREADING PLAN:

Daniela is the inbound champion, but she only recommends — Kevin can veto and
Laura signs. A single-threaded deal here dies on the renewal clock.

Kevin — neutralize the veto before it forms. Yuno solutions architect runs an
early technical session; bring the embedded-SE offer and the Rappi reference.
Goal: convert the most dangerous skeptic into a quiet "this is fine."

Laura — peer-level commercial conversation. A dedicated CFO session on unit
economics with a one-page model; bring the Yuno exec sponsor for peer-to-peer
air cover and to personally stand behind the approval-rate SLA.

Regional GMs (Mexico, Brazil, SEA) — bottom-up pressure. They're loud, ignored,
and desperate for their markets to work. Ask Daniela to put the Mexico + Brazil
GMs into the pilot as owners — they become internal advocates pushing HQ from
below while we sell top-down.

Reference matching: inDrive/Reserva → Daniela (LATAM approval), Rappi → Kevin
(eng reliability), McDonald's LATAM/Arcos Dorados → Laura & Daniela (enterprise
credibility that defuses "too small/too risky").

==SECTION 3 — Commercial Proposal & Financial Impact Model==

All figures proposed/illustrative on dossier data + cited benchmarks. $ in millions.
Every input is live in the attached working model (Excel).

PRICING RECOMMENDATION:

Model: Interchange++ with a thin Yuno orchestration markup, plus a performance-based
slice tied to an approval-rate SLA. We are not proposing blended pricing — for a
high-volume, low-AOV subscription book, blended rates quietly overcharge on
low-risk card-on-file MITs. Interchange++ passes the real interchange through and
prices Yuno transparently on top.

Proposed all-in blended take rate: ~2.35% on $588M TPV (illustrative range
2.30-2.40%). That clears Laura's <2.5% target and beats today's ~2.89%.

Pricing layers:
- Interchange + scheme fees: pass-through (~1.9-2.0% blended), compressed in
  LATAM by local acquiring (domestic interchange << cross-border)
- Acquirer fees: bundled, routed — Yuno routes to the best local acquirer per market
- Yuno orchestration markup: ~0.25-0.35% — the only Yuno-controlled line
- All-in blended: ~2.35% (vs current 2.89%; vs CFO target <2.50%)

Performance element: carve ~0.10-0.15% of the orchestration markup into an
approval-rate SLA hold-back — Yuno only earns it if blended approval clears an
agreed threshold (e.g., LATAM ≥ 79%) by month 6. Aligns our incentive with
Daniela's KPI and converts "trust the startup" into "pay for results."

Positioning vs Adyen (0.60% + $0.10): we do not claim a pure-rate win. We anchor
on all-in ~2.35% vs the current 2.89% (clearing the <2.5% target), and on what
Adyen structurally cannot do: Adyen is a single acquirer and cannot route around
its own declines, whereas Yuno re-routes across providers in real time. The rate
gap to Adyen is close; the approval and routing advantage is where Yuno wins.

RECOVERED REVENUE — MARKET BY MARKET (steady-state, gross):

Method: attempted = captured ÷ current rate, then incremental = attempted ×
(new − old rate), summed on the $420M subscription base.

Market table (Captured $M | Current % | Target % | Δpp | Recovered $M | Lever):
US     | 180 | 87% | 89% | +2  | 4.14 | Tokens + routing
Canada |  24 | 85% | 87% | +2  | 0.56 | Tokens + routing
UK     |  42 | 84% | 87% | +3  | 1.50 | Routing + tokens
Germany|  28 | 83% | 86% | +3  | 1.01 | Routing + tokens
France |  18 | 82% | 85% | +3  | 0.66 | Routing + tokens
Spain  |  14 | 81% | 84% | +3  | 0.52 | Routing + tokens
MEXICO |  38 | 71% | 81% | +10 | 5.35 | Local acquiring + methods + tokens
BRAZIL |  32 | 68% | 80% | +12 | 5.65 | Local acquiring (Reserva +4pp floor)
Colombia| 12 | 74% | 82% | +8  | 1.30 | Off cross-border Stripe → local
Chile  |   8 | 73% | 81% | +8  | 0.88 | Off cross-border → local
Singapore| 10| 79% | 83% | +4  | 0.51 | Local acquiring + methods
Thailand|   6| 76% | 81% | +5  | 0.39 | Local acquiring + methods
Indonesia|  4| 72% | 78% | +6  | 0.33 | Local acquiring + methods
Malaysia|   4| 77% | 81% | +4  | 0.21 | Local acquiring + methods
TOTAL SUBSCRIPTION: $420M → $23.0M recovered

Add-on volume ($168M): scaled at 0.40 ratio → +$9.2M recovered.
Total steady-state recovered: $32.2M gross.

Conservative by design: $23.0M subscription recovered is the exact gross-up on
the base table — nothing rounded up. Built to survive Daniela's own spreadsheet.

LATAM is half the prize: Mexico + Brazil alone = $11.0M of the $23.0M, on just
$70M of volume. That is the headline.

Contribution-margin nuance: recovered revenue is gross. At an assumed 55%
contribution margin, steady recovered ≈ $17.7M of margin. Lead with gross for
Daniela's recovered-revenue KPI; show the margin view so Laura trusts the model.

YEAR-1 VS STEADY-STATE P&L IMPACT (Year-1 = 65% of steady-state):

                          Year-1    Steady-state    Whose KPI
Recovered revenue (gross)  20.9M      32.2M         Daniela
Recovered revenue (55% CM) 11.5M      17.7M         (profit view)
Processing savings          2.1M       3.2M         Laura
FTE + chargeback savings    0.3M       0.5M         Laura
Total value (gross + cost) 23.3M      35.9M
Total value (CM + cost)    13.9M      21.4M

COST SAVINGS (hard P&L, independent of approval lift):

Processing: (2.89% − 2.35%) × $588M = $3.18M
Reduce 1 of 2 payment FTEs (no-code + Payments Concierge) = $0.16M
Chargeback −15% (conservative vs Yuno's 29% fraud-cut claim): 15% × $2.4M = $0.36M
Total steady cost savings/yr: $3.70M

MIGRATION COST & PAYBACK:

Gross one-time migration (eng diversion + QA + parallel-run): $250K
Less: Yuno-funded embedded solutions engineer, 60 days: ($70K)
Net migration cost: $180K

Payback: the hard cost savings alone repay the migration before VelvetBox's first
quarterly close. Net one-time migration is $0.18M; a single quarter of steady cost
savings is ~$0.92M ($3.7M/yr ÷ 4). Repaid before the first quarterly close —
before counting a dollar of recovered revenue. This is the direct answer to Laura's
"migration isn't worth it" objection.

THREE-SCENARIO SENSITIVITY:

Scenario      | Lift realized | Subs $M | Incl add-ons $M | Year-1 $M | Total steady $M
Conservative  | 65% of target |   15.0  |      20.9       |   13.6    |    24.6
Base          | 100%          |   23.0  |      32.2       |   20.9    |    35.9
Aggressive    | 135% (~+15pp) |   31.0  |      43.5       |   28.3    |    47.2

The aggressive case maps Mexico and Brazil to roughly +15pp — still below the
external benchmark of +14-21pp for MX local acquiring. Our base +10pp (MX) /
+12pp (BR) is deliberately conservative; even the conservative case clears the
CFO's cost target and returns >$24M of total value.

CONTRACT STRUCTURE:

ACV: Yuno orchestration revenue ≈ $1.4-2.0M/yr (the ~0.25-0.35% markup on $588M),
scaling with VelvetBox's 40% growth.
Term: 24 months, ramped commitment (no punitive lock-in — Laura hates them), with
a 90-day pilot exit on Mexico + Brazil.
Performance pricing: ~0.10-0.15% SLA hold-back released on hitting agreed
approval thresholds.
Payment terms: monthly, interchange++ pass-through itemized.

ASSUMPTIONS & REGIONAL NOTES:

- $420M = subscription GMV; $588M = total TPV (incl. $168M add-ons). Confirm
  with Daniela on the next call.
- OXXO and Boleto are non-recurring (cash vouchers). Strategy: win the first
  payment with the local method, then enroll card-on-file + network token for
  renewals.
- Pix Automático (Recurring Pix) is an emerging purpose-built rail for Brazil
  subscription billing — shows regional depth; treat as upside, not modeled.
- Network tokens: Visa +4.6% / Mastercard +2.1% auth lift cited; we bake a
  conservative 2-3pp into mature-market targets, directly attacking the "half our
  churn is expired cards" problem.
- Brazil +12pp is the one assumption to validate in pilot (Reserva's +4pp in 3
  months is the floor, not the ceiling).
- Decline mix: ~70% soft declines (recoverable via routing/retry/NOVA), ~30%
  hard declines (not recoverable).

==SECTION 4 — Objection Handling==

Objection 1 — Kevin (CTO): "That's three vendors instead of two. You're adding
complexity, not reducing it."

Kevin, that's exactly the wrong outcome, and it's the one I'd push back on too if
I thought Yuno were a fourth box to maintain. Yuno isn't another PSP stacked on
top of Stripe and Mercado Pago — it's the orchestration layer that lets you
collapse the integration sprawl you already own. Today your team maintains a direct
Stripe integration, a direct Mercado Pago integration, and homegrown retry logic
that you've called "dumb"; every new regional method request becomes another bespoke
project. With Yuno you integrate once against a single no-code API, then keep Stripe
where it genuinely wins (US Amex rates) and add local acquirers in Brazil and Mexico
as routing config, not as new code. Rappi did exactly this: provider integration
time went to zero and analyst workload dropped 80%. The complexity you're worried
about adding is precisely the complexity Yuno removes — the next OXXO, PIX, or
GrabPay request from your GMs becomes a toggle, not a six-month roadmap hit.

Objection 2 — Laura (CFO): "Even if pricing is slightly better, migration cost
and risk aren't worth it. We'd pull engineering from product for 3-4 months."

Laura, the engineering-drain concern is the right one to lead with, so let me take
it head-on: Yuno funds an embedded solutions engineer for 60 days, so this migration
doesn't come out of Kevin's product roadmap — that's our cost, not yours. And the
ROI isn't a thin pricing delta. Fee savings are real (blended ~2.3-2.4% vs your
current 2.89% is $3M+, plus ~$160K from reducing one of two payment FTEs and ~$360K
from lower chargebacks), but those are the small number. The headline is recovered
revenue: lifting approval across the book — Brazil 68→80, Mexico 71→81, and twelve
other markets — drives ~$32M in recovered gross revenue at steady state (~$23M from
subscriptions, the balance from add-ons), with Mexico and Brazil alone worth ~$11M
of it — an order of magnitude above the migration cost, which the hard cost savings
alone repay before your first quarterly close. We phase it: start with your
highest-pain, highest-upside markets on a parallel run, so there's no big-bang
cutover risk. And we'll tie a slice of our fee to an approval-rate SLA — if we don't
move the number, you don't pay the full rate.

Objection 3 — Daniela (Head of Payments): "Adyen offers local acquiring in 25
markets, tokenization, processes trillions. You're a Series B startup. Why bet my
credibility on Yuno?"

Daniela, you're nine months in and you need a win that holds up — so let's be
clear-eyed about which option actually carries the career risk. Adyen's "safe"
pitch comes with a 4-6 month integration — that's Kevin's Mercado Pago nightmare
all over again, and it blows straight through your 90-day Stripe window, which is
the one deadline you can't miss. Their scale is the liability here, not the asset:
enterprise overkill and the opaque pricing you've already flagged, sold to a
high-growth subscription company that needs speed and partnership, not a vendor that
treats $588M as a rounding error. Yuno does the same things that matter to you —
local acquiring and network tokenization — but our proof is in your exact problem:
inDrive (90% approval, 10 LATAM countries in under 8 months), McDonald's LATAM (21
countries unified), Rappi, and Reserva in Brazil (+4pp approval in under 3 months).
Those LATAM logos are more relevant to a head of payments fighting a 68% Brazil rate
than "processes trillions" ever will be. And on the "startup risk" worry — ISO 27001,
ISO 27701, PCI DSS, and SOC 2 Type 2 are the same bar Adyen clears. You're not
betting your credibility on a gamble; you're betting it on the faster, better-fit
path to the number you're measured on.

Objection 4 — Kevin (CTO): "What's the actual integration effort? And how do I
know your API won't have the same flaky webhook issues we had with Mercado Pago?"

Kevin, the Mercado Pago experience — six months, poor docs, breaking API changes,
webhooks you couldn't trust — is exactly the bar I want to be measured against,
because Yuno is built to be its opposite. The effort is a single no-code API: one
integration that fronts every provider, versus the per-provider rebuilds you've
been doing. Concretely, we put a Yuno-funded embedded SE on your team for 60 days
so your engineers aren't reverse-engineering our docs alone, and our certifications
(PCI DSS, SOC 2 Type 2, ISO 27001/27701) reflect the operational discipline behind
the platform — this isn't a flaky API surface. On reliability specifically: Rappi
cut disruption-response time from minutes to milliseconds on Yuno and reduced
analyst load 80%, and we'll prove webhook delivery to you in a sandbox parallel run
before any cutover, plus a direct reference call with Rappi's or another customer's
engineering lead. You don't have to take the API on faith — validate it against your
own traffic first, then commit.

==SECTION 5 — 90-Day Deal Plan==

Objective: signed orchestration contract and a live Mexico + Brazil pilot before
the Stripe renewal forces VelvetBox's hand. Confirm the exact renewal date in week 1.

PHASE 0 — Week 1: Land the artifact, confirm the brief
- Deliver this proposal package by EOW — the "something concrete" Daniela asked for.
- Next call with Daniela: confirm $420M/$588M scope; request 3 months of Stripe +
  MP statements (NDA); confirm decision process, signers, exact renewal date; ask
  Adyen's live terms.
- Secure intros to Kevin (technical) and Laura (commercial).
- Exit: assumptions validated, multi-thread intros booked.

PHASE 1 — Weeks 2-3: Multi-thread & technical validation
- Kevin deep-dive: sandbox, API docs, webhook/uptime SLA, integration scope,
  embedded-SE offer; Rappi reference. Defuse the MP scar.
- Laura session: ROI model walkthrough, interchange++ transparency, payback,
  no-lock-in terms; exec sponsor joins.
- Reference calls for Daniela (inDrive / Reserva).
- Refine the ROI model with real rate data from Phase 0.
- Exit: no Kevin veto; Laura bought into the economics; Daniela has internal air cover.

PHASE 2 — Weeks 4-6: Pilot design & commercial alignment
- Scope the pilot: Mexico + Brazil (~$70M combined, the two worst approval rates —
  fastest, most defensible proof; Reserva's +4pp/3mo is the floor).
- Define success metrics: approval-rate targets (MX 71→81, BR 68→80 base case),
  recovered revenue, integration effort, webhook reliability.
- Lock the approval-rate SLA + performance pricing; sign the pilot order form.
- Engage the Yuno-funded embedded SE (60 days).
- Exit: signed pilot, kickoff scheduled.

PHASE 3 — Weeks 7-10: Pilot execution (Mexico + Brazil)
- Integrate via the single API; migrate MX/BR on a parallel run alongside Mercado
  Pago — no big-bang cutover (de-risks Kevin and Daniela simultaneously).
- Turn on smart routing + fallback, enroll network tokens for card-on-file, deploy
  NOVA for failed-renewal recovery.
- Weekly readouts to Daniela — her ammunition for internal updates.
- Exit: live approval-rate lift data in MX/BR, inside the renewal window.

PHASE 4 — Weeks 11-13: Prove, expand, close
- Present pilot results vs. baseline: approval lift, recovered revenue, cost delta,
  actual integration effort.
- Convert to MSA: phased global rollout (LATAM → SEA → mature markets), full ACV,
  ramp-based term, approval-rate SLA.
- Time the signature to land before the Stripe renewal decision.
- Exit: CLOSED.

RESOURCES NEEDED:
- Embedded solutions engineer (Yuno-funded, 60 days) — neutralizes Kevin's veto
  and Laura's migration-cost objection simultaneously.
- Exec sponsor (Yuno VP Sales / C-level) — peer to Laura, assurance for Daniela.
- Solutions architect for Kevin's technical session.
- References, sequenced by stakeholder: inDrive, Reserva, McDonald's LATAM, Rappi.
- Pilot scope: Mexico + Brazil.

COMPETITIVE MOVES VS ADYEN:
- Win on speed. Adyen needs 4-6 months; we can have MX/BR live inside 90 days.
  Proof beats promise.
- Weaponize Kevin's own contradiction. Side-by-side integration scope: one no-code
  Yuno API vs. a multi-month enterprise build that is his Mercado Pago nightmare at scale.
- Exploit "overkill + opaque." Right-sized orchestration with transparent
  interchange++ vs. enterprise bloat and pricing Laura can't audit.
- Out-structure them on terms. Put our fee at risk on an approval-rate SLA —
  Adyen won't.
- Don't make them leave Stripe. Orchestration keeps Stripe as a rail;
  Adyen is rip-and-replace. Lower risk wins a risk-averse buyer.

RISK MITIGATIONS:
- Migration risk → pilot-first, parallel run, Yuno-funded SE, no big-bang.
- Kevin veto → early eng-to-eng engagement + SLAs in writing + Rappi reference.
- Laura price / lock-in → repaid before first quarterly close, no long lock-in,
  performance pricing.
- Daniela career risk → pilot de-risk, SLA, exec air cover, references.
- Timeline / auto-renew → confirm exact renewal date week 1; if tight, negotiate
  a short Stripe extension or run Yuno in parallel.
- Adyen rate war → compete on total value + performance terms, never on headline
  rate alone.

DEFINITION OF CLOSED:
A signed orchestration contract (MSA + order form) landed before the Stripe renewal
decision, plus Mexico + Brazil live in production showing measured approval-rate
lift, with a committed phased global rollout. Not a POC, not a verbal — production
traffic in the two worst markets and a signature.

===END PROPOSAL CONTENT===
