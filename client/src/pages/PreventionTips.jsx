const SYMPTOMS = [
  { icon: '🤒', title: 'High fever', desc: 'Sudden onset, 39–40 °C, lasting 2–7 days' },
  { icon: '😣', title: 'Severe headache', desc: 'Especially behind the eyes' },
  { icon: '💢', title: 'Muscle & joint pain', desc: 'Often called "breakbone fever"' },
  { icon: '🤢', title: 'Nausea & vomiting', desc: 'Common in the first few days' },
  { icon: '🔴', title: 'Skin rash', desc: 'Appears 2–5 days after fever onset' },
  { icon: '😫', title: 'Fatigue', desc: 'Extreme tiredness that may last weeks' },
];

const PREVENTION = [
  'Use mosquito repellent (DEET, picaridin, or IR3535)',
  'Wear long-sleeved shirts and long trousers',
  'Sleep under a mosquito net, especially during the day',
  'Eliminate standing water — empty flower pots, buckets, and tyres weekly',
  'Keep water tanks and cisterns tightly covered',
  'Ensure window and door screens are intact',
  'Use air conditioning where available',
  'Report stagnant water or mosquito breeding sites to local authorities',
];

const WARNING_SIGNS = [
  'Severe abdominal pain or persistent vomiting',
  'Bleeding gums or nose',
  'Blood in urine, stools, or vomit',
  'Rapid or difficult breathing',
  'Fatigue, restlessness, or irritability',
  'Cold, clammy skin or pale appearance',
];

const CONTACTS = [
  { label: 'National Dengue Control Unit (Sri Lanka)', value: '011-2-695 112', href: 'tel:0112695112' },
  { label: 'Ministry of Health Hotline', value: '1999', href: 'tel:1999' },
  { label: 'Epidemiology Unit', value: 'www.epid.gov.lk', href: 'https://www.epid.gov.lk' },
];

function Section({ id, title, emoji, children }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <h2 id={id} className="mb-5 flex items-center gap-3 text-xl font-bold text-slate-800">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl" aria-hidden="true">
          {emoji}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PreventionTips() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">

      {/* Hero */}
      <header className="mb-12 text-center">
        <span className="mb-4 inline-block text-5xl" aria-hidden="true">🦟</span>
        <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
          Dengue Prevention &amp; Awareness
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
          Dengue fever is a mosquito-borne illness spread by the <em>Aedes aegypti</em> mosquito.
          Understanding the symptoms and taking simple precautions can protect you and your family.
        </p>
      </header>

      <div className="flex flex-col gap-12">

        {/* Symptoms */}
        <Section id="symptoms-heading" title="Common Symptoms" emoji="🩺">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SYMPTOMS.map((s) => (
              <div
                key={s.title}
                className="animate-fade-in-up flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 text-2xl" aria-hidden="true">{s.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800">{s.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Symptoms typically begin 4–10 days after a mosquito bite and last 2–7 days.
          </p>
        </Section>

        {/* Prevention */}
        <Section id="prevention-heading" title="How to Prevent Dengue" emoji="🛡️">
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-sm">
            {PREVENTION.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 px-5 py-3.5 text-sm text-slate-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </Section>

        {/* Warning signs */}
        <Section id="warning-heading" title="When to Seek Medical Help" emoji="⚠️">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="mb-3 text-sm font-semibold text-amber-800">
              Go to a hospital or clinic immediately if you notice any of these warning signs:
            </p>
            <ul className="flex flex-col gap-2">
              {WARNING_SIGNS.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                  <span className="mt-0.5 text-amber-500" aria-hidden="true">•</span>
                  {w}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-amber-700">
              Early medical care can prevent dengue from progressing to severe dengue (dengue haemorrhagic fever).
            </p>
          </div>
        </Section>

        {/* Contacts */}
        <Section id="contacts-heading" title="Emergency Contacts" emoji="📞">
          <ul className="flex flex-col gap-3">
            {CONTACTS.map(({ label, value, href }) => (
              <li
                key={label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">{label}</p>
                </div>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  {value}
                </a>
              </li>
            ))}
          </ul>
        </Section>

      </div>
    </div>
  );
}
