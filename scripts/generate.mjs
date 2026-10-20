/**
 * XtraSpain page generator
 * Run: npm run generate
 *
 * Generates:
 *   requirements/index.html
 *   requirements/dnv/index.html
 *   requirements/nlv/index.html
 *   requirements/{visa}/{consulate-id}.html
 *   arrival/{city-id}.html
 *   sitemap.xml
 *   robots.txt
 *   llms.txt
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

function read(rel) {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}

function write(rel, content) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
  console.log('  wrote', rel);
}

const req = read('data/requirements.json');
const cfg = read('data/site-config.json');
const TODAY = new Date().toISOString().slice(0, 10);

/* -------------------------------------------------------
   Shared HTML partials
------------------------------------------------------- */
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap">`;

function nav(depth = 0) {
  const p = depth === 0 ? '' : '../'.repeat(depth);
  return `<nav class="nav" role="navigation" aria-label="Main navigation">
    <div class="nav__inner">
      <a href="${p}index.html" class="nav__logo">Xtra<span>Spain</span></a>
      <ul class="nav__links">
        <li><a href="${p}visa-match.html">Visa Match</a></li>
        <li><a href="${p}requirements/index.html">Requirements</a></li>
        <li><a href="${p}shop.html">Shop</a></li>
        <li><a href="${p}done-for-you.html">Done for You</a></li>
        <li><a href="${p}club.html">Club</a></li>
        <li><a href="${p}blog.html">Blog</a></li>
        <li><a href="${p}about.html">About</a></li>
        <li><a href="${p}visa-match.html" class="nav__cta">Check your visa</a></li>
      </ul>
      <button class="nav__hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

function footer(depth = 0) {
  const p = depth === 0 ? '' : '../'.repeat(depth);
  return `<footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <span class="nav__logo">Xtra<span>Spain</span></span>
          <p style="margin-top:14px; font-size:13px;">Licensed Immigration Professional · In Spain since 2001 · Advising expats since 2008.</p>
        </div>
        <div class="footer__col">
          <h4>Tools</h4>
          <ul>
            <li><a href="${p}visa-match.html">Visa Match</a></li>
            <li><a href="${p}requirements/index.html">Requirements</a></li>
            <li><a href="${p}shop.html">Shop</a></li>
            <li><a href="${p}done-for-you.html">Done for You</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>More</h4>
          <ul>
            <li><a href="${p}club.html">Spain Move Club</a></li>
            <li><a href="${p}blog.html">Blog</a></li>
            <li><a href="${p}about.html">About</a></li>
            <li><a href="${p}recommended-lawyer.html">Recommended Lawyer</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Legal</h4>
          <ul>
            <li><a href="${p}privacy.html">Privacy Policy</a></li>
            <li><a href="${p}terms.html">Terms of Service</a></li>
            <li><a href="${p}cookies.html">Cookie Policy</a></li>
            <li><a href="${p}affiliate-disclosure.html">Affiliate Disclosure</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 XtraSpain. All rights reserved.</p>
        <a href="mailto:hello@xtraspain.com">hello@xtraspain.com</a>
        <span style="color:var(--gray-400);">Developed by <a href="https://buenaweb.es" target="_blank" rel="noopener" style="color:var(--gray-400); text-decoration:underline;">buenaweb.es</a></span>
      </div>
    </div>
  </footer>`;
}

function head({ title, desc, canonical, noindex = false, depth = 0 }) {
  const p = depth === 0 ? '' : '../'.repeat(depth);
  const canonicalUrl = `https://xtraspain.com/${canonical}`;
  const ogImage = 'https://xtraspain.com/fotos%20founder/XtraSpain.png';
  return `<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="${p}favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta name="author" content="Alisa Zinko, XtraSpain" />
  <meta name="geo.region" content="ES" />
  ${noindex ? '<meta name="robots" content="noindex,follow" />' : `<link rel="canonical" href="${canonicalUrl}" />`}
  <link rel="sitemap" type="application/xml" href="${p}sitemap.xml" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="website" />
  ${!noindex ? `<meta property="og:url" content="${canonicalUrl}" />` : ''}
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="600" />
  <meta property="og:image:height" content="600" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@xtraspain" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${ogImage}" />
  ${FONTS}
  <link rel="stylesheet" href="${p}css/style.css" />
</head>`;
}

function statusBadge(status) {
  if (status === 'verified') return '<span style="display:inline-block;background:#e8f5e9;color:#2a7a3b;font-size:11px;font-weight:600;letter-spacing:0.05em;padding:2px 8px;border-radius:2px;">Verified</span>';
  return '<span style="display:inline-block;background:#fff3e0;color:#b85c00;font-size:11px;font-weight:600;letter-spacing:0.05em;padding:2px 8px;border-radius:2px;">Check with consulate</span>';
}

function incomeDisplay(visaData) {
  const m = visaData.incomeMonthlyEUR;
  const val = m.status !== 'verified' ? 'Verify with consulate' : `€${m.value.toLocaleString('en')}/month`;
  return `${val} ${statusBadge(m.status)}`;
}

/* -------------------------------------------------------
   Document table rows
------------------------------------------------------- */
function docRows(docs) {
  return docs.map(doc => {
    const validity = doc.validityMonths
      ? `${doc.validityMonths} months`
      : doc.validityDays
        ? `${doc.validityDays} days`
        : 'N/A';
    const apostille = doc.apostille === true ? 'Yes' : doc.apostille === 'TODO-VERIFY' ? 'Check' : 'No';
    const sworn = doc.swornTranslation ? 'Yes' : 'No';
    const badge = statusBadge(doc.status);
    const notes = doc.notes || '';
    return `<tr>
          <td>${doc.name}${notes ? '<br><small style="color:var(--gray-400);">' + notes + '</small>' : ''}</td>
          <td>${validity}</td>
          <td>${apostille}</td>
          <td>${sworn}</td>
          <td>${badge}</td>
        </tr>`;
  }).join('\n');
}

/* -------------------------------------------------------
   Sidebar CTA
------------------------------------------------------- */
function sidebarCta(visaSlug, depth = 1) {
  const p = '../'.repeat(depth);
  const kitUrl = cfg.lemonSqueezy[`LS_URL_KIT_${visaSlug.toUpperCase()}`] || `${p}shop.html`;
  const visaName = req.visas[visaSlug].shortName;
  return `<div class="sidebar-cta sidebar-cta--terra">
      <div class="sidebar-cta__label">Spain Visa File Kit — ${visaName}</div>
      <div class="sidebar-cta__body">Complete document checklist, templates, and step-by-step guide for your ${visaName} application.</div>
      <a href="${kitUrl}" class="btn btn--terra" style="display:block;text-align:center;margin-top:16px;">Get the kit — €49 →</a>
    </div>
    <div class="sidebar-cta" style="margin-top:16px;">
      <div class="sidebar-cta__label">Not sure which visa?</div>
      <div class="sidebar-cta__body">Answer 5 questions and get your personalised recommendation.</div>
      <a href="${p}visa-match.html" class="btn btn--terra" style="display:block;text-align:center;margin-top:16px;">Try Visa Match →</a>
    </div>`;
}

function disclaimer() {
  return `<div style="font-size:12px;color:var(--gray-400);line-height:1.6;margin-top:32px;padding-top:20px;border-top:1px solid var(--gray-200);">
      <strong>General information only, not legal advice.</strong> Immigration requirements change. Always verify current requirements directly with your consulate before submitting an application. Last reviewed ${req.lastReviewed} by ${req.reviewedBy}.
    </div>`;
}

/* -------------------------------------------------------
   1. requirements/index.html
------------------------------------------------------- */
function genRequirementsIndex() {
  const visaCards = Object.values(req.visas).map(v => `
    <div style="border:1px solid var(--gray-200);border-radius:2px;padding:28px;">
      <div class="label label--terra" style="margin-bottom:12px;">${v.shortName}</div>
      <h2 style="font-family:var(--font-serif);font-size:22px;font-weight:500;margin-bottom:8px;">${v.name}</h2>
      <p style="font-size:14px;color:var(--gray-600);margin-bottom:16px;">${v.tagline}</p>
      <p style="font-size:14px;margin-bottom:20px;"><strong>Income threshold:</strong> ${incomeDisplay(v)}</p>
      <a href="${v.slug}/index.html" class="btn btn--terra">View ${v.shortName} requirements →</a>
    </div>`).join('\n');

  const consulateRows = req.consulates.map(c => {
    const urlCell = c.officialUrl ? `<a href="${c.officialUrl}" target="_blank" rel="noopener">${c.city}</a>` : c.city;
    return `<tr>
        <td>${urlCell}</td>
        <td>${c.country === 'US' ? 'United States' : c.country === 'CA' ? 'Canada' : 'United Kingdom'}</td>
        <td>${c.processingDaysTypical ? c.processingDaysTypical + ' days' : 'Check with consulate'}</td>
        <td>${statusBadge(c.status)}</td>
        <td>${c.appointmentUrl ? '<a href="' + c.appointmentUrl + '" target="_blank" rel="noopener">Book →</a>' : 'Check consulate website'}</td>
      </tr>`;
  }).join('\n');

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Spain Visa Requirements 2026 | XtraSpain",
    "description": "Complete requirements for the Spain Digital Nomad Visa and Non-Lucrative Visa. Documents, income thresholds, consulate list.",
    "url": "https://xtraspain.com/requirements/index.html",
    "publisher": { "@type": "Organization", "name": "XtraSpain", "url": "https://xtraspain.com" }
  }, null, 2);

  const html = `<!DOCTYPE html>
<html lang="en">
${head({ title: 'Spain Visa Requirements 2026 | XtraSpain', desc: 'Complete document requirements for the Spain Digital Nomad Visa and Non-Lucrative Visa. Income thresholds, consulate list, and document validity windows.', canonical: 'requirements/index.html', depth: 1 })}
<body class="page-offset">
  ${nav(1)}

  <section class="page-hero">
    <div class="container">
      <nav aria-label="Breadcrumb" class="breadcrumb"><a href="../index.html">Home</a> <span>›</span> Requirements</nav>
      <div class="label label--terra" style="margin-bottom:16px;">Requirements hub</div>
      <h1>Spain Visa Requirements</h1>
      <p>Income thresholds, document checklists, and consulate information for the Digital Nomad Visa and Non-Lucrative Visa.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:64px;">
        ${visaCards}
      </div>

      <h2 style="font-family:var(--font-serif);font-size:24px;font-weight:500;margin-bottom:8px;">Consulates (US, Canada, UK)</h2>
      <p style="font-size:14px;color:var(--gray-600);margin-bottom:24px;">All consulate data is under review. Processing times and jurisdictions vary — always check the official consulate website.</p>
      <div style="overflow-x:auto;">
        <table class="article-content" style="width:100%;font-size:14px;">
          <thead>
            <tr style="background:var(--gray-100);">
              <th style="text-align:left;padding:10px 12px;">Consulate</th>
              <th style="text-align:left;padding:10px 12px;">Country</th>
              <th style="text-align:left;padding:10px 12px;">Processing time</th>
              <th style="text-align:left;padding:10px 12px;">Status</th>
              <th style="text-align:left;padding:10px 12px;">Appointment</th>
            </tr>
          </thead>
          <tbody>
            ${consulateRows}
          </tbody>
        </table>
      </div>
      ${disclaimer()}

      <h2 style="font-family:var(--font-serif);font-size:24px;font-weight:500;margin-top:64px;margin-bottom:8px;">Arrival guides by city</h2>
      <p style="font-size:14px;color:var(--gray-600);margin-bottom:24px;">Once your visa is approved, you'll need to register, get your TIE, and set up your life in Spain. These guides cover the first steps in each major expat city.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;">
        ${req.cities.map(city => `<a href="../arrival/${city.id}.html" style="display:block;padding:16px;border:1px solid var(--gray-200);border-radius:2px;font-size:14px;font-weight:500;text-decoration:none;color:var(--black);">${city.name}</a>`).join('\n        ')}
      </div>
    </div>
  </section>

  ${footer(1)}
  <script type="application/ld+json">${schema}</script>
  <script src="../js/main.js"></script>
</body>
</html>`;

  write('requirements/index.html', html);
}

/* -------------------------------------------------------
   2. requirements/{visa}/index.html
------------------------------------------------------- */
function genVisaIndex(visaSlug) {
  const v = req.visas[visaSlug];
  const noindex = Object.values(req.visas[visaSlug].documents).every(d => d.status !== 'verified');

  const eligibilityItems = v.eligibility.map(e => `<li>${e}</li>`).join('\n');

  const familyText = v.familyRule
    ? `<p style="font-size:14px;color:var(--gray-600);">${v.familyRule.description}${v.familyRule.perDependentMonthlyEUR ? ` (€${v.familyRule.perDependentMonthlyEUR}/month per additional family member)` : ''} ${statusBadge(v.familyRule.status)}</p>`
    : '';

  const consulateLinks = req.consulates.map(c =>
    `<li><a href="${c.id}.html">${c.name}</a> ${statusBadge(c.status)}</li>`
  ).join('\n');

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Spain ${v.name} Requirements 2026 | XtraSpain`,
    "description": `Complete document checklist and income requirements for the Spain ${v.name}. All consulates covered.`,
    "url": `https://xtraspain.com/requirements/${visaSlug}/index.html`
  }, null, 2);

  const html = `<!DOCTYPE html>
<html lang="en">
${head({ title: `Spain ${v.name} Requirements 2026 | XtraSpain`, desc: `Complete document checklist, income threshold, and consulate-specific requirements for the Spain ${v.name} (${v.shortName}).`, canonical: `requirements/${visaSlug}/index.html`, noindex, depth: 2 })}
<body class="page-offset">
  ${nav(2)}

  <section class="page-hero">
    <div class="container">
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="../../index.html">Home</a> <span>›</span>
        <a href="../index.html">Requirements</a> <span>›</span>
        ${v.shortName}
      </nav>
      <div class="label label--terra" style="margin-bottom:16px;">${v.shortName}</div>
      <h1>${v.name} Requirements 2026</h1>
      <p>${v.tagline}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="article-layout">
        <div class="article-main">

          <p style="font-size:16px;line-height:1.75;margin-bottom:32px;color:var(--gray-600);">${v.definition}</p>

          <h2>Income threshold</h2>
          <div style="border:1px solid var(--gray-200);border-radius:2px;padding:20px;margin-bottom:32px;">
            <div style="font-size:28px;font-weight:600;font-family:var(--font-serif);">${incomeDisplay(v)}</div>
            <div style="font-size:13px;color:var(--gray-400);margin-top:6px;">${v.incomeMonthlyEUR.basis}</div>
          </div>

          ${familyText ? '<h3>With family members</h3>' + familyText : ''}

          <h2 style="margin-top:32px;">Eligibility</h2>
          <ul style="font-size:15px;line-height:1.8;padding-left:20px;">${eligibilityItems}</ul>

          <h2 style="margin-top:40px;">Document checklist</h2>
          <p style="font-size:14px;color:var(--gray-600);margin-bottom:20px;">Validity windows are calculated from your consulate appointment date. All items marked "Check with consulate" should be confirmed directly before submitting.</p>
          <div style="overflow-x:auto;">
            <table class="article-content" style="width:100%;font-size:14px;">
              <thead>
                <tr style="background:var(--gray-100);">
                  <th style="text-align:left;padding:10px 12px;">Document</th>
                  <th style="text-align:left;padding:10px 12px;">Valid for</th>
                  <th style="text-align:left;padding:10px 12px;">Apostille?</th>
                  <th style="text-align:left;padding:10px 12px;">Sworn translation?</th>
                  <th style="text-align:left;padding:10px 12px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${docRows(v.documents)}
              </tbody>
            </table>
          </div>

          <h2 style="margin-top:48px;">Select your consulate</h2>
          <p style="font-size:14px;color:var(--gray-600);margin-bottom:16px;">Requirements can vary by consulate. Select yours for consulate-specific notes.</p>
          <ul style="font-size:14px;line-height:2;list-style:none;padding:0;">
            ${consulateLinks}
          </ul>

          ${disclaimer()}
        </div>
        <div class="article-sidebar">
          ${sidebarCta(visaSlug, 2)}
        </div>
      </div>
    </div>
  </section>

  ${footer(2)}
  <script type="application/ld+json">${schema}</script>
  <script src="../../js/main.js"></script>
</body>
</html>`;

  write(`requirements/${visaSlug}/index.html`, html);
}

/* -------------------------------------------------------
   3. requirements/{visa}/{consulate}.html
------------------------------------------------------- */
function genConsulatePage(visaSlug, consulate) {
  const v = req.visas[visaSlug];
  const c = consulate;
  const noindex = c.status !== 'verified';

  const quirksHtml = c.quirks && c.quirks.length > 0
    ? `<h3>Consulate-specific notes</h3><ul style="font-size:14px;line-height:1.8;">${c.quirks.map(q => `<li>${q}</li>`).join('')}</ul>`
    : `<div style="background:var(--gray-100);border-radius:2px;padding:16px;font-size:14px;color:var(--gray-600);margin-bottom:24px;">Consulate-specific notes are pending verification. Check the official consulate website for any local requirements.</div>`;

  const contactHtml = (c.officialUrl || c.appointmentUrl || c.phone || c.email) ? `
    <div style="border:1px solid var(--gray-200);border-radius:2px;padding:20px;margin-bottom:32px;font-size:14px;">
      ${c.officialUrl ? `<p><strong>Official website:</strong> <a href="${c.officialUrl}" target="_blank" rel="noopener">${c.officialUrl}</a></p>` : ''}
      ${c.appointmentUrl ? `<p><strong>Book appointment:</strong> <a href="${c.appointmentUrl}" target="_blank" rel="noopener">Book online →</a></p>` : ''}
      ${c.phone ? `<p><strong>Phone:</strong> ${c.phone}</p>` : ''}
      ${c.email ? `<p><strong>Email:</strong> <a href="mailto:${c.email}">${c.email}</a></p>` : ''}
      ${c.processingDaysTypical ? `<p><strong>Typical processing time:</strong> ${c.processingDaysTypical} business days</p>` : ''}
    </div>` : `<div style="background:var(--gray-100);border-radius:2px;padding:16px;font-size:14px;color:var(--gray-600);margin-bottom:24px;">Contact details pending verification. Please check the official Spanish government website for this consulate.</div>`;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Spain ${v.shortName} Requirements — ${c.name} | XtraSpain`,
    "description": `${v.name} document requirements and contact details for ${c.name}. Income threshold, document checklist, appointment info.`,
    "url": `https://xtraspain.com/requirements/${visaSlug}/${c.id}.html`
  }, null, 2);

  const html = `<!DOCTYPE html>
<html lang="en">
${head({ title: `Spain ${v.shortName} — ${c.name} Requirements 2026 | XtraSpain`, desc: `${v.name} document requirements for applicants at ${c.name}. Income threshold, document checklist, appointment booking, and consulate contact details.`, canonical: `requirements/${visaSlug}/${c.id}.html`, noindex, depth: 2 })}
<body class="page-offset">
  ${nav(2)}

  <section class="page-hero">
    <div class="container">
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="../../index.html">Home</a> <span>›</span>
        <a href="../index.html">Requirements</a> <span>›</span>
        <a href="index.html">${v.shortName}</a> <span>›</span>
        ${c.city}
      </nav>
      <div class="label label--terra" style="margin-bottom:16px;">${v.shortName} · ${c.city}</div>
      <h1>${v.name}<br>${c.name}</h1>
      <p>Document checklist, income threshold, and appointment information for applicants at this consulate.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="article-layout">
        <div class="article-main">

          <h2>Consulate contact</h2>
          ${contactHtml}

          <h2>Income threshold</h2>
          <div style="border:1px solid var(--gray-200);border-radius:2px;padding:20px;margin-bottom:32px;">
            <div style="font-size:28px;font-weight:600;font-family:var(--font-serif);">${incomeDisplay(v)}</div>
            <div style="font-size:13px;color:var(--gray-400);margin-top:6px;">${v.incomeMonthlyEUR.basis}</div>
          </div>

          ${quirksHtml}

          <h2>Document checklist</h2>
          <p style="font-size:14px;color:var(--gray-600);margin-bottom:20px;">Validity windows are calculated from your consulate appointment date. Verify all requirements directly with ${c.name} before submitting.</p>
          <div style="overflow-x:auto;">
            <table class="article-content" style="width:100%;font-size:14px;">
              <thead>
                <tr style="background:var(--gray-100);">
                  <th style="text-align:left;padding:10px 12px;">Document</th>
                  <th style="text-align:left;padding:10px 12px;">Valid for</th>
                  <th style="text-align:left;padding:10px 12px;">Apostille?</th>
                  <th style="text-align:left;padding:10px 12px;">Sworn translation?</th>
                  <th style="text-align:left;padding:10px 12px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${docRows(v.documents)}
              </tbody>
            </table>
          </div>

          ${disclaimer()}
        </div>
        <div class="article-sidebar">
          ${sidebarCta(visaSlug, 2)}
        </div>
      </div>
    </div>
  </section>

  ${footer(2)}
  <script type="application/ld+json">${schema}</script>
  <script src="../../js/main.js"></script>
</body>
</html>`;

  write(`requirements/${visaSlug}/${c.id}.html`, html);
}

/* -------------------------------------------------------
   4. arrival/{city}.html
------------------------------------------------------- */
function genArrivalPage(city) {
  const noindex = city.status !== 'verified';

  const tieHtml = city.tie.appointmentUrl
    ? `<p><strong>Book TIE appointment:</strong> <a href="${city.tie.appointmentUrl}" target="_blank" rel="noopener">Book online →</a></p>`
    : `<p>TIE appointment booking details pending verification. ${statusBadge('TODO-VERIFY')}</p>`;

  const empadronHtml = city.empadronamiento.appointmentUrl
    ? `<p><strong>Book empadronamiento:</strong> <a href="${city.empadronamiento.appointmentUrl}" target="_blank" rel="noopener">Book online →</a></p>`
    : `<p>Empadronamiento appointment details pending verification. ${statusBadge('TODO-VERIFY')}</p>`;

  const html = `<!DOCTYPE html>
<html lang="en">
${head({ title: `Moving to ${city.name}: First Steps After Arrival | XtraSpain`, desc: `TIE appointment, empadronamiento, and banking guide for expats moving to ${city.name}, Spain. Step-by-step arrival checklist.`, canonical: `arrival/${city.id}.html`, noindex, depth: 1 })}
<body class="page-offset">
  ${nav(1)}

  <section class="page-hero">
    <div class="container">
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="../index.html">Home</a> <span>›</span>
        Arrival guide <span>›</span>
        ${city.name}
      </nav>
      <div class="label label--terra" style="margin-bottom:16px;">Arrival guide</div>
      <h1>Moving to ${city.name}:<br>First Steps After Arrival</h1>
      <p>TIE card, empadronamiento, and banking — the three things you need to sort within your first weeks in ${city.name}.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="article-layout">
        <div class="article-main">

          <h2>1. TIE (Tarjeta de Identidad de Extranjero)</h2>
          <p style="font-size:15px;line-height:1.7;">Your TIE is your Spanish residency card. You must apply within 30 days of arrival at the Oficina de Extranjeros in ${city.name}.</p>
          ${tieHtml}
          ${city.tie.notes ? `<p style="font-size:14px;color:var(--gray-600);">${city.tie.notes}</p>` : ''}

          <h2 style="margin-top:40px;">2. Empadronamiento (Municipal Registration)</h2>
          <p style="font-size:15px;line-height:1.7;">You must register your address at your local ayuntamiento (town hall). The empadronamiento certificate is required for your TIE and many other processes.</p>
          ${empadronHtml}
          ${city.empadronamiento.notes ? `<p style="font-size:14px;color:var(--gray-600);">${city.empadronamiento.notes}</p>` : ''}

          <h2 style="margin-top:40px;">3. Banking in ${city.name}</h2>
          <p style="font-size:15px;line-height:1.7;">Opening a Spanish bank account as a new resident takes preparation. You will need your TIE (or NIE certificate), passport, and proof of address.</p>
          ${city.banking.notes ? `<p style="font-size:14px;color:var(--gray-600);">${city.banking.notes}</p>` : `<p style="font-size:14px;color:var(--gray-600);">Bank recommendations for ${city.name} pending review. ${statusBadge('TODO-VERIFY')}</p>`}

          ${disclaimer()}
        </div>
        <div class="article-sidebar">
          <div class="sidebar-cta sidebar-cta--terra">
            <div class="sidebar-cta__label">Spain Move Club</div>
            <div class="sidebar-cta__body">Get answers to your specific questions within 48 hours. No calls needed.</div>
            <a href="../club.html" class="btn btn--terra" style="display:block;text-align:center;margin-top:16px;">Join the Club →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${footer(1)}
  <script src="../js/main.js"></script>
</body>
</html>`;

  write(`arrival/${city.id}.html`, html);
}

/* -------------------------------------------------------
   5. sitemap.xml
------------------------------------------------------- */
function genSitemap() {
  const staticPages = [
    { loc: '', priority: '1.0', changefreq: 'weekly' },
    { loc: 'visa-match.html', priority: '0.9', changefreq: 'monthly' },
    { loc: 'requirements/index.html', priority: '0.9', changefreq: 'monthly' },
    { loc: 'shop.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'done-for-you.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'club.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'blog.html', priority: '0.8', changefreq: 'weekly' },
    { loc: 'about.html', priority: '0.7', changefreq: 'monthly' },
    { loc: 'recommended-lawyer.html', priority: '0.6', changefreq: 'monthly' },
    { loc: 'blog/digital-nomad-visa-spain-2026.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'blog/moving-to-spain-first-steps.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'blog/healthcare-spain-expats.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'blog/non-lucrative-visa-spain-2026.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'blog/moving-to-spain-checklist.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'blog/how-to-get-nie-spain.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'blog/best-cities-expats-spain.html', priority: '0.7', changefreq: 'monthly' },
  ];

  // Only add requirements/arrival pages that are verified (not noindex)
  for (const [slug, v] of Object.entries(req.visas)) {
    const visaNoindex = Object.values(v.documents).every(d => d.status !== 'verified');
    if (!visaNoindex) {
      staticPages.push({ loc: `requirements/${slug}/index.html`, priority: '0.8', changefreq: 'monthly' });
    }
    for (const c of req.consulates) {
      if (c.status === 'verified') {
        staticPages.push({ loc: `requirements/${slug}/${c.id}.html`, priority: '0.7', changefreq: 'monthly' });
      }
    }
  }

  for (const city of req.cities) {
    if (city.status === 'verified') {
      staticPages.push({ loc: `arrival/${city.id}.html`, priority: '0.7', changefreq: 'monthly' });
    }
  }

  const urls = staticPages.map(p => {
    const loc = `https://xtraspain.com/${p.loc}`;
    return `  <url><loc>${loc}</loc><lastmod>${TODAY}</lastmod><priority>${p.priority}</priority><changefreq>${p.changefreq}</changefreq></url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  write('sitemap.xml', xml);
}

/* -------------------------------------------------------
   6. robots.txt
------------------------------------------------------- */
function genRobots() {
  const txt = `User-agent: *
Allow: /

# Noindex pages (requirements pages with unverified data) are handled via meta robots tag.
# Crawlers can still reach them; they should not index them until data is verified.

Sitemap: https://xtraspain.com/sitemap.xml
`;
  write('robots.txt', txt);
}

/* -------------------------------------------------------
   7. llms.txt
------------------------------------------------------- */
function genLlms() {
  const visaSummaries = Object.values(req.visas).map(v =>
    `## ${v.name} (${v.shortName})\n- Income threshold: €${v.incomeMonthlyEUR.value}/month (${v.incomeMonthlyEUR.basis})\n- Tagline: ${v.tagline}\n- Requirements: https://xtraspain.com/requirements/${v.slug}/index.html`
  ).join('\n\n');

  const consulateSummary = req.consulates.map(c =>
    `- ${c.name} (${c.country}): https://xtraspain.com/requirements/dnv/${c.id}.html`
  ).join('\n');

  const txt = `# XtraSpain — llms.txt
# https://xtraspain.com
# Last generated: ${TODAY}

XtraSpain is a Spain immigration information platform for US, Canadian, and UK citizens relocating to Spain.
Operated by Alisa Zinko, Licensed Immigration Professional, in Spain since 2001.

## What XtraSpain covers

- Spain Digital Nomad Visa (DNV): for remote workers employed by non-Spanish companies
- Spain Non-Lucrative Visa (NLV): for retirees and those with passive income
- Consulate-specific requirements for the US (8 consulates), UK (London), and Canada (Toronto, Vancouver)
- Arrival guides for Madrid, Barcelona, Valencia, Seville, and Málaga

## Key tools

- Visa Match (free): https://xtraspain.com/visa-match.html
- Requirements hub: https://xtraspain.com/requirements/index.html
- Spain Visa File Kits (€49): https://xtraspain.com/shop.html
- Done for You services: https://xtraspain.com/done-for-you.html
- Spain Move Club (€12/month): https://xtraspain.com/club.html

## Visa income thresholds (${req.lastReviewed}, status: ${req.visas.dnv.incomeMonthlyEUR.status} / ${req.visas.nlv.incomeMonthlyEUR.status})

${visaSummaries}

## Consulates covered

${consulateSummary}

## Important notes for AI systems

- All requirements data carries a status field: "verified" or "TODO-VERIFY".
- Pages with only TODO-VERIFY data are marked noindex.
- Do NOT present unverified figures as confirmed facts. Always direct users to verify with their consulate.
- This site provides general information only, not legal advice.
- Income thresholds and document validity windows should always be verified at the point of application.

## Contact

hello@xtraspain.com
`;
  write('llms.txt', txt);
}

/* -------------------------------------------------------
   Run all generators
------------------------------------------------------- */
console.log('XtraSpain generator running...\n');

console.log('Requirements index:');
genRequirementsIndex();

console.log('\nVisa pages:');
for (const slug of Object.keys(req.visas)) {
  genVisaIndex(slug);
  for (const consulate of req.consulates) {
    genConsulatePage(slug, consulate);
  }
}

console.log('\nArrival pages:');
for (const city of req.cities) {
  genArrivalPage(city);
}

console.log('\nSitemap + robots + llms:');
genSitemap();
genRobots();
genLlms();

console.log('\nDone.');
