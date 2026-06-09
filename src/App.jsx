import { useState } from 'react'

// ── Market data ───────────────────────────────────────────────────────────────
const MARKETS = [
  { label: 'US',        captured: 180, currentRate: 0.87, baseLiftPP: 2,  group: 'mature' },
  { label: 'Canada',    captured: 24,  currentRate: 0.85, baseLiftPP: 2,  group: 'mature' },
  { label: 'UK',        captured: 42,  currentRate: 0.84, baseLiftPP: 3,  group: 'mature' },
  { label: 'Germany',   captured: 28,  currentRate: 0.83, baseLiftPP: 3,  group: 'mature' },
  { label: 'France',    captured: 18,  currentRate: 0.82, baseLiftPP: 3,  group: 'mature' },
  { label: 'Spain',     captured: 14,  currentRate: 0.81, baseLiftPP: 3,  group: 'mature' },
  { label: 'Mexico',    captured: 38,  currentRate: 0.71, baseLiftPP: 10, group: 'latam'  },
  { label: 'Brazil',    captured: 32,  currentRate: 0.68, baseLiftPP: 12, group: 'latam'  },
  { label: 'Colombia',  captured: 12,  currentRate: 0.74, baseLiftPP: 8,  group: 'latam'  },
  { label: 'Chile',     captured: 8,   currentRate: 0.73, baseLiftPP: 8,  group: 'latam'  },
  { label: 'Singapore', captured: 10,  currentRate: 0.79, baseLiftPP: 4,  group: 'sea'    },
  { label: 'Thailand',  captured: 6,   currentRate: 0.76, baseLiftPP: 5,  group: 'sea'    },
  { label: 'Indonesia', captured: 4,   currentRate: 0.72, baseLiftPP: 6,  group: 'sea'    },
  { label: 'Malaysia',  captured: 4,   currentRate: 0.77, baseLiftPP: 4,  group: 'sea'    },
]

// ── ROI math ──────────────────────────────────────────────────────────────────
function computeROI({ latamMult, matureMult, seaMult, yunoTakeRate, netMigration }) {
  const mults = { latam: latamMult, mature: matureMult, sea: seaMult }
  let subscriptionRecovered = 0

  for (const m of MARKETS) {
    const effectiveLiftPP = m.baseLiftPP * mults[m.group]
    const attempted = m.captured / m.currentRate
    subscriptionRecovered += attempted * (effectiveLiftPP / 100)
  }

  const grossRecovered         = subscriptionRecovered * 1.4
  const year1Recovered         = grossRecovered * 0.65
  const processingSavings      = 588 * (0.0289 - yunoTakeRate)         // $M
  const opsSavings             = (160000 + 2400000 * 0.15) / 1e6       // $M = 0.52
  const year1ProcessingSavings = processingSavings * 0.65
  const year1OpsSavings        = opsSavings * 0.65
  const totalYear1Impact       = year1Recovered + year1ProcessingSavings + year1OpsSavings
  const paybackMonths          = (netMigration / 1e6) / ((processingSavings + opsSavings) / 12)

  return {
    subscriptionRecovered,
    grossRecovered,
    year1Recovered,
    processingSavings,
    opsSavings,
    year1ProcessingSavings,
    year1OpsSavings,
    totalYear1Impact,
    paybackMonths,
  }
}

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtM  = (n) => `$${n.toFixed(1)}M`
const fmtMo = (n) => `${n.toFixed(1)} mo`

// ── Shared UI primitives ──────────────────────────────────────────────────────
function SectionWrap({ id, children, alt }) {
  return (
    <section
      id={id}
      className={`py-24 px-6 ${alt ? 'bg-[#13131f]' : 'bg-[#0F0F1A]'}`}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  )
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <div className="mb-12">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
          {label}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-gray-400 max-w-2xl text-sm leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#1A1A2E] border border-white/10 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  )
}

function Callout({ children, color = 'indigo', className = '' }) {
  const styles = {
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-200',
    amber:  'bg-amber-500/10  border-amber-500/30  text-amber-200',
    red:    'bg-red-500/10    border-red-500/30    text-red-200',
    green:  'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
  }
  return (
    <div className={`border rounded-xl p-5 ${styles[color]} ${className}`}>
      {children}
    </div>
  )
}

function Num({ children }) {
  return <span className="text-indigo-400 font-semibold">{children}</span>
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV = [
  { href: '#hero',          label: 'Summary'       },
  { href: '#qualification', label: 'Deal Fit'      },
  { href: '#stakeholders',  label: 'Stakeholders'  },
  { href: '#commercial',    label: 'Proposal & ROI'},
  { href: '#objections',    label: 'Objections'    },
  { href: '#plan',          label: '90-Day Plan'   },
]

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F1A]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-bold">
          <span className="text-indigo-400">Yuno</span>
          <span className="text-white/30 mx-1">×</span>
          <span className="text-violet-400">VelvetBox</span>
        </span>
        <div className="hidden md:flex items-center gap-0.5">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const stats = [
    { label: 'Year-1 Total Impact',  value: '$23.3M'      },
    { label: 'Processing Savings',   value: '$3.18M/yr'   },
    { label: 'Payback',              value: '< 1 Quarter' },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-14 flex flex-col justify-center px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/25 via-[#0F0F1A] to-violet-900/20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full py-24 relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-5">
          Confidential — Deal Strategy &amp; Commercial Proposal
        </p>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
          <span className="text-white">Yuno </span>
          <span className="text-white/20">×</span>
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"> VelvetBox</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-3 leading-relaxed">
          How Yuno recovers{' '}
          <Num>$23.3M in Year 1</Num>{' '}
          and drops your take rate from{' '}
          <span className="text-red-400 line-through">2.89%</span> to{' '}
          <span className="text-emerald-400 font-semibold">2.35%</span>.
        </p>

        <p className="text-sm text-gray-500 mb-16">
          $420M subscription GMV · $588M total TPV · 940K subscribers · 18 countries · 40% YoY · Stripe renewal in <strong className="text-amber-400">90 days</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mb-14">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-500/25 rounded-2xl p-6"
            >
              <p className="text-4xl font-extrabold text-white mb-2">{s.value}</p>
              <p className="text-sm text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl">
          <Callout color="indigo">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Win Theme vs Adyen</p>
            <p className="text-sm leading-relaxed text-gray-300">
              Live LATAM results inside the 90-day window plus multi-provider routing Adyen structurally lacks — against a
              4–6 month enterprise integration that blows through the renewal. We compete on{' '}
              <strong className="text-white">total value + performance terms</strong>, never on headline rate alone.
            </p>
          </Callout>
        </div>
      </div>
    </section>
  )
}

// ── Deal Qualification ────────────────────────────────────────────────────────
function DealQualification() {
  const risks = [
    {
      n: '01',
      severity: 'Highest Risk',
      sevColor: 'text-red-400',
      title: 'Competitive — "Adyen is the safe choice" reflex',
      body: `Adyen's "we process trillions" brand is a credibility cudgel against a smaller player, aimed at the one buyer who can least afford a miss: a 9-month-tenured, first-time Head of Payments. If we let this become "startup vs. enterprise," we lose.`,
      response: 'Reframe: live LATAM results inside 90 days vs. a 4–6 month enterprise integration that misses the renewal and leaves LATAM bleeding for two more quarters.',
    },
    {
      n: '02',
      severity: 'High Risk',
      sevColor: 'text-amber-400',
      title: "Technical — Kevin's veto and the Mercado Pago scar",
      body: `Kevin can kill any vendor that smells like eng lift. He has fresh trauma — 6-month MP integration: bad docs, breaking API changes, flaky webhooks. A live $588M subscription book is also genuinely risky to migrate.`,
      response: 'Early eng-to-eng technical session. Sandbox, webhook SLA, Rappi reference. Yuno-funded embedded SE (60 days) takes the migration burden — not his team\'s burn.',
    },
    {
      n: '03',
      severity: 'Moderate Risk',
      sevColor: 'text-yellow-400',
      title: 'Commercial — the approval-vs-cost framing trap',
      body: `Daniela is measured on recovered revenue; Laura is measured on take rate <2.5%. If they optimize separately, Laura can veto on pure price while Daniela fights for approval lift.`,
      response: 'Build one model where approval lift and take-rate compression are two lines of the same P&L impact. These are not opposed — present them fused.',
    },
  ]

  const unknowns = [
    { n: 1, label: '$420M vs $588M scope',              q: 'Are add-ons in scope for orchestration, or subscriptions first? Confirm with Daniela on the next call.',                                    owner: 'Daniela — next call'                  },
    { n: 2, label: 'Real effective rates by market',    q: 'Request last 3 months of Stripe + Mercado Pago settlement statements under NDA. We\'ve estimated ~2.89% blended.',                       owner: 'Daniela + Laura — this week'          },
    { n: 3, label: 'Tokenization & churn baseline',     q: 'What % of the book is tokenized today? What\'s the expired-card involuntary churn rate?',                                                  owner: "Daniela's analytics — next call"      },
    { n: 4, label: "Adyen's actual live offer",         q: 'We have intel (0.60% + $0.10, 4–6 mo integration) but not the live terms or whether they\'re discounting. Ask Daniela directly.',         owner: 'Ask Daniela — next call'              },
    { n: 5, label: 'Decision process & exact renewal',  q: 'Laura signs >$500K; Kevin can veto; Daniela recommends. Is there a committee? Hard renewal date? Confirm this week.',                     owner: 'Ask Daniela — this week'              },
  ]

  const contradictions = [
    {
      title: 'Daniela (approval) vs. Laura (cost)',
      body: 'Not actually opposed — recovered revenue is the unit-economics story — but they\'ll behave as if they are. Resolution: build one model where approval lift and take-rate compression are two lines of the same P&L impact.',
    },
    {
      title: "Kevin 'no complex integrations' vs. evaluating Adyen (4–6 months)",
      body: "He's entertaining the single most complex integration on the table while citing complexity as a dealbreaker. Exploit it: side-by-side integration scope comparison in a technical session.",
    },
    {
      title: '$420M vs. $588M — realistic seller confusion',
      body: 'Resolution: lead the next call by stating our assumption back to Daniela and asking her to confirm scope. Demonstrating we untangled it is itself a trust signal.',
    },
  ]

  return (
    <SectionWrap id="qualification" alt>
      <SectionHeader
        label="Section 1"
        title="Deal Qualification & Strategic Assessment"
        subtitle="Fit verdict: Strong. Pursue hard. VelvetBox's stated pain is Yuno's category, almost line for line."
      />

      <Callout color="green" className="mb-10">
        <div className="flex items-start gap-4">
          <div className="text-3xl font-black text-emerald-400 flex-shrink-0">T1</div>
          <div>
            <p className="font-bold text-emerald-300 mb-1">Tier 1 — Full resourcing. Named exec sponsor + embedded SE on standby from week 1.</p>
            <p className="text-xs text-emerald-400/80 leading-relaxed">
              (1) Compelling event with a clock — 90-day Stripe renewal ·
              (2) Inbound champion — Daniela reached out off our content ·
              (3) ICP fit — their worst markets are our strongest references ·
              (4) ~$17M annual payment spend, 40% YoY growth ·
              (5) Multiple matched proofs: inDrive, Reserva, McDonald's LATAM, Rappi
            </p>
          </div>
        </div>
      </Callout>

      <Card className="mb-10">
        <h3 className="text-lg font-semibold text-white mb-3">Why the fit is strong</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">
          VelvetBox has: (a) cross-border recurring approval rates collapsing in exactly the markets where we have named proof —{' '}
          <Num>Mexico 71%</Num>, <Num>Brazil 68%</Num>; (b) multi-PSP sprawl burning two payment engineers; and (c) expired-card
          / failed-renewal churn that is the textbook case for NOVA and network tokens. Yuno doesn't ask them to rip out Stripe —
          orchestration sits on top and routes around the weak rails.
        </p>
        <p className="text-sm text-amber-300/80 leading-relaxed">
          <strong className="text-amber-400">One honest caveat:</strong>{' '}
          This is a subscription business. OXXO and Boleto don't recur; PIX only recurs via the still-emerging Pix Automático.
          Our LATAM value is local acquiring + smart routing + network tokens + NOVA recovery — not bolting cash vouchers onto renewals.
          We win the first payment with the local method, then migrate to card-on-file + network token for rebills.
          Leading with "we'll add OXXO and fix everything" would be a credibility own-goal with a former PayPal risk operator.
        </p>
      </Card>

      <h3 className="text-xl font-bold text-white mb-5">Top 3 Risks</h3>
      <div className="space-y-4 mb-12">
        {risks.map((r) => (
          <Card key={r.n}>
            <div className="flex items-start gap-4">
              <span className="text-4xl font-black text-white/8 flex-shrink-0 leading-none">{r.n}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white">{r.title}</h4>
                  <span className={`text-xs font-bold ${r.sevColor}`}>{r.severity}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">{r.body}</p>
                <p className="text-sm text-indigo-300">
                  <span className="font-semibold text-indigo-400">Response: </span>{r.response}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-bold text-white mb-5">Critical Unknowns — How / Who / When</h3>
      <div className="space-y-3 mb-12">
        {unknowns.map((u) => (
          <div key={u.n} className="bg-[#1A1A2E] border border-white/10 rounded-xl p-5 flex gap-4">
            <span className="text-xs font-bold text-violet-400 flex-shrink-0 mt-0.5">#{u.n}</span>
            <div>
              <p className="font-semibold text-white text-sm">{u.label}</p>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">{u.q}</p>
              <p className="text-xs text-violet-400 mt-1.5 font-medium">Owner: {u.owner}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold text-white mb-5">Three Dossier Contradictions</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {contradictions.map((c) => (
          <Card key={c.title}>
            <h4 className="font-semibold text-amber-400 text-sm mb-2">{c.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{c.body}</p>
          </Card>
        ))}
      </div>
    </SectionWrap>
  )
}

// ── Stakeholder Engagement ────────────────────────────────────────────────────
function StakeholderEngagement() {
  const personas = [
    {
      name: 'Daniela Montero',
      title: 'Head of Payments & Fraud',
      role: 'Champion / Recommender',
      gradient: 'from-indigo-700 to-indigo-900',
      accent: 'text-indigo-400',
      borderColor: 'border-indigo-500/25',
      pill: 'bg-indigo-500/20 text-indigo-300',
      context: 'Nine months in, first head-of-payments role, and the Mercado Pago bet she personally championed is underdelivering. Measured on recovered revenue, slightly defensive when MP comes up. Needs a visible win — and is quietly terrified a botched migration ends her here.',
      valueProp: 'Turn the LATAM numbers that embarrass you into the win that makes your name. Recovered revenue she can put in front of the CFO and board within one quarter, sourced from her two worst markets.',
      leads: [
        'NOVA — recovers up to 75% of failed payments via WhatsApp/voice with zero eng lift (Viva Aerobus proof)',
        'Network tokens — auto-update on card reissue; direct hit on "half our churn is expired cards"',
        'Smart routing — +~8% auth lift',
        'Reserva (+4pp in Brazil, <3 months) = emotional anchor',
        'inDrive (90% approval, 10 LATAM markets) = ceiling',
      ],
      protect: 'Protect her MP decision. Position Yuno as the layer that salvages the MP investment — route around its weak spots, fallback recovers ~8% — rather than a confession she chose wrong.',
      objection: '"Adyen is the proven enterprise vendor. Why bet my credibility on a smaller player?"',
      preempt: 'Invert the risk. The career risk isn\'t choosing the nimble vendor — it\'s a 4–6 month Adyen integration that slips past the renewal and leaves LATAM bleeding for two more quarters. Pilot-first in Mexico + Brazil, approval-rate SLA with performance-based pricing, exec sponsor who stands behind the SLA in writing.',
    },
    {
      name: 'Kevin Zhao',
      title: 'CTO & Co-Founder',
      role: 'Veto Power',
      gradient: 'from-violet-700 to-violet-900',
      accent: 'text-violet-400',
      borderColor: 'border-violet-500/25',
      pill: 'bg-violet-500/20 text-violet-300',
      context: 'Built this platform from scratch and takes engineering quality personally. Mercado Pago burned him — poor docs, breaking API changes, flaky webhooks — and he has zero appetite for "yet another integration." His real currency is his team\'s velocity.',
      valueProp: 'One no-code API that removes providers from your team\'s plate instead of adding one. Today every PSP is a direct integration his team owns; with Yuno he integrates once and adds/swaps providers config-side — no eng work.',
      leads: [
        'Rappi is his reference, not Daniela\'s: provider integration time → zero, analyst workload −80%, disruption response from minutes to milliseconds',
        'SOC 2 Type 2, ISO 27001, ISO 27701, PCI DSS — reliability and governance in writing',
        'Yuno-funded embedded SE for 60 days — not his team\'s burn',
        'NOVA + Payments Concierge ship with zero eng build',
        'Next OXXO/PIX/GrabPay request = a toggle, not a 6-month roadmap hit',
      ],
      protect: 'Reframe vendor count: orchestration takes him from N direct PSP integrations down to one API surface he controls; Stripe stays as a rail underneath.',
      objection: '"What\'s the actual integration effort? How do I know your webhooks won\'t be flaky like Mercado Pago\'s?"',
      preempt: 'Book an engineer-to-engineer technical deep-dive early — sandbox access, API docs, webhook/retry architecture, uptime SLA — and let him pressure-test it before any commitment. Rappi reference with their engineering lead. Validate it against their own traffic first, then commit.',
    },
    {
      name: 'Laura Sánchez',
      title: 'CFO',
      role: 'Final Approver (>$500K)',
      gradient: 'from-pink-700 to-rose-900',
      accent: 'text-pink-400',
      borderColor: 'border-pink-500/25',
      pill: 'bg-pink-500/20 text-pink-300',
      context: 'Payments are her #2 cost line after COGS; came from Glossier so she knows beauty-subscription economics cold. Sharp negotiator who wants transparent, predictable pricing and hates long lock-ins.',
      valueProp: 'Under your 2.5% target, plus a bigger durable lever — recovered revenue — without a multi-year handcuff.',
      leads: [
        'Interchange++ at ~2.3–2.4% blended — beats <2.5% target and the current 2.89%',
        'Transparency she can audit: sees every cent, unlike Stripe\'s blended rate',
        '~$3M+ in processing savings; local acquiring compresses LATAM interchange further',
        'Reduce 1 of 2 payment FTEs (~$160K) via no-code + Payments Concierge',
        '~15% chargeback reduction (~$360K) — conservative vs Yuno\'s 29% fraud-cut claim',
        'Hard cost savings alone repay migration before the first quarterly close',
      ],
      protect: 'The migration isn\'t on her P&L or Kevin\'s headcount: Yuno funds the embedded SE. Migration cost is our cost, not hers.',
      objection: '"Even if pricing\'s slightly better, migration cost and risk aren\'t worth pulling eng off product for 3–4 months."',
      preempt: 'Show the payback math — repaid before the first quarterly close. Phased MX/BR pilot proves it before any scale spend. Reframe cost of inaction: renewing Stripe locks in 2.89% for another term while LATAM approval losses compound against 40% volume growth.',
    },
  ]

  const threads = [
    {
      who: 'Kevin (CTO)',
      action: 'Neutralize the veto before it forms',
      detail: 'Yuno SA runs an early technical session; bring the embedded-SE offer and the Rappi reference. Goal: convert the most dangerous skeptic into a quiet "this is fine."',
    },
    {
      who: 'Laura (CFO)',
      action: 'Peer-level commercial conversation',
      detail: 'Dedicated CFO session on unit economics with a one-page model; bring the Yuno exec sponsor for peer-to-peer air cover and to personally stand behind the approval-rate SLA.',
    },
    {
      who: 'Regional GMs (Mexico, Brazil, SEA)',
      action: 'Bottom-up pressure',
      detail: 'Ask Daniela to put the Mexico + Brazil GMs into the pilot as owners — they become internal advocates pushing HQ from below while we sell top-down.',
    },
    {
      who: 'References — sequenced by stakeholder',
      action: 'Matched credibility',
      detail: 'inDrive/Reserva → Daniela (LATAM approval). Rappi → Kevin (eng reliability). McDonald\'s LATAM/Arcos Dorados → Laura & Daniela (enterprise credibility).',
    },
  ]

  return (
    <SectionWrap id="stakeholders">
      <SectionHeader
        label="Section 2"
        title="Stakeholder Engagement Strategy"
        subtitle="Three buyers, three different fears, three different pitches."
      />

      <div className="grid md:grid-cols-3 gap-6 mb-14">
        {personas.map((p) => (
          <div
            key={p.name}
            className={`bg-[#1A1A2E] border ${p.borderColor} rounded-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className={`bg-gradient-to-br ${p.gradient} p-6`}>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 ${p.pill}`}>
                {p.role}
              </span>
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <p className="text-sm text-white/65">{p.title}</p>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5 flex-1">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${p.accent} mb-1.5`}>Context</p>
                <p className="text-gray-400 text-xs leading-relaxed">{p.context}</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${p.accent} mb-1.5`}>Value Proposition</p>
                <p className="text-gray-300 text-sm leading-relaxed">{p.valueProp}</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${p.accent} mb-1.5`}>Lead With</p>
                <ul className="space-y-1.5">
                  {p.leads.map((l, i) => (
                    <li key={i} className="text-gray-400 text-xs flex gap-2 leading-relaxed">
                      <span className="text-white/20 flex-shrink-0 mt-0.5">›</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`border ${p.borderColor} rounded-lg p-4 mt-auto bg-[#0F0F1A]/40`}>
                <p className={`text-xs font-semibold uppercase tracking-widest ${p.accent} mb-1.5`}>Top Objection &amp; Preempt</p>
                <p className="text-sm text-gray-200 italic mb-2">{p.objection}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{p.preempt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-threading plan */}
      <h3 className="text-xl font-bold text-white mb-5">Multi-Threading Plan</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {threads.map((t) => (
          <Card key={t.who}>
            <p className="text-sm font-bold text-indigo-400 mb-0.5">{t.who}</p>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{t.action}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{t.detail}</p>
          </Card>
        ))}
      </div>
    </SectionWrap>
  )
}

// ── ROI Calculator ────────────────────────────────────────────────────────────
function ROICalculator() {
  const [latamMult,   setLatamMult]   = useState(1.0)
  const [matureMult,  setMatureMult]  = useState(1.0)
  const [seaMult,     setSeaMult]     = useState(1.0)
  const [yunoRate,    setYunoRate]    = useState(0.0235)
  const [netMig,      setNetMig]      = useState(180000)

  const roi = computeROI({
    latamMult, matureMult, seaMult,
    yunoTakeRate: yunoRate,
    netMigration: netMig,
  })

  const isPreset = (v) => latamMult === v && matureMult === v && seaMult === v
  const setPreset = (v) => { setLatamMult(v); setMatureMult(v); setSeaMult(v) }

  const presets = [
    { label: 'Conservative (0.65×)', v: 0.65 },
    { label: 'Base (1.0×)',          v: 1.0  },
    { label: 'Aggressive (1.35×)',   v: 1.35 },
  ]

  function Slider({ label, value, min, max, step, onChange, display }) {
    return (
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs text-gray-400">{label}</label>
          <span className="text-xs font-semibold text-indigo-400">{display(value)}</span>
        </div>
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 rounded-full cursor-pointer"
        />
      </div>
    )
  }

  const outputs = [
    { label: 'Subscription Recovered',             sub: 'Steady-state, subscription base',       value: fmtM(roi.subscriptionRecovered)   },
    { label: 'Gross Recovered incl. Add-ons',      sub: 'Steady-state, ×1.4 add-on multiplier',  value: fmtM(roi.grossRecovered)           },
    { label: 'Year-1 Recovered Revenue',           sub: '65% ramp assumption',                    value: fmtM(roi.year1Recovered)           },
    { label: 'Year-1 Processing Savings',          sub: `${(yunoRate*100).toFixed(2)}% vs 2.89% on $588M`, value: fmtM(roi.year1ProcessingSavings) },
    { label: 'Year-1 Operational Savings',         sub: 'FTE reduction + chargeback savings',     value: fmtM(roi.year1OpsSavings)          },
    { label: 'Total Year-1 Impact',                sub: 'Recovered revenue + all savings',        value: fmtM(roi.totalYear1Impact), hero: true },
    { label: 'Payback',                            sub: 'Net migration cost ÷ monthly savings',   value: fmtMo(roi.paybackMonths),   hero: true },
  ]

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h3 className="text-2xl font-bold text-white">Live ROI Calculator</h3>
          <p className="text-gray-400 text-sm mt-1">
            At all 1.0× multipliers this reproduces the locked base case exactly.
          </p>
        </div>
        <div className="flex gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setPreset(p.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isPreset(p.v)
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <Card className="mb-8 mt-6">
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          <Slider
            label="LatAm Lift Multiplier"
            value={latamMult} min={0.5} max={1.5} step={0.05}
            onChange={setLatamMult}
            display={(v) => `${v.toFixed(2)}×`}
          />
          <Slider
            label="Mature Markets Lift Multiplier"
            value={matureMult} min={0.5} max={1.5} step={0.05}
            onChange={setMatureMult}
            display={(v) => `${v.toFixed(2)}×`}
          />
          <Slider
            label="SEA Lift Multiplier"
            value={seaMult} min={0.5} max={1.5} step={0.05}
            onChange={setSeaMult}
            display={(v) => `${v.toFixed(2)}×`}
          />
          <Slider
            label="Yuno Blended Take Rate"
            value={yunoRate} min={0.020} max={0.026} step={0.0001}
            onChange={setYunoRate}
            display={(v) => `${(v * 100).toFixed(2)}%`}
          />
          <div className="md:col-span-2">
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-gray-400">Net Migration Cost ($)</label>
              <span className="text-xs font-semibold text-indigo-400">${netMig.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={netMig}
              onChange={(e) => setNetMig(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#0F0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </Card>

      {/* Output cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {outputs.filter((o) => !o.hero).map((o) => (
          <div key={o.label} className="bg-[#1A1A2E] border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-extrabold text-indigo-400 mb-1">{o.value}</p>
            <p className="text-xs font-semibold text-white">{o.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{o.sub}</p>
          </div>
        ))}
        {outputs.filter((o) => o.hero).map((o) => (
          <div
            key={o.label}
            className="col-span-2 md:col-span-2 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/40 rounded-xl p-5 flex flex-col justify-center"
          >
            <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{o.value}</p>
            <p className="text-sm font-bold text-indigo-300">{o.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{o.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Commercial Proposal ───────────────────────────────────────────────────────
function CommercialProposal() {
  const tableRows = [
    { market: 'US',        captured: 180, current: '87%', target: '89%', delta: '+2',  recovered: '$4.14M',  lever: 'Tokens + routing',                           group: 'mature' },
    { market: 'Canada',    captured: 24,  current: '85%', target: '87%', delta: '+2',  recovered: '$0.56M',  lever: 'Tokens + routing',                           group: 'mature' },
    { market: 'UK',        captured: 42,  current: '84%', target: '87%', delta: '+3',  recovered: '$1.50M',  lever: 'Routing + tokens',                           group: 'mature' },
    { market: 'Germany',   captured: 28,  current: '83%', target: '86%', delta: '+3',  recovered: '$1.01M',  lever: 'Routing + tokens',                           group: 'mature' },
    { market: 'France',    captured: 18,  current: '82%', target: '85%', delta: '+3',  recovered: '$0.66M',  lever: 'Routing + tokens',                           group: 'mature' },
    { market: 'Spain',     captured: 14,  current: '81%', target: '84%', delta: '+3',  recovered: '$0.52M',  lever: 'Routing + tokens',                           group: 'mature' },
    { market: 'Mexico',    captured: 38,  current: '71%', target: '81%', delta: '+10', recovered: '$5.35M',  lever: 'Local acquiring + methods + tokens',         group: 'latam'  },
    { market: 'Brazil',    captured: 32,  current: '68%', target: '80%', delta: '+12', recovered: '$5.65M',  lever: 'Local acquiring (Reserva +4pp floor)',        group: 'latam'  },
    { market: 'Colombia',  captured: 12,  current: '74%', target: '82%', delta: '+8',  recovered: '$1.30M',  lever: 'Off cross-border Stripe → local',            group: 'latam'  },
    { market: 'Chile',     captured: 8,   current: '73%', target: '81%', delta: '+8',  recovered: '$0.88M',  lever: 'Off cross-border → local',                   group: 'latam'  },
    { market: 'Singapore', captured: 10,  current: '79%', target: '83%', delta: '+4',  recovered: '$0.51M',  lever: 'Local acquiring + methods',                  group: 'sea'    },
    { market: 'Thailand',  captured: 6,   current: '76%', target: '81%', delta: '+5',  recovered: '$0.39M',  lever: 'Local acquiring + methods',                  group: 'sea'    },
    { market: 'Indonesia', captured: 4,   current: '72%', target: '78%', delta: '+6',  recovered: '$0.33M',  lever: 'Local acquiring + methods',                  group: 'sea'    },
    { market: 'Malaysia',  captured: 4,   current: '77%', target: '81%', delta: '+4',  recovered: '$0.21M',  lever: 'Local acquiring + methods',                  group: 'sea'    },
  ]

  const pnlRows = [
    { label: 'Recovered revenue (gross)',   year1: '$20.9M', steady: '$32.2M', kpi: 'Daniela'     },
    { label: 'Recovered revenue (55% CM)',  year1: '$11.5M', steady: '$17.7M', kpi: 'Profit view' },
    { label: 'Processing savings',          year1: '$2.1M',  steady: '$3.2M',  kpi: 'Laura'       },
    { label: 'FTE + chargeback savings',    year1: '$0.3M',  steady: '$0.5M',  kpi: 'Laura'       },
    { label: 'Total value (gross + cost)',  year1: '$23.3M', steady: '$35.9M', kpi: '',  bold: true },
    { label: 'Total value (CM + cost)',     year1: '$13.9M', steady: '$21.4M', kpi: '',  bold: true },
  ]

  const scenarios = [
    { name: 'Conservative', lift: '65% of target', subs: '$15.0M', gross: '$20.9M', year1: '$13.6M', steady: '$24.6M' },
    { name: 'Base',         lift: '100%',           subs: '$23.0M', gross: '$32.2M', year1: '$20.9M', steady: '$35.9M', hi: true },
    { name: 'Aggressive',   lift: '135% (~+15pp)',  subs: '$31.0M', gross: '$43.5M', year1: '$28.3M', steady: '$47.2M' },
  ]

  const groupLabel = { mature: 'Mature', latam: 'LATAM', sea: 'SEA' }
  const groupDot   = { mature: 'bg-gray-500', latam: 'bg-indigo-500', sea: 'bg-violet-500' }

  return (
    <SectionWrap id="commercial" alt>
      <SectionHeader
        label="Section 3"
        title="Commercial Proposal & Financial Impact"
        subtitle="All figures proposed / illustrative on dossier data + cited benchmarks. $ in millions."
      />

      {/* Pricing summary */}
      <Card className="mb-10">
        <h3 className="text-lg font-semibold text-white mb-5">Pricing Recommendation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Model',              value: 'Interchange++',  sub: 'Transparent pass-through'    },
            { label: 'All-In Take Rate',   value: '~2.35%',         sub: 'vs current 2.89%'           },
            { label: 'CFO Target',         value: '<2.50%',         sub: 'Cleared by 15bp'            },
            { label: 'Yuno Markup Only',   value: '0.25–0.35%',     sub: 'Only Yuno-controlled line'  },
          ].map((i) => (
            <div key={i.label} className="bg-[#0F0F1A] rounded-lg p-4 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">{i.label}</p>
              <p className="text-xl font-bold text-indigo-400">{i.value}</p>
              <p className="text-xs text-gray-500">{i.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          <strong className="text-white">Performance element:</strong> Carve ~0.10–0.15% of the orchestration markup into an
          approval-rate SLA hold-back — Yuno only earns it if blended approval clears an agreed threshold (e.g., LATAM ≥79%)
          by month 6. Aligns our incentive with Daniela's KPI and converts "trust the startup" into "pay for results."
          Interchange++ passes the real interchange through transparently — Laura sees every cent, unlike Stripe's blended rate.
        </p>
      </Card>

      {/* Market table */}
      <div className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="text-xl font-bold text-white">
            Recovered Revenue — Market by Market
            <span className="text-sm font-normal text-gray-500 ml-2">(steady-state, gross)</span>
          </h3>
          <div className="flex gap-4 text-xs text-gray-400">
            {Object.entries(groupLabel).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${groupDot[k]}`} />
                {v}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1A1A2E] text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="text-left px-4 py-3">Market</th>
                <th className="text-right px-4 py-3">Captured $M</th>
                <th className="text-right px-4 py-3">Current</th>
                <th className="text-right px-4 py-3">Target</th>
                <th className="text-right px-4 py-3">Δpp</th>
                <th className="text-right px-4 py-3">Recovered $M</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Primary Lever</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr
                  key={r.market}
                  className={`border-t border-white/5 transition-colors hover:bg-white/[0.03] ${
                    r.group === 'latam' ? 'bg-indigo-500/[0.05]' : r.group === 'sea' ? 'bg-violet-500/[0.03]' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${groupDot[r.group]}`} />
                      <span className={`font-medium ${r.group === 'latam' ? 'text-indigo-300' : r.group === 'sea' ? 'text-violet-300' : 'text-white'}`}>
                        {r.market}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">{r.captured}</td>
                  <td className="px-4 py-3 text-right text-red-400">{r.current}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{r.target}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${r.group === 'latam' ? 'text-indigo-400' : 'text-gray-300'}`}>
                    {r.delta}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${r.group === 'latam' ? 'text-indigo-400' : 'text-gray-300'}`}>
                    {r.recovered}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{r.lever}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-indigo-500/40 bg-indigo-500/10">
                <td className="px-4 py-3 font-bold text-white" colSpan={5}>
                  Total Subscription ($420M)
                </td>
                <td className="px-4 py-3 text-right font-extrabold text-indigo-400">$23.0M</td>
                <td className="px-4 py-3 text-xs text-indigo-400 hidden lg:table-cell">
                  +$9.2M add-ons → $32.2M gross steady-state
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Callout color="indigo">
            <p className="font-semibold mb-1">Mexico + Brazil = $11.0M on $70M of volume</p>
            <p className="text-xs text-indigo-300/80">The biggest prize concentration in the table. That is the headline.</p>
          </Callout>
          <Callout color="violet">
            <p className="font-semibold mb-1">Conservative by design</p>
            <p className="text-xs text-violet-300/80">
              $23.0M is the exact gross-up on the base table — nothing rounded up. Built to survive Daniela's own spreadsheet.
              Brazil +12pp is the one assumption to validate in pilot (Reserva's +4pp in 3 months is the floor, not the ceiling).
            </p>
          </Callout>
        </div>
      </div>

      {/* P&L impact table */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-white mb-4">
          Year-1 vs Steady-State P&amp;L Impact
          <span className="text-sm font-normal text-gray-500 ml-2">(Year-1 = 65% of steady-state)</span>
        </h3>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1A1A2E] text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="text-left px-4 py-3">Line Item</th>
                <th className="text-right px-4 py-3">Year-1</th>
                <th className="text-right px-4 py-3">Steady-State</th>
                <th className="text-left px-4 py-3">Whose KPI</th>
              </tr>
            </thead>
            <tbody>
              {pnlRows.map((r) => (
                <tr
                  key={r.label}
                  className={`border-t border-white/5 ${r.bold ? 'bg-indigo-500/10' : ''}`}
                >
                  <td className={`px-4 py-3 ${r.bold ? 'font-bold text-white' : 'text-gray-300'}`}>{r.label}</td>
                  <td className={`px-4 py-3 text-right ${r.bold ? 'font-extrabold text-indigo-400' : 'text-gray-300'}`}>{r.year1}</td>
                  <td className={`px-4 py-3 text-right ${r.bold ? 'font-extrabold text-indigo-400' : 'text-gray-300'}`}>{r.steady}</td>
                  <td className="px-4 py-3 text-xs text-indigo-400">{r.kpi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost savings + Payback */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card>
          <h4 className="font-semibold text-white mb-4">Hard Cost Savings (steady-state)</h4>
          <div className="space-y-3">
            {[
              { label: '(2.89% − 2.35%) × $588M processing',      value: '$3.18M' },
              { label: 'Reduce 1 of 2 payment FTEs (no-code)',     value: '$0.16M' },
              { label: 'Chargeback −15% (conservative)',           value: '$0.36M' },
            ].map((i) => (
              <div key={i.label} className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-gray-400 text-sm">{i.label}</span>
                <span className="text-indigo-400 font-semibold text-sm">{i.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-white text-sm">Total steady cost savings/yr</span>
              <span className="font-extrabold text-indigo-400 text-lg">$3.70M</span>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="font-semibold text-white mb-4">Migration Cost &amp; Payback</h4>
          <div className="space-y-3">
            {[
              { label: 'Gross one-time migration (eng + QA + parallel-run)', value: '$250K',  color: 'text-gray-300' },
              { label: 'Less: Yuno-funded embedded SE (60 days)',            value: '−$70K',  color: 'text-emerald-400' },
            ].map((i) => (
              <div key={i.label} className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-gray-400 text-sm">{i.label}</span>
                <span className={`font-semibold text-sm ${i.color}`}>{i.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-white text-sm">Net migration cost</span>
              <span className="font-extrabold text-white text-lg">$180K</span>
            </div>
          </div>
          <Callout color="green" className="mt-4">
            <p className="text-sm font-semibold">Repaid before the first quarterly close.</p>
            <p className="text-xs mt-1 text-emerald-300/80">
              $0.18M net ÷ ~$0.92M/quarter of hard savings (&lt; 1 quarter) — before counting a dollar of recovered revenue.
              This is the direct answer to Laura's "migration isn't worth it" objection.
            </p>
          </Callout>
        </Card>
      </div>

      {/* Sensitivity scenarios */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Three-Scenario Sensitivity</h3>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1A1A2E] text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="text-left px-4 py-3">Scenario</th>
                <th className="text-right px-4 py-3">Lift Realized</th>
                <th className="text-right px-4 py-3">Subs $M</th>
                <th className="text-right px-4 py-3">Incl. Add-ons</th>
                <th className="text-right px-4 py-3">Year-1</th>
                <th className="text-right px-4 py-3">Total Steady</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr
                  key={s.name}
                  className={`border-t border-white/5 ${s.hi ? 'bg-indigo-500/10' : ''}`}
                >
                  <td className={`px-4 py-3 font-${s.hi ? 'bold text-indigo-400' : 'medium text-white'}`}>{s.name}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{s.lift}</td>
                  <td className={`px-4 py-3 text-right ${s.hi ? 'text-indigo-400 font-semibold' : 'text-gray-300'}`}>{s.subs}</td>
                  <td className={`px-4 py-3 text-right ${s.hi ? 'text-indigo-400 font-semibold' : 'text-gray-300'}`}>{s.gross}</td>
                  <td className={`px-4 py-3 text-right ${s.hi ? 'text-indigo-400 font-bold' : 'text-gray-300'}`}>{s.year1}</td>
                  <td className={`px-4 py-3 text-right ${s.hi ? 'text-indigo-400 font-bold' : 'text-gray-300'}`}>{s.steady}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          Even the conservative case clears the CFO's cost target and returns &gt;$24M of total value.
          The aggressive case maps Mexico and Brazil to roughly +15pp — still below the external benchmark of +14–21pp for MX local acquiring.
        </p>
      </div>

      {/* Contract structure */}
      <Card className="mb-4">
        <h4 className="font-semibold text-white mb-4">Contract Structure</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'ACV',              detail: '~$1.4–2.0M/yr (the ~0.25–0.35% markup on $588M), scaling with VelvetBox\'s 40% growth' },
            { label: 'Term',             detail: '24 months, ramped commitment (no punitive lock-in — Laura hates them), with a 90-day pilot exit on Mexico + Brazil' },
            { label: 'Performance',      detail: '~0.10–0.15% SLA hold-back released on hitting agreed approval thresholds by month 6' },
            { label: 'Payment Terms',    detail: 'Monthly, interchange++ pass-through itemized — full transparency, every line' },
          ].map((i) => (
            <div key={i.label} className="bg-[#0F0F1A] rounded-lg p-4 border border-white/5">
              <p className="text-xs text-indigo-400 font-semibold mb-1">{i.label}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{i.detail}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ROI Calculator */}
      <ROICalculator />
    </SectionWrap>
  )
}

// ── Objection Handling ────────────────────────────────────────────────────────
function ObjectionHandling() {
  const objections = [
    {
      persona: 'Kevin (CTO)',
      color: 'violet',
      objection: '"That\'s three vendors instead of two. You\'re adding complexity, not reducing it."',
      response: `Kevin, that's exactly the wrong outcome, and it's the one I'd push back on too if I thought Yuno were a fourth box to maintain. Yuno isn't another PSP stacked on top of Stripe and Mercado Pago — it's the orchestration layer that lets you collapse the integration sprawl you already own. Today your team maintains a direct Stripe integration, a direct Mercado Pago integration, and homegrown retry logic that you've called "dumb"; every new regional method request becomes another bespoke project. With Yuno you integrate once against a single no-code API, then keep Stripe where it genuinely wins (US Amex rates) and add local acquirers in Brazil and Mexico as routing config, not as new code. Rappi did exactly this: provider integration time went to zero and analyst workload dropped 80%. The complexity you're worried about adding is precisely the complexity Yuno removes — the next OXXO, PIX, or GrabPay request from your GMs becomes a toggle, not a six-month roadmap hit.`,
    },
    {
      persona: 'Laura (CFO)',
      color: 'pink',
      objection: '"Even if pricing is slightly better, migration cost and risk aren\'t worth it. We\'d pull engineering from product for 3–4 months."',
      response: `Laura, the engineering-drain concern is the right one to lead with, so let me take it head-on: Yuno funds an embedded solutions engineer for 60 days, so this migration doesn't come out of Kevin's product roadmap — that's our cost, not yours. And the ROI isn't a thin pricing delta. Fee savings are real (blended ~2.3–2.4% vs your current 2.89% is $3M+, plus ~$160K from reducing one of two payment FTEs and ~$360K from lower chargebacks), but those are the small number. The headline is recovered revenue: lifting approval across the book — Brazil 68→80, Mexico 71→81, and twelve other markets — drives ~$32M in recovered gross revenue at steady state (~$23M from subscriptions, the balance from add-ons), with Mexico and Brazil alone worth ~$11M — an order of magnitude above the migration cost, which the hard cost savings alone repay before your first quarterly close. We phase it: start with your highest-pain, highest-upside markets on a parallel run, so there's no big-bang cutover risk. And we'll tie a slice of our fee to an approval-rate SLA — if we don't move the number, you don't pay the full rate.`,
    },
    {
      persona: 'Daniela (Head of Payments)',
      color: 'indigo',
      objection: '"Adyen offers local acquiring in 25 markets, tokenization, processes trillions. You\'re a Series B startup. Why bet my credibility on Yuno?"',
      response: `Daniela, you're nine months in and you need a win that holds up — so let's be clear-eyed about which option actually carries the career risk. Adyen's "safe" pitch comes with a 4–6 month integration — that's Kevin's Mercado Pago nightmare all over again, and it blows straight through your 90-day Stripe window, which is the one deadline you can't miss. Their scale is the liability here, not the asset: enterprise overkill and the opaque pricing you've already flagged, sold to a high-growth subscription company that needs speed and partnership, not a vendor that treats $588M as a rounding error. Yuno does the same things that matter to you — local acquiring and network tokenization — but our proof is in your exact problem: inDrive (90% approval, 10 LATAM countries in under 8 months), McDonald's LATAM (21 countries unified), Rappi, and Reserva in Brazil (+4pp approval in under 3 months). Those LATAM logos are more relevant to a head of payments fighting a 68% Brazil rate than "processes trillions" ever will be. And on the "startup risk" worry — ISO 27001, ISO 27701, PCI DSS, and SOC 2 Type 2 are the same bar Adyen clears. You're not betting your credibility on a gamble; you're betting it on the faster, better-fit path to the number you're measured on.`,
    },
    {
      persona: 'Kevin (CTO)',
      color: 'amber',
      objection: '"What\'s the actual integration effort? And how do I know your API won\'t have the same flaky webhook issues we had with Mercado Pago?"',
      response: `Kevin, the Mercado Pago experience — six months, poor docs, breaking API changes, webhooks you couldn't trust — is exactly the bar I want to be measured against, because Yuno is built to be its opposite. The effort is a single no-code API: one integration that fronts every provider, versus the per-provider rebuilds you've been doing. Concretely, we put a Yuno-funded embedded SE on your team for 60 days so your engineers aren't reverse-engineering our docs alone, and our certifications (PCI DSS, SOC 2 Type 2, ISO 27001/27701) reflect the operational discipline behind the platform. On reliability: Rappi cut disruption-response time from minutes to milliseconds on Yuno and reduced analyst load 80%, and we'll prove webhook delivery to you in a sandbox parallel run before any cutover, plus a direct reference call with Rappi's or another customer's engineering lead. You don't have to take the API on faith — validate it against your own traffic first, then commit.`,
    },
  ]

  const colors = {
    violet: { border: 'border-violet-500/25', badge: 'bg-violet-500/20 text-violet-300', quote: 'text-violet-300' },
    pink:   { border: 'border-pink-500/25',   badge: 'bg-pink-500/20 text-pink-300',     quote: 'text-pink-300'   },
    indigo: { border: 'border-indigo-500/25', badge: 'bg-indigo-500/20 text-indigo-300', quote: 'text-indigo-300' },
    amber:  { border: 'border-amber-500/25',  badge: 'bg-amber-500/20 text-amber-300',   quote: 'text-amber-300'  },
  }

  return (
    <SectionWrap id="objections">
      <SectionHeader
        label="Section 4"
        title="Objection Handling"
        subtitle="Scripted responses for the four objections most likely to surface — ready to use verbatim or adapt in the moment."
      />

      <div className="space-y-6">
        {objections.map((o, i) => {
          const c = colors[o.color]
          return (
            <div key={i} className={`bg-[#1A1A2E] border ${c.border} rounded-2xl overflow-hidden`}>
              <div className="px-6 pt-6 pb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${c.badge}`}>
                  {o.persona}
                </span>
                <p className={`text-base font-semibold italic mb-5 leading-snug ${c.quote}`}>{o.objection}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{o.response}</p>
              </div>
            </div>
          )
        })}
      </div>
    </SectionWrap>
  )
}

// ── 90-Day Deal Plan ──────────────────────────────────────────────────────────
function DealPlan() {
  const phases = [
    {
      phase: '0',
      weeks: 'Week 1',
      title: 'Land the Artifact, Confirm the Brief',
      color: 'bg-indigo-600',
      ring:  'ring-indigo-600/40',
      items: [
        'Deliver this proposal package by EOW — the "something concrete" Daniela asked for.',
        'Next call with Daniela: confirm $420M/$588M scope; request 3 months of Stripe + MP statements (NDA); confirm decision process, signers, exact renewal date; ask Adyen\'s live terms.',
        'Secure intros to Kevin (technical) and Laura (commercial).',
        'Exit gate: assumptions validated, multi-thread intros booked.',
      ],
    },
    {
      phase: '1',
      weeks: 'Weeks 2–3',
      title: 'Multi-Thread & Technical Validation',
      color: 'bg-violet-600',
      ring:  'ring-violet-600/40',
      items: [
        'Kevin deep-dive: sandbox, API docs, webhook/uptime SLA, integration scope, embedded-SE offer; Rappi reference. Defuse the MP scar.',
        'Laura session: ROI model walkthrough, interchange++ transparency, payback math, no-lock-in terms; exec sponsor joins for peer-level air cover.',
        'Reference calls for Daniela (inDrive / Reserva).',
        'Refine the ROI model with real rate data from Phase 0.',
        'Exit gate: no Kevin veto; Laura bought into economics; Daniela has internal air cover.',
      ],
    },
    {
      phase: '2',
      weeks: 'Weeks 4–6',
      title: 'Pilot Design & Commercial Alignment',
      color: 'bg-purple-600',
      ring:  'ring-purple-600/40',
      items: [
        'Scope the pilot: Mexico + Brazil (~$70M combined — two worst approval rates, fastest and most defensible proof; Reserva\'s +4pp/3mo is the floor).',
        'Define success metrics: approval-rate targets (MX 71→81, BR 68→80 base case), recovered revenue, integration effort, webhook reliability.',
        'Lock the approval-rate SLA + performance pricing; sign the pilot order form.',
        'Engage the Yuno-funded embedded SE (60 days).',
        'Exit gate: signed pilot, kickoff scheduled.',
      ],
    },
    {
      phase: '3',
      weeks: 'Weeks 7–10',
      title: 'Pilot Execution — Mexico + Brazil',
      color: 'bg-fuchsia-600',
      ring:  'ring-fuchsia-600/40',
      items: [
        'Integrate via the single API; migrate MX/BR on a parallel run alongside Mercado Pago — no big-bang cutover (de-risks Kevin and Daniela simultaneously).',
        'Turn on smart routing + fallback, enroll network tokens for card-on-file, deploy NOVA for failed-renewal recovery.',
        'Weekly readouts to Daniela — her ammunition for internal updates.',
        'Exit gate: live approval-rate lift data in MX/BR, inside the renewal window.',
      ],
    },
    {
      phase: '4',
      weeks: 'Weeks 11–13',
      title: 'Prove, Expand, Close',
      color: 'bg-rose-600',
      ring:  'ring-rose-600/40',
      items: [
        'Present pilot results vs. baseline: approval lift, recovered revenue, cost delta, actual integration effort.',
        'Convert to MSA: phased global rollout (LATAM → SEA → mature markets), full ACV, ramp-based term, approval-rate SLA.',
        'Time the signature to land before the Stripe renewal decision.',
        'Exit gate: CLOSED — production traffic in the two worst markets and a signature.',
      ],
    },
  ]

  const resources = [
    { item: 'Embedded SE (Yuno-funded, 60 days)',                 why: 'Neutralizes Kevin\'s veto + Laura\'s migration cost objection simultaneously' },
    { item: 'Exec Sponsor (Yuno VP Sales / C-level)',             why: 'Peer to Laura; provides assurance for Daniela' },
    { item: 'Solutions Architect',                                why: 'Kevin\'s technical deep-dive session' },
    { item: 'References: inDrive · Reserva · McDonald\'s LATAM · Rappi', why: 'Sequenced by stakeholder — matched to each buyer\'s fear' },
    { item: 'Pilot scope: Mexico + Brazil',                       why: 'Fastest proof — two worst approval rates, Reserva +4pp floor' },
  ]

  const competitive = [
    { move: 'Win on speed',                      detail: 'Adyen needs 4–6 months; we can have MX/BR live inside 90 days. Proof beats promise.' },
    { move: "Weaponize Kevin's contradiction",   detail: 'Side-by-side integration scope: one no-code Yuno API vs. a multi-month enterprise build that is his Mercado Pago nightmare at scale.' },
    { move: "Exploit 'overkill + opaque'",       detail: "Right-sized orchestration with transparent interchange++ vs. enterprise bloat and pricing Laura can't audit." },
    { move: 'Out-structure on terms',            detail: "Put our fee at risk on an approval-rate SLA — Adyen won't." },
    { move: "Don't make them leave Stripe",      detail: 'Orchestration keeps Stripe as a rail; Adyen is rip-and-replace. Lower risk wins a risk-averse buyer.' },
  ]

  const risks = [
    { risk: 'Migration risk',           mitigation: 'Pilot-first, parallel run, Yuno-funded SE, no big-bang cutover.' },
    { risk: 'Kevin veto',               mitigation: 'Early eng-to-eng engagement + SLAs in writing + Rappi reference.' },
    { risk: 'Laura price / lock-in',    mitigation: 'Repaid before first quarterly close, no long lock-in, performance pricing.' },
    { risk: 'Daniela career risk',      mitigation: 'Pilot de-risk, SLA, exec air cover, references.' },
    { risk: 'Timeline / auto-renew',    mitigation: 'Confirm exact renewal date week 1; if tight, negotiate a short Stripe extension or run Yuno in parallel.' },
    { risk: 'Adyen rate war',           mitigation: 'Compete on total value + performance terms, never on headline rate alone.' },
  ]

  return (
    <SectionWrap id="plan" alt>
      <SectionHeader
        label="Section 5"
        title="90-Day Deal Plan"
        subtitle="Objective: signed orchestration contract and a live Mexico + Brazil pilot before the Stripe renewal forces VelvetBox's hand. Confirm the exact renewal date in week 1."
      />

      {/* Timeline */}
      <div className="relative mb-16">
        {/* Connector line */}
        <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-indigo-600 via-purple-600 to-rose-600 opacity-30 hidden md:block" />

        <div className="space-y-5">
          {phases.map((p) => (
            <div key={p.phase} className="relative md:pl-16">
              {/* Phase dot */}
              <div
                className={`absolute left-0 top-4 w-10 h-10 rounded-full ${p.color} ring-4 ${p.ring} hidden md:flex items-center justify-center flex-shrink-0 z-10`}
              >
                <span className="text-white text-sm font-extrabold">{p.phase}</span>
              </div>

              <Card>
                <div className="flex flex-wrap items-start gap-3 mb-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold text-white ${p.color}`}>
                    Phase {p.phase}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">{p.weeks}</span>
                  <h4 className="font-bold text-white w-full">{p.title}</h4>
                </div>
                <ul className="space-y-2">
                  {p.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <span className="text-indigo-500 flex-shrink-0 mt-0.5">›</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Resources */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Resources Needed</h3>
          <div className="space-y-3">
            {resources.map((r) => (
              <div key={r.item} className="bg-[#1A1A2E] border border-white/10 rounded-xl p-4">
                <p className="text-sm font-semibold text-indigo-400">{r.item}</p>
                <p className="text-xs text-gray-500 mt-1">{r.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive moves */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Competitive Moves vs Adyen</h3>
          <div className="space-y-3">
            {competitive.map((c) => (
              <div key={c.move} className="bg-[#1A1A2E] border border-white/10 rounded-xl p-4">
                <p className="text-sm font-semibold text-white">{c.move}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk mitigations */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4">Risk Mitigations</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {risks.map((r) => (
            <div key={r.risk} className="bg-[#1A1A2E] border border-white/10 rounded-xl p-4 flex gap-3">
              <span className="text-amber-400 flex-shrink-0 mt-0.5">⚠</span>
              <div>
                <p className="text-sm font-semibold text-white">{r.risk}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{r.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Definition of closed */}
      <Callout color="indigo">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Definition of Closed</p>
        <p className="text-gray-200 text-sm leading-relaxed">
          A signed orchestration contract (MSA + order form) landed before the Stripe renewal decision, plus{' '}
          <strong className="text-white">Mexico + Brazil live in production</strong> showing measured approval-rate lift,
          with a committed phased global rollout.{' '}
          <strong className="text-indigo-300">Not a POC, not a verbal</strong> — production traffic in the two worst markets
          and a signature.
        </p>
      </Callout>
    </SectionWrap>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-[#0F0F1A] text-[#F9FAFB] font-sans">
      <Nav />
      <Hero />
      <DealQualification />
      <StakeholderEngagement />
      <CommercialProposal />
      <ObjectionHandling />
      <DealPlan />
      <footer className="border-t border-white/10 py-10 text-center">
        <p className="text-xs text-gray-600">
          Yuno × VelvetBox — Confidential Deal Proposal · Prepared by Yuno Sales
        </p>
        <p className="text-xs text-gray-700 mt-1">
          All figures illustrative on dossier data. Not for distribution.
        </p>
      </footer>
    </div>
  )
}
