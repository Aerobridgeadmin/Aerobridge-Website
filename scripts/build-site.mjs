import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const SITE = {
  brand: 'Aerobridge',
  origin: 'https://aerobridge.cl',
  dashboard: 'https://dashboard.aerobridge.cl',
  login: 'https://dashboard.aerobridge.cl/login',
  signup: 'https://dashboard.aerobridge.cl/signup',
  email: 'admin@aerobridge.cl',
  phoneDisplay: '+56 9 7398 0874',
  phoneHref: '+56973980874',
  whatsappNumber: '56973980874',
  year: 2026,
  assetVersion: '20260712',
}

const PROGRAMS = [
  {
    code: 'AB-LPR-EN',
    status: 'Available',
    statusClass: '',
    title: 'ICAO Aviation English',
    description: 'Build speaking and listening skills across pronunciation, structure, vocabulary, fluency, comprehension and interaction. The program includes six modules and 30 published lessons.',
    basis: 'ICAO Annex 1 language proficiency requirements',
    access: 'Learner platform',
  },
  {
    code: 'AB-PEL-PILOT',
    status: 'Available in beta',
    statusClass: 'status-beta',
    title: 'Pilot Licence Theory',
    description: 'Study rules of the air, aircraft knowledge, performance, navigation and operations. The program is in beta, with more lessons on the way.',
    basis: 'ICAO Annexes 1 and 2 with country references',
    access: 'Learner platform',
  },
]

const PLANNED_PROGRAMS = [
  'Air Traffic Controller Knowledge',
  'Maintenance Personnel Licensing',
  'Flight Dispatch Knowledge',
  'Cabin Crew Safety',
  'UAS and RPAS Operations',
]

const CHILE = {
  authority: 'Dirección General de Aeronáutica Civil',
  acronym: 'DGAC',
  verified: '11 July 2026',
  pathways: ['PPL', 'IR', 'CPL', 'ME', 'ATPL', 'Flight Instructor'],
  references: [
    ['DAN 61', 'Pilot licences and ratings, tracked by edition and amendment.'],
    ['DAN 67', 'Aeronautical medical certification requirements.'],
    ['Exam bank', 'DGAC subject documents, bibliographies and support material.'],
    ['Evaluation sheets', 'Flight examination and practical evaluation references.'],
    ['Licence guide', 'DGAC guidance for licences and ratings.'],
  ],
}

const NAVIGATION = [
  ['/services', 'Programs'],
  ['/exam-preparation', 'Chile and exams'],
  ['/get-started', 'How it works'],
  ['/about', 'About'],
  ['/faq', 'FAQ'],
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function analytics() {
  return `
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18028243819"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-18028243819');
  </script>`
}

function header(currentPath) {
  const navLinks = NAVIGATION.map(([href, label]) => {
    const current = href === currentPath ? ' aria-current="page"' : ''
    return `<a href="${href}"${current}>${label}</a>`
  }).join('\n        ')

  return `
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="site-signal">
    <div class="container signal-inner">
      <span class="signal-status">Available now</span>
      <span>Aviation English worldwide. Pilot Theory in beta. DGAC guidance for Chile.</span>
    </div>
  </div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="Aerobridge home">
        <img src="/assets/images/aerobridge-logo.png" alt="" width="46" height="46">
        <span class="brand-text"><strong>AEROBRIDGE</strong><small>Aviation training</small></span>
      </a>
      <nav class="site-nav" aria-label="Main navigation" data-site-nav data-open="false">
        ${navLinks}
        <a class="mobile-only" href="${SITE.login}">Learner sign in</a>
        <a class="mobile-only button button-accent" href="/free-consultation">Talk to us</a>
      </nav>
      <div class="header-actions">
        <a class="sign-in" href="${SITE.login}">Sign in</a>
        <a class="button button-accent" href="/free-consultation">Talk to us</a>
      </div>
      <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-button><span></span></button>
    </div>
  </header>`
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/" aria-label="Aerobridge home">
            <img src="/assets/images/aerobridge-logo-dark.png" alt="" width="46" height="46">
            <span class="brand-text"><strong>AEROBRIDGE</strong><small>Aviation training</small></span>
          </a>
          <p>Online aviation study for pilots and aviation professionals, with DGAC guidance for learners in Chile.</p>
        </div>
        <div class="footer-column">
          <h2>Training</h2>
          <a href="/services">Programs</a>
          <a href="/exam-preparation">Chile and exams</a>
          <a href="/get-started">How it works</a>
          <a href="${SITE.dashboard}">Open platform</a>
        </div>
        <div class="footer-column">
          <h2>Company</h2>
          <a href="/about">About</a>
          <a href="/history">Product history</a>
          <a href="/pricing">Access and pricing</a>
          <a href="/faq">FAQ</a>
        </div>
        <div class="footer-column">
          <h2>Contact</h2>
          <a href="/contact">Contact Aerobridge</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="https://wa.me/${SITE.whatsappNumber}" target="_blank" rel="noopener noreferrer">${SITE.phoneDisplay}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${SITE.year} Aerobridge.</p>
        <p>Aerobridge supports study and practice. Licences and official language ratings are issued by the relevant authority or approved provider.</p>
      </div>
    </div>
  </footer>`
}

function page({ path, title, description, body }) {
  const canonical = path === '/' ? SITE.origin + '/' : SITE.origin + path
  const fullTitle = path === '/' ? title : `${title} · ${SITE.brand}`
  const publicConfig = JSON.stringify({
    email: SITE.email,
    whatsappNumber: SITE.whatsappNumber,
  })

  return `<!doctype html>
<html lang="en">
<head>
  <!-- Generated by scripts/build-site.mjs. Edit the generator, not this file. -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#062354">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${SITE.origin}/assets/images/img-903.jpeg">
  <link rel="icon" href="/assets/images/aerobridge-logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css?v=${SITE.assetVersion}">
  <title>${escapeHtml(fullTitle)}</title>${analytics()}
  <script>window.AEROBRIDGE=${publicConfig}</script>
  <script defer src="/assets/site.js?v=${SITE.assetVersion}"></script>
</head>
<body>
${header(path)}
<main id="main-content">
${body.trim()}
</main>
${footer()}
</body>
</html>
`
}

function buttonRow({ primaryHref, primaryLabel, secondaryHref, secondaryLabel, accent = false }) {
  return `<div class="button-row">
    <a class="button ${accent ? 'button-accent' : 'button-primary'}" href="${primaryHref}">${primaryLabel}</a>
    ${secondaryHref ? `<a class="button button-outline" href="${secondaryHref}">${secondaryLabel}</a>` : ''}
  </div>`
}

function pageHero({ eyebrow, title, lede }) {
  return `<section class="page-hero">
    <div class="container">
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      <p class="lede">${lede}</p>
    </div>
  </section>`
}

// Original Aerobridge route-chart artwork: Santiago as the departure point,
// international routes outbound. Drawn in brand colours; no stock imagery.
function routeChart() {
  return `<svg viewBox="0 0 800 550" role="img" aria-label="Aeronautical route chart with departures from Santiago to international destinations" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="550" fill="#062354"/>
    <g stroke="rgba(135,206,235,0.10)" stroke-width="1">
      <path d="M0 110 H800 M0 220 H800 M0 330 H800 M0 440 H800"/>
      <path d="M133 0 V550 M266 0 V550 M400 0 V550 M533 0 V550 M666 0 V550"/>
    </g>
    <g stroke="rgba(135,206,235,0.35)" stroke-width="2">
      <path d="M133 0 v8 M266 0 v8 M400 0 v8 M533 0 v8 M666 0 v8"/>
      <path d="M0 110 h8 M0 220 h8 M0 330 h8 M0 440 h8"/>
    </g>
    <path d="M-20 470 Q140 430 220 470 T520 500 T820 480" fill="none" stroke="rgba(135,206,235,0.14)" stroke-width="1.5"/>
    <path d="M-20 505 Q180 470 320 505 T680 520 T820 512" fill="none" stroke="rgba(135,206,235,0.09)" stroke-width="1.5"/>
    <g class="route-flow" fill="none" stroke="#87CEEB" stroke-width="2" stroke-dasharray="7 9" stroke-linecap="round">
      <path d="M170 445 Q300 300 620 120"/>
      <path d="M170 445 Q330 380 640 330" opacity="0.65"/>
      <path d="M170 445 Q220 260 300 95" opacity="0.5"/>
    </g>
    <g fill="#D64541">
      <circle cx="170" cy="445" r="7"/>
      <circle cx="170" cy="445" r="13" fill="none" stroke="#D64541" stroke-width="1.5" opacity="0.5"/>
    </g>
    <g fill="#87CEEB">
      <path d="M620 120 l7 12 h-14 z"/>
      <path d="M640 330 l7 12 h-14 z"/>
      <path d="M300 95 l7 12 h-14 z"/>
    </g>
    <g font-family="Montserrat, sans-serif" font-size="15" font-weight="700" letter-spacing="2">
      <text x="192" y="452" fill="#FFFFFF">SCEL</text>
      <text x="192" y="472" fill="rgba(135,206,235,0.75)" font-size="11" font-weight="600">SANTIAGO · DEP</text>
      <text x="600" y="108" fill="rgba(255,255,255,0.9)">EGLL</text>
      <text x="620" y="362" fill="rgba(255,255,255,0.9)">SAEZ</text>
      <text x="280" y="83" fill="rgba(255,255,255,0.9)">KDEN</text>
    </g>
    <g transform="translate(724 64)" stroke="rgba(135,206,235,0.6)" fill="none" stroke-width="1.5">
      <circle r="22"/>
      <path d="M0 -22 V-30 M0 22 V30 M-22 0 H-30 M22 0 H30"/>
      <path d="M0 -13 L5 6 L0 2 L-5 6 Z" fill="#87CEEB" stroke="none"/>
    </g>
    <text x="726" y="106" fill="rgba(135,206,235,0.7)" font-family="Montserrat, sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="2">N</text>
    <g font-family="Montserrat, sans-serif" font-size="11" font-weight="600" letter-spacing="1.5" fill="rgba(135,206,235,0.55)">
      <text x="40" y="512">AB-RTE-001 · INTERNATIONAL PATHWAYS</text>
      <text x="40" y="530">TRAINING BASE SCEL · ICAO FRAMEWORK</text>
    </g>
  </svg>`
}

function programRows() {
  return `<div class="program-list">
    ${PROGRAMS.map((program) => `<article class="program-row">
      <div class="program-code">${program.code}</div>
      <div>
        <span class="status${program.statusClass ? ` ${program.statusClass}` : ''}">${program.status}</span>
        <h3>${program.title}</h3>
        <p>${program.description}</p>
      </div>
      <div class="program-meta">
        <span>${program.basis}</span>
        <span>${program.access}</span>
      </div>
    </article>`).join('\n')}
  </div>`
}

function regulatoryRows() {
  return `<div class="regulatory-list">
    ${CHILE.references.map(([code, text]) => `<div class="regulatory-row"><strong>${code}</strong><p>${text}</p></div>`).join('\n')}
  </div>`
}

function ctaBand({ title, text, href = '/free-consultation', label = 'Request a consultation' }) {
  return `<section class="cta-band">
    <div class="container cta-grid">
      <div><h2>${title}</h2><p>${text}</p></div>
      <a class="button button-light" href="${href}">${label}</a>
    </div>
  </section>`
}

function consultationForm(title = 'Request a 15-minute consultation') {
  return `<form class="request-form" data-consultation-form>
    <h2>${title}</h2>
    <p class="form-intro">Tell us what you need. We will open a WhatsApp message for you to review and send.</p>
    <div class="field-grid">
      <div class="field">
        <label for="request-name">Name</label>
        <input id="request-name" name="name" autocomplete="name" required>
      </div>
      <div class="field">
        <label for="request-email">Email</label>
        <input id="request-email" name="email" type="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="request-country">Country</label>
        <input id="request-country" name="country" autocomplete="country-name" placeholder="Chile" required>
      </div>
      <div class="field">
        <label for="request-interest">What do you need?</label>
        <select id="request-interest" name="interest" required>
          <option value="">Choose one</option>
          <option>ICAO Aviation English</option>
          <option>Pilot Licence Theory</option>
          <option>Chile DGAC requirements</option>
          <option>School or organisation access</option>
          <option>Another country or program</option>
        </select>
      </div>
      <div class="field full">
        <label for="request-goal">Current goal</label>
        <input id="request-goal" name="goal" placeholder="For example: PPL in Chile or ICAO Level 4" required>
      </div>
      <div class="field full">
        <label for="request-message">Anything we should know? <span aria-hidden="true">(optional)</span></label>
        <textarea id="request-message" name="message" placeholder="Your current stage, timeline, or authority"></textarea>
      </div>
    </div>
    <button class="button button-accent" type="submit">Continue in WhatsApp</button>
    <p class="form-note">We will reply on WhatsApp to arrange a time.</p>
    <p class="form-status" aria-live="polite" data-form-status></p>
  </form>`
}

const pages = [
  {
    filename: 'index.html',
    path: '/',
    title: 'Aerobridge · ICAO Aviation English and Pilot Theory',
    description: 'ICAO-aligned aviation training with a Chile DGAC country pack. Study Aviation English or Pilot Licence Theory in the Aerobridge learner platform.',
    body: `
      <section class="home-hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="eyebrow">Aviation English and pilot theory</span>
            <h1>Study aviation with the <span class="accent">right rules in view.</span></h1>
            <p class="lede">Build operational English and pilot knowledge through online lessons based on recognised aviation frameworks. Learners in Chile can also access DGAC licensing and exam references.</p>
            ${buttonRow({ primaryHref: '/services', primaryLabel: 'Explore current programs', secondaryHref: SITE.dashboard, secondaryLabel: 'Open learner platform' })}
            <div class="hero-proof"><span>30 Aviation English lessons</span><span>Pilot Theory in beta</span><span>Chile DGAC references</span></div>
          </div>
          <figure class="hero-visual">
            <img src="/assets/images/img-903.jpeg" alt="Pilot training in the cockpit of a light aircraft" width="1920" height="1440">
            <figcaption class="hero-caption">Aerobridge turns regulation, theory and operational communication into structured online study.</figcaption>
          </figure>
        </div>
      </section>

      <section class="current-strip" aria-label="Current platform scope">
        <div class="container current-grid">
          <div class="current-item"><small>Active country layer</small><strong>Chile · DGAC</strong></div>
          <div class="current-item"><small>Current programs</small><strong>ICAO Aviation English and Pilot Licence Theory</strong></div>
          <div class="current-item"><small>Expansion rule</small><strong>New country packs publish only after source verification</strong></div>
        </div>
      </section>

      <section class="section section-white">
        <div class="container">
          <div class="section-heading">
            <div><span class="eyebrow">Programs</span><h2>Choose the program that matches your next step.</h2></div>
            <p>Aviation English is fully published. Pilot Theory is available in beta, with more lessons on the way.</p>
          </div>
          ${programRows()}
          <div class="button-row"><a class="text-link" href="/services">See program detail</a></div>
        </div>
      </section>

      <section class="section section-dark on-dark">
        <div class="container">
          <span class="eyebrow on-dark">The Aerobridge model</span>
          <div class="section-heading">
            <h2 class="heading-on-dark">One course layer. One country layer.</h2>
            <p>Core aviation subjects travel across borders. Licensing procedures and exams do not. Aerobridge keeps course content and country guidance separate, so you can see which rules apply.</p>
          </div>
          <div class="architecture" aria-label="Aerobridge training architecture">
            <article class="architecture-step"><span class="architecture-number">01 / CORE</span><h3>ICAO-aligned knowledge</h3><p>Communication, rules of the air, aircraft knowledge, navigation, performance and operations.</p></article>
            <article class="architecture-step"><span class="architecture-number">02 / COUNTRY</span><h3>Authority references</h3><p>Licensing, medical, exam and practical standards tracked to the relevant source and revision.</p></article>
            <article class="architecture-step"><span class="architecture-number">03 / PATH</span><h3>Your training route</h3><p>The program, country, authority and licence goal determine what you should study next.</p></article>
          </div>
        </div>
      </section>

      <section class="section section-blue">
        <div class="container country-grid">
          <div class="country-intro">
            <span class="eyebrow">First active country pack</span>
            <span class="big-code">CL</span>
            <h2>DGAC guidance for learners in Chile.</h2>
            <p class="lede">The Chile pack brings licensing, medical, examination and practical references into the same learner experience.</p>
            <ul class="pathway-list">${CHILE.pathways.map((pathway) => `<li>${pathway}</li>`).join('')}</ul>
          </div>
          <div>
            ${regulatoryRows()}
            <p class="source-note">References reviewed ${CHILE.verified}. Check the latest DGAC publication before applying or sitting an exam.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="future-callout">
            <div><span class="eyebrow">Other countries</span><h3>Core programs can be used internationally.</h3><p>Country-specific licensing guidance is not yet available outside Chile. New packs will appear after their authority sources and licence pathways have been reviewed.</p></div>
            <a class="button button-outline" href="/faq">Read the country FAQ</a>
          </div>
        </div>
      </section>

      <section class="section section-white">
        <div class="container founder-grid">
          <div class="founder-photo founder-chart">${routeChart()}</div>
          <div class="founder-copy"><span class="eyebrow">Why it exists</span><h2>Training should connect the rulebook to the real flight.</h2><p class="lede">Theory becomes useful when it stays connected to the regulator, the cockpit and the language used on frequency. Aerobridge is built around that connection.</p></div>
        </div>
      </section>

      ${ctaBand({ title: 'Where are you training?', text: 'Tell us your country, authority and licence goal. We will show you the most relevant starting point.' })}
    `,
  },
  {
    filename: 'services.html',
    path: '/services',
    title: 'Programs',
    description: 'Explore the current Aerobridge training programs: ICAO Aviation English and Pilot Licence Theory, plus the clearly labelled program roadmap.',
    body: `
      ${pageHero({ eyebrow: 'Programs', title: 'Start with Aviation English or Pilot Licence Theory.', lede: 'Both programs are available online. Pilot Licence Theory is in beta, with new lessons being added.' })}
      <section class="section section-white"><div class="container"><div class="section-heading"><div><span class="eyebrow">Available in the platform</span><h2>Current learner programs</h2></div><p>Each program has its own curriculum, lesson records and progress model.</p></div>${programRows()}${buttonRow({ primaryHref: SITE.signup, primaryLabel: 'Create learner account', secondaryHref: SITE.login, secondaryLabel: 'Learner sign in' })}</div></section>
      <section class="section section-blue"><div class="container content-stack">
        <div class="content-block"><h2>What learners can do</h2><div class="content-block-body"><ul class="plain-list"><li>Work through published lessons by program and module.</li><li>Use Aviation English practice formats for structured speaking rehearsal.</li><li>Review learning progress and published resources.</li><li>Check authority and country references in Requirements.</li><li>See clearly when a lesson or capability is still coming soon.</li></ul></div></div>
        <div class="content-block"><h2>In development</h2><div class="content-block-body"><p>Future catalog work covers ${PLANNED_PROGRAMS.slice(0, -1).join(', ')}, and ${PLANNED_PROGRAMS.at(-1)}. These programs are not open for enrolment yet.</p></div></div>
        <div class="content-block"><h2>Before you enrol</h2><div class="content-block-body"><div class="notice warning"><p>Pilot Licence Theory is in beta. Practice scorecards support rehearsal and do not provide an official language assessment. Country-specific licensing guidance is available for Chile.</p></div></div></div>
      </div></section>
      ${ctaBand({ title: 'Which program fits your goal?', text: 'Tell us what you are preparing for and where you train.' })}
    `,
  },
  {
    filename: 'exam-preparation.html',
    path: '/exam-preparation',
    title: 'Chile and Exam Preparation',
    description: 'Understand Aerobridge exam preparation, ICAO Aviation English, Pilot Licence Theory and the current Chile DGAC authority reference pack.',
    body: `
      ${pageHero({ eyebrow: 'Preparation and requirements', title: 'Prepare against the right standard.', lede: 'Aerobridge teaches aviation knowledge and English skills that can be used internationally, with separate country guidance where available. The first local pack covers DGAC Chile.' })}
      <section class="section section-white"><div class="container content-stack">
        <div class="content-block"><h2>ICAO Aviation English</h2><div class="content-block-body"><p class="lede">The available course develops speaking and listening across the six ICAO language proficiency descriptors.</p><ul class="check-list"><li>Pronunciation</li><li>Structure</li><li>Vocabulary</li><li>Fluency</li><li>Comprehension</li><li>Interaction</li></ul><div class="notice space-top-md"><strong>Level 4 is the minimum operational proficiency level.</strong><p>Your authority decides which tests it accepts and how long results remain valid.</p></div></div></div>
        <div class="content-block"><h2>Pilot Licence Theory</h2><div class="content-block-body"><p>Study the core subjects behind pilot licence theory: rules of the air, aircraft knowledge, performance, navigation and operations. DGAC references are included for Chile.</p><p>Pilot Theory is in beta. Two United States reference modules are included, but this is not an FAA exam-preparation course.</p></div></div>
        <div class="content-block"><h2>Practice formats</h2><div class="content-block-body"><p>Aviation English exercises follow common oral assessment flows. Scorecards provide practice feedback only. They do not analyse recorded audio or produce an official rating.</p><div class="notice warning"><strong>A note on certification</strong><p>Aerobridge supports study and practice. Licences and official language ratings are issued by the relevant authority or approved provider.</p></div></div></div>
      </div></section>
      <section class="section section-blue"><div class="container country-grid"><div class="country-intro"><span class="eyebrow">Country requirements</span><span class="big-code">CL</span><h2>Chile is the first published country pack.</h2><p>Country-specific licensing guidance is not yet available outside Chile.</p><ul class="pathway-list">${CHILE.pathways.map((pathway) => `<li>${pathway}</li>`).join('')}</ul></div><div>${regulatoryRows()}<div class="notice warning space-top-md"><strong>DAN 141 is not included yet.</strong><p>The current training-organisation standard is still being reviewed.</p></div></div></div></section>
      ${ctaBand({ title: 'Preparing for a specific exam or licence?', text: 'Tell us your country, authority and goal. We will point you to the relevant program and guidance.' })}
    `,
  },
  {
    filename: 'get-started.html',
    path: '/get-started',
    title: 'How to Start',
    description: 'Create an Aerobridge learner account, choose a current program, study published lessons and review the requirements relevant to your authority.',
    body: `
      ${pageHero({ eyebrow: 'How it works', title: 'Create your account and choose a program.', lede: 'Start with Aviation English or Pilot Licence Theory, then use the learner dashboard to study, practise and review.' })}
      <section class="section section-white"><div class="container split-grid"><div><span class="eyebrow">Learner route</span><h2>Three steps to focused study.</h2><p class="lede">Choose what you need, see what is published and work at your own pace.</p>${buttonRow({ primaryHref: SITE.signup, primaryLabel: 'Create learner account', secondaryHref: SITE.login, secondaryLabel: 'Sign in' })}</div><div class="roadmap"><article class="roadmap-step"><div><h3>Create your learner account</h3><p>Complete the sign-up flow, then sign in to your learner dashboard.</p></div></article><article class="roadmap-step"><div><h3>Choose a program</h3><p>Open ICAO Aviation English or Pilot Licence Theory from Programs.</p></div></article><article class="roadmap-step"><div><h3>Study and review</h3><p>Work through published lessons, practise and track your progress.</p></div></article></div></div></section>
      <section class="section section-blue"><div class="container content-stack"><div class="content-block"><h2>If you are in Chile</h2><div class="content-block-body"><p>Learners in Chile can consult DGAC references for PPL, IR, CPL, ME, ATPL and Flight Instructor pathways.</p></div></div><div class="content-block"><h2>If you are elsewhere</h2><div class="content-block-body"><p>The programs can be used internationally. Country-specific licensing guidance is available only for Chile, so confirm local requirements with your authority.</p></div></div><div class="content-block"><h2>If you represent a school</h2><div class="content-block-body"><p>Schools can ask about cohort, instructor and resource-management options. We will confirm which tools are ready for your use case.</p></div></div></div></section>
      ${ctaBand({ title: 'Not sure where to start?', text: 'Send your authority and licence goal. We will point you to the most relevant program.' })}
    `,
  },
  {
    filename: 'pricing.html',
    path: '/pricing',
    title: 'Access and Pricing',
    description: 'Aerobridge program access and pricing information. Online billing is not currently connected, so access questions are handled directly.',
    body: `
      ${pageHero({ eyebrow: 'Access', title: 'Access for learners and organisations.', lede: 'Contact Aerobridge for individual or organisation access. We will confirm the program, scope and price directly.' })}
      <section class="section section-white"><div class="container"><div class="section-heading"><div><span class="eyebrow">Access options</span><h2>Choose the setup that fits.</h2></div><p>Pricing is quoted by program and, for organisations, by the number of learners.</p></div><div class="plan-list"><article class="plan-row"><div><h3>Learner access</h3><p>Individual training.</p></div><div><p>Access to ICAO Aviation English or Pilot Licence Theory. Pilot Theory is in beta.</p></div><div class="plan-price"><strong>Request current price</strong><small>Quoted directly</small></div></article><article class="plan-row"><div><h3>Organisation access</h3><p>Schools and training teams.</p></div><div><p>Access scoped by program, number of learners and the tools your team needs.</p></div><div class="plan-price"><strong>Request a quote</strong><small>Scoped directly</small></div></article></div><p class="source-note">Online checkout is not available yet. We will confirm access and payment details directly.</p>${buttonRow({ primaryHref: '/free-consultation', primaryLabel: 'Ask about access', secondaryHref: SITE.dashboard, secondaryLabel: 'Open platform' })}</div></section>
      ${ctaBand({ title: 'Tell us what you need.', text: 'Share the program, country and number of learners. We will reply with the current access options.' })}
    `,
  },
  {
    filename: 'about.html',
    path: '/about',
    title: 'About',
    description: 'Aerobridge is a Chile-first aviation training platform built around an ICAO-aligned core and versioned country authority references.',
    body: `
      ${pageHero({ eyebrow: 'About Aerobridge', title: 'A training platform built from two layers.', lede: 'The first layer is shared aviation knowledge. The second is the authority-specific material that changes by country. Keeping them separate makes the product clearer and easier to maintain.' })}
      <section class="section section-white"><div class="container content-stack"><div class="content-block"><h2>Mission</h2><div class="content-block-body"><p class="lede">Make aviation study clearer by connecting ICAO-aligned knowledge with the national rules a learner must actually follow.</p><p>Aerobridge is designed for learners and training organisations. It provides preparation, practice, curriculum and regulatory references in one product.</p></div></div><div class="content-block"><h2>Current reality</h2><div class="content-block-body"><p>ICAO Aviation English is published. Pilot Licence Theory is available in beta and still expanding. Chile DGAC is the only active country pack. Five other program areas are planned.</p><p>That scope is intentionally stated in plain language throughout the site.</p></div></div><div class="content-block"><h2>Boundaries</h2><div class="content-block-body"><ul class="plain-list"><li>Aerobridge prepares and supports. It does not issue pilot licences.</li><li>Aerobridge does not certify ICAO language levels.</li><li>Authorities and approved organisations control official examinations.</li><li>Country references are planning aids and must be confirmed against the latest official publication.</li><li>Future programs and country packs are labelled before they are available.</li></ul></div></div><div class="content-block"><h2>Product principles</h2><div class="content-block-body"><ul class="plain-list"><li>One shared aviation core, with no duplicated country curriculum.</li><li>One versioned source record for each authority reference.</li><li>Clear labels for available, beta, planned and pending content.</li><li>Practical study flows instead of a generic library of documents.</li></ul></div></div></div></section>
      ${ctaBand({ title: 'See the model in the learner platform.', text: 'Open the current program catalog or ask how the Chile pack fits your licence path.', href: SITE.dashboard, label: 'Open Aerobridge' })}
    `,
  },
  {
    filename: 'history.html',
    path: '/history',
    title: 'Product History',
    description: 'How Aerobridge evolved from aviation English preparation into a country-aware training platform with Chile as its first active pack.',
    body: `
      ${pageHero({ eyebrow: 'Product history', title: 'From a single training need to a country-aware platform.', lede: 'Aerobridge began with Aviation English, then grew into a platform that separates shared aviation knowledge from national requirements.' })}
      <section class="section section-white"><div class="container split-grid"><div><span class="eyebrow">The change</span><h2>Aerobridge outgrew a one-course website.</h2><p class="lede">Aviation English remained important, but learners also needed theory, practice, progress and authority requirements in one place.</p><figure class="founder-photo space-top-lg"><img src="/assets/images/img-1087.jpeg" alt="Light aircraft parked outside a hangar" width="1920" height="1440"></figure></div><div class="history-line"><article class="history-item"><small>Foundation</small><h3>Aviation English preparation</h3><p>The original focus was operational English and preparation for ICAO language proficiency.</p></article><article class="history-item"><small>Platform rebuild</small><h3>Training became a product</h3><p>Lessons, practice, progress, resources and requirements moved into a dedicated learner platform.</p></article><article class="history-item"><small>Shared core</small><h3>Pilot theory expanded the catalog</h3><p>The new program introduced an ICAO-aligned knowledge spine with national references kept separate.</p></article><article class="history-item"><small>Country layer</small><h3>Chile became the first active pack</h3><p>DGAC licensing, medical, examination and practical references were organised as versioned source records.</p></article><article class="history-item"><small>Next phase</small><h3>Expansion follows verification</h3><p>Additional programs and country packs remain planned until their curriculum, sources and pathways are ready.</p></article></div></div></section>
      <section class="section section-blue"><div class="narrow"><span class="eyebrow">Why the model changed</span><h2>International does not mean identical.</h2><p class="lede">The underlying aviation knowledge can be shared, but licence paths, medical rules, approved exams and source documents change by authority. Aerobridge is structured around that reality.</p></div></section>
      ${ctaBand({ title: 'Explore what is live today.', text: 'The current program page separates published training from the roadmap.', href: '/services', label: 'View current programs' })}
    `,
  },
  {
    filename: 'faq.html',
    path: '/faq',
    title: 'Frequently Asked Questions',
    description: 'Answers about Aerobridge programs, Chile DGAC references, other countries, FAA content, scoring, certification and access.',
    body: `
      ${pageHero({ eyebrow: 'FAQ', title: 'Straight answers about what Aerobridge does today.', lede: 'The product is in active development. These answers separate current capability from the roadmap.' })}
      <section class="section section-white"><div class="narrow">
        <div class="faq-group"><h2>Programs and access</h2><div class="faq-list">
          <details open><summary>What programs are available?</summary><div class="faq-answer"><p>ICAO Aviation English and Pilot Licence Theory. The English program has six modules and 30 published lessons. Pilot Theory is available in beta, with later lessons still being completed.</p></div></details>
          <details><summary>Can I use Aerobridge outside Chile?</summary><div class="faq-answer"><p>Yes for the shared programs, especially ICAO Aviation English. However, Chile is the only active country pack. Do not rely on Aerobridge for another country's licensing requirements until that pack is published.</p></div></details>
          <details><summary>How do I create an account?</summary><div class="faq-answer"><p>Use the learner sign-up page in the dashboard. Once your access is active, sign in and open Programs.</p></div></details>
          <details><summary>Is pricing published?</summary><div class="faq-answer"><p>No. Billing, invoices and online payment plans are not connected. Contact Aerobridge for current access information.</p></div></details>
        </div></div>
        <div class="faq-group"><h2>Authorities and countries</h2><div class="faq-list">
          <details><summary>What does the Chile DGAC pack include?</summary><div class="faq-answer"><p>Current references for DAN 61 licensing, DAN 67 medical certification, DGAC exam-bank material, flight evaluation sheets and the licence guide. DAN 141 remains pending and is not presented as published content.</p></div></details>
          <details><summary>Are other country packs available?</summary><div class="faq-answer"><p>Not yet. Additional countries are planned, but no names or dates are promised. A pack will be published only after its authority, source documents and licence pathways are verified.</p></div></details>
          <details><summary>Is there a standalone FAA course?</summary><div class="faq-answer"><p>No. Pilot Licence Theory contains labelled United States reference material, but Aerobridge does not currently list a standalone FAA preparation or certification program.</p></div></details>
        </div></div>
        <div class="faq-group"><h2>Assessment and certification</h2><div class="faq-list">
          <details><summary>Is Aerobridge an official test or certification provider?</summary><div class="faq-answer"><p>No. Aerobridge provides preparation and practice. It does not issue licences or certify ICAO levels. Confirm approved tests, endorsements and validity with your authority.</p></div></details>
          <details><summary>How does Aviation English practice scoring work?</summary><div class="faq-answer"><p>The current scorecards are previews used to demonstrate the product flow. They are not official assessments and are not calculated from recorded audio.</p></div></details>
          <details><summary>What does ICAO Level 4 mean?</summary><div class="faq-answer"><p>Level 4 is the operational minimum across the six language proficiency descriptors. The final official rating, validity and retesting rules depend on the approved assessment and authority.</p></div></details>
        </div></div>
      </div></section>
      ${ctaBand({ title: 'Still unsure whether the current scope fits?', text: 'Send your country, authority and licence goal. We will answer directly.' })}
    `,
  },
  {
    filename: 'contact.html',
    path: '/contact',
    title: 'Contact',
    description: 'Contact Aerobridge about ICAO Aviation English, Pilot Licence Theory, Chile DGAC references or organisation access.',
    body: `
      ${pageHero({ eyebrow: 'Contact', title: 'Ask about a program, country or organisation.', lede: 'Contact Aerobridge about ICAO Aviation English, Pilot Licence Theory, Chile DGAC references or organisation access.' })}
      <section class="section section-blue"><div class="container request-grid"><aside class="request-aside"><span class="eyebrow">Direct contact</span><h2>Scheduling, handled by a person.</h2><p>The consultation request opens WhatsApp with a message you can review. We reply directly with available times.</p><div class="contact-route"><strong>WhatsApp</strong><a href="https://wa.me/${SITE.whatsappNumber}" target="_blank" rel="noopener noreferrer">${SITE.phoneDisplay}</a></div><div class="contact-route"><strong>Email</strong><a href="mailto:${SITE.email}">${SITE.email}</a></div><div class="contact-route"><strong>Platform</strong><a href="${SITE.dashboard}">dashboard.aerobridge.cl</a></div></aside>${consultationForm('Start a conversation')}</div></section>
      ${ctaBand({ title: 'Already have learner access?', text: 'Go straight to the training platform and continue your current program.', href: SITE.login, label: 'Learner sign in' })}
    `,
  },
  {
    filename: 'free-consultation.html',
    path: '/free-consultation',
    title: 'Request a Consultation',
    description: 'Request a 15-minute Aerobridge consultation by WhatsApp about Aviation English, Pilot Theory, Chile DGAC requirements or organisation access.',
    body: `
      ${pageHero({ eyebrow: '15-minute consultation', title: 'Tell us the country, authority and goal first.', lede: 'Send a concise request and Aerobridge will confirm an available time directly.' })}
      <section class="section section-blue"><div class="container request-grid"><aside class="request-aside"><span class="eyebrow">What we can clarify</span><h2>A useful first conversation.</h2><ul class="plain-list"><li>Which of the two current programs fits your goal.</li><li>What the Chile DGAC country pack covers.</li><li>Whether your non-Chile requirement is supported today.</li><li>What is available now and what remains in beta.</li><li>How organisation access currently works.</li></ul><div class="notice warning space-top-md"><strong>No certification promise</strong><p>The conversation is for training and planning. Official approval stays with the relevant authority or approved organisation.</p></div></aside>${consultationForm()}</div></section>
      ${ctaBand({ title: 'Prefer email?', text: `Write to ${SITE.email} with your country and current goal.`, href: `mailto:${SITE.email}`, label: 'Email Aerobridge' })}
    `,
  },
]

for (const entry of pages) {
  const html = page(entry)
  await writeFile(resolve(root, entry.filename), html, 'utf8')
}

console.log(`Generated ${pages.length} Aerobridge pages from one site source.`)
