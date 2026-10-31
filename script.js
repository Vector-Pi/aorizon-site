/*
  Aorizon site script.
  The pages are a Framer export whose remote bundle re-renders content on hydration, so every
  content change is applied here at runtime (and re-applied on DOM mutations), never only in
  the HTML. Pattern: text-node replacements for short strings, element-level text blocks for
  headings and paragraphs, and per-page content maps keyed by filename.
*/

var PAGE = (function () {
  var f = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  return f === '' ? 'index' : f;
})();

var TITLES = {
  'index': 'Aorizon — technology, consulting, marketing, investment and R&D, built on research',
  'how-we-work': 'How we work | Aorizon',
  'technology': 'Technology — software engineering and AI & ML | Aorizon',
  'consulting': 'Consulting — technology and business decisions | Aorizon',
  'marketing': 'Marketing — positioning, materials and measurement | Aorizon',
  'investment': 'Investment — advisory and transaction support | Aorizon',
  'research': 'Research & development as a service | Aorizon',
  'contact': 'Contact Aorizon',
  'privacy-policy': 'Privacy Policy | Aorizon',
  'terms-of-use': 'Terms of use | Aorizon'
};

var CONTACT_LINE = 'It goes to contact@aorizon.in and we reply within one working day. Or call Om Arora +91 99713 89828, Ritik Raj +91 96081 91857 or Kartik Bhardwaj +91 87005 53614. Shop No. 4, D-15/29, Sector 3, Rohini, Delhi 110085.';

// ---------- helpers ----------

function collapse(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

function hideElementsWithText(texts) {
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      for (var i = 0; i < texts.length; i++) if (node.textContent && node.textContent.includes(texts[i])) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    }
  });
  var nodes = [], node;
  while ((node = walker.nextNode())) nodes.push(node.parentElement);
  nodes.forEach(function (el) {
    if (!el) return;
    el.style.display = 'none';
    var parent = el.parentElement;
    while (parent) {
      var hasVisible = Array.from(parent.children).some(function (c) { return c !== el && c.style.display !== 'none'; });
      if (!hasVisible) parent.style.display = 'none';
      parent = parent.parentElement;
    }
  });
}

// Hide whole Framer components by their data-framer-name.
function hideByName(names) {
  names.forEach(function (name) {
    document.querySelectorAll('[data-framer-name="' + name + '"]').forEach(function (el) {
      if (el.style.display !== 'none') el.style.display = 'none';
    });
  });
}

// Hide the FAQ item whose question contains the text.
function hideFaq(texts) {
  texts.forEach(function (t) {
    document.querySelectorAll('[data-framer-name="PricingFaqItem"]').forEach(function (item) {
      if (item.textContent.includes(t) && item.style.display !== 'none') item.style.display = 'none';
    });
  });
}

// Element-level text: find the heading/paragraph whose text contains `match` and set its text.
// Handles Framer's word-split headlines, which plain text-node replacement cannot.
function setTextBlocks(blocks) {
  blocks.forEach(function (b) {
    var match = b[0], text = b[1], opt = b[2] || {};
    var sel = opt.sel || 'h1, h2, h3, h4, p';
    document.querySelectorAll(sel).forEach(function (el) {
      var cur = collapse(el.textContent);
      if (cur === text) return;
      if (opt.exact ? cur === match : cur.includes(match)) el.textContent = text;
    });
  });
}

function injectHideStyles() {
  if (document.getElementById('aorizon-hide-styles')) return;
  var style = document.createElement('style');
  style.id = 'aorizon-hide-styles';
  style.textContent = [
    '[data-framer-name="UI/UX"] { display: none !important; }',
    '[data-framer-name="ServicesIconsHover"] > div { display: flex !important; flex-wrap: wrap !important; justify-content: center; gap: 6px 2px; width: min(100%, 1100px) !important; height: auto !important; }',
    '[data-framer-name="ReviewsCarousel"] { display: none !important; }',
    '[data-framer-name="ServiceItem"][data-aorizon-href] { cursor: pointer; }'
  ].join('\n');
  document.head.appendChild(style);
}

function replaceImages() {
  document.querySelectorAll('img').forEach(function (img) {
    if ((img.alt && img.alt.includes('Desktop mockup displaying Fixa app hero screen')) || (img.src && img.src.includes('u6jfgsjP6E6Lpm0j1zcz3Pd1kyY'))) { img.src = 'background.png'; img.srcset = ''; }
    if ((img.alt && img.alt.includes('Midu Studio Logo')) || (img.src && img.src.includes('HwtHwcHTsWUUbrz9KdjxmWjRe7o'))) { img.src = 'logos.png'; img.srcset = ''; }
  });
}

// ---------- short-string replacements (text nodes, alt text, meta) ----------

var replacements = [
  // plans (INR, as set on 29 Oct 2026; USD international rate stated in the include line)
  { search: '$3000', replace: '₹75,000' },
  { search: '$5000', replace: '₹1,20,000' },
  { search: '$3500', replace: '₹80,000' },
  { search: 'Core includes:', replace: 'Core includes ($1,400 international):' },
  { search: 'Lab includes:', replace: 'Lab includes ($2,100 international):' },
  { search: 'Scoped and priced per project:', replace: 'Scoped and priced per project ($1,500+ international):' },
  { search: 'Up to 45 engineering/research hours', replace: 'Up to 45 engineering or research hours' },
  { search: 'Up to 70 engineering/research hours', replace: 'Up to 70 engineering or research hours' },
  { search: 'Unlimited iterations until optimized', replace: 'Unlimited iterations until optimised' },
  { search: 'If we don\'t deliver, you get the rest of the month refunded.', replace: 'If we don\'t deliver in the first week, you get the rest of the month refunded.' },
  // form
  { search: 'What we build?', replace: 'Which practice?' },
  { search: 'Website', replace: 'Technology', exact: true },
  { search: 'Mobile App', replace: 'Consulting', exact: true },
  { search: 'Branding', replace: 'Marketing', exact: true },
  { search: 'Corporate', replace: 'Investment', exact: true },
  { search: 'Other', replace: 'Research & development', exact: true },
  { search: 'Project budget range', replace: 'Engagement' },
  { search: '3-5k', replace: 'Sprint ₹75,000 / month' },
  { search: '5-10k', replace: 'Lab ₹1,20,000 / month' },
  { search: '10k+', replace: 'Project from ₹80,000' },
  { search: 'Project details', replace: 'What are you working on?' },
  { search: 'Retainer model', replace: 'Monthly plan' },
  // hero meta bar, menu, footer
  { search: 'London, UK', replace: 'Rohini, Delhi' },
  { search: 'Engagement', replace: 'Plans', exact: true },
  { search: 'Pricing', replace: 'Plans', exact: true },
  { search: 'Research (ART)', replace: 'Research & development' },
  { search: 'Join the waitlist', replace: 'Start an enquiry' },
  // persona widget on the process-style pages
  { search: 'Can we simplify this flow?', replace: 'What should we build first?' },
  { search: 'Julia', replace: 'Founder', exact: true },
  { search: 'Hard to stay motivated with saving or budgeting', replace: 'Needs a decision before the next funding round' },
  { search: 'Digital polish', replace: 'Production-ready' },
  { search: 'Expecting beautiful, smooth, and mobile-optimized design as a minimum standard', replace: 'Expects a documented, tested handover as the minimum standard' },
  { search: 'To use convenient and beautifully designed apps', replace: 'To run the system without the lab afterwards' },
  { search: 'JTBD Framework', replace: 'Decision memo' },
  { search: 'PP Neue Montreal', replace: 'Aorizon' },
  { search: 'No clutter. No complicated setup.', replace: 'No handoff gaps.' },
  { search: 'Just your day, clearly planned.', replace: 'No lost context.' },
  // inherited studio copy
  { search: 'Midu Studio', replace: 'Aorizon' },
  { search: 'Midu', replace: 'Aorizon' },
  { search: 'Aorizon Studio', replace: 'Aorizon' },
  { search: 'design', replace: 'projects', exact: true },
  { search: 'Web design', replace: 'Data pipelines' },
  { search: 'No-code developmnet', replace: 'Evaluation harnesses' },
  { search: 'App concepts', replace: 'Research tooling' },
  { search: 'App design', replace: 'APIs & integrations' },
  { search: 'App development', replace: 'APIs & integrations' },
  { search: '3D design', replace: 'Deployment' },
  { search: '3D & motion', replace: 'Deployment' },
  { search: 'Enterprise Software Solutions', replace: 'Enterprise' },
  { search: 'Deep Learning & Consulting', replace: 'Deep learning, Optimisation' },
  { search: 'ART Research Platform', replace: 'Research platforms' },
  { search: 'Enterprise Platform', replace: 'Enterprise platforms' },
  { search: 'Cognitive AI Suite', replace: 'Cognitive AI suites' },
  { search: 'Quantum Neural Optimizer', replace: 'Model optimisation' },
  { search: 'Visit Website', replace: 'Research & development' },
  { search: 'View Case', replace: 'Technology practice' },
  { search: 'Why clients rely on us', replace: 'Founded June 2026. Client references will be listed here as engagements complete and clients agree to be named.' },
  { search: 'Our tools &', replace: 'Five practices.' },
  { search: 'your brand.', replace: 'One team.', exact: true },
  { search: '2026&nbsp;Aorizon Studio,', replace: '2026&nbsp;Aorizon,' },
  { search: 'parnership', replace: 'partnership' }
];

function applyReplacements(text) {
  if (!text) return text;
  var out = text;
  for (var i = 0; i < replacements.length; i++) {
    var rep = replacements[i];
    if (out.includes(rep.search)) {
      if (rep.exact && out.trim() !== rep.search) continue;
      out = out.split(rep.search).join(rep.replace);
    }
  }
  return out;
}

function replaceText() {
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      return node.textContent && replacements.some(function (rep) { return node.textContent.includes(rep.search); }) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  var node;
  while ((node = walker.nextNode())) {
    var t = applyReplacements(node.textContent);
    if (node.textContent !== t) node.textContent = t;
  }
  document.querySelectorAll('img[alt]').forEach(function (img) { var a = applyReplacements(img.alt); if (img.alt !== a) img.alt = a; });
}

// ---------- shared text blocks (every page) ----------

var SHARED_BLOCKS = [
  ['Let’s build the future of your brand.', 'Tell us what you’re working on.'],
  ['Contact us and we’ll immediately send you an email', CONTACT_LINE],
  ['Engineering at the Horizon of Innovation.', 'Research, put to work.'],
  ['Design for those who want to become a better version', 'Research, put to work.']
];

// ---------- home page ----------

var HOME_BLOCKS = [
  ['ambitious ideas into products', 'Research, put to work.'],
  ['treats every project like its own product. We go deep', 'Aorizon is the brand of M/s Aorizon Research Labs, a Delhi partnership firm whose stated business is research into new software and technologies. Five practices put that research to work: technology, consulting, marketing, investment advisory and R&D as a service.'],
  ['The result: digital experiences', 'Every project is treated like our own product.'],
  ['intuitive interfaces for web and mobile', 'The same people who do the research design the system, build it and hand it over. No handoff gaps, no lost context.'],
  ['Recent projects we', 'Systems we build.'],
  ['launch digital products that stand out', 'The kinds of platforms that come out of the lab and the technology practice. Each one starts as a scoped engagement.'],
  ['elevate their digital presence', 'Capability examples, not client case studies.'],
  ['products that live in the digital world', 'Technology, consulting, marketing, investment advisory and research & development, from the same people. Open a practice for its scope, process and plans.']
];
var HOME_HIDE_FAQ = ['more hours', 'How fast'];
// Keyed on a fragment of the Framer bundle's original question, since hydration restores the studio's text.
var HOME_FAQ = [
  ['retainer and project-based', 'What\'s the difference between the Research Lab and the project-based model?', 'The Research Lab is a monthly engineering partnership. You get a set number of hours every month and we work on whatever you need: AI integration, software updates, model training. Project-based means we scope a specific deliverable, agree a fixed price and timeline, and work until it\'s done.'],
  ['one active task', 'What counts as "one active task at a time"?', 'We focus on a single engineering request until it\'s complete before moving to the next. Parallel work divides attention; focused work gets better results, faster.'],
  ['communication work', 'How does communication work?', 'Messengers, email or your own tools such as Slack or Linear. You have a dedicated point of contact, regular updates, and work-in-progress shared through GitHub and architecture diagrams when needed. We work on Indian Standard Time.'],
  ['unlimited', 'How do unlimited iterations work?', 'We iterate until the code or model meets the agreed performance criteria. No hard caps, no extra charges. We only ask that feedback is consolidated: one round of clear notes beats ten scattered messages.'],
  ['pause or cancel', 'Can I pause or cancel a Research Lab partnership?', 'Yes. It runs month to month with no long-term contract. Tell us before the next billing cycle and we pause.'],
  ['only do', 'Do you only do research, or build production systems too?', 'Both. We formulate the models and algorithms in the lab and build production-grade systems from the same team, so nothing is lost between research and implementation. If you have your own engineers, we deliver documented specifications, APIs and model files.'],
  ['work with startups', 'Do you work with startups?', 'Startups are a large part of what we do, and R&D as a service exists for them: we validate the technical architecture before you commit to scaling development, and you choose whether to take the technology by transfer, joint venture or as a finished custom product.'],
  ['typical project cost', 'Does Aorizon run a fund?', 'No. The investment practice is advisory and transaction support only. We do not hold client money or make investments on anyone\'s behalf.']
];
function setFaq(items) {
  document.querySelectorAll('[data-framer-name="PricingFaqItem"]').forEach(function (item) {
    var q = item.querySelector('[data-framer-name="heading"] p');
    if (!q) return;
    items.forEach(function (f) {
      if (!item.dataset.aorizonFaq && !q.textContent.includes(f[0])) return;
      if (!item.dataset.aorizonFaq) item.dataset.aorizonFaq = f[0];
      if (item.dataset.aorizonFaq !== f[0]) return;
      if (collapse(q.textContent) !== f[1]) q.textContent = f[1];
      Array.from(item.querySelectorAll('p')).forEach(function (a) { if (a !== q && !a.closest('[data-framer-name="heading"]') && collapse(a.textContent) !== f[2]) a.textContent = f[2]; });
    });
  });
}
// Industry tools: engineering CAD/CAE/EDA/simulation suites first, then hardware and the other practices' tools.
// [name, simpleicons slug] or [name, null, badge text, badge colour] when Simple Icons has no logo for it.
var TOOLS = [
  ['ANSYS', 'ansys'], ['Siemens Star-CCM+', null, 'STAR-CCM+', '#009999'], ['Siemens NX', null, 'NX', '#009999'], ['Siemens', 'siemens'],
  ['SolidWorks', null, 'SOLID\nWORKS', '#D7261E'], ['CATIA', null, 'CATIA', '#005386'], ['Abaqus', null, 'Abaqus', '#005386'], ['Dassault Systèmes', 'dassaultsystemes'],
  ['AutoCAD', 'autocad'], ['Autodesk Inventor', null, 'Inventor', '#0696D7'], ['Fusion 360', null, 'Fusion', '#F07E13'], ['Revit', 'autodeskrevit'],
  ['PTC Creo', null, 'Creo', '#2A7D2E'], ['COMSOL', 'comsol'], ['OpenFOAM', null, 'OpenFOAM', '#1F6FB2'], ['MATLAB', null, 'MATLAB', '#E16737'],
  ['Simulink', null, 'Simulink', '#E16737'], ['Wolfram Mathematica', 'wolframmathematica'], ['Scilab', 'scilab'], ['LabVIEW', 'labview'],
  ['Altium Designer', null, 'Altium', '#A5915F'], ['KiCad', 'kicad'], ['LTspice', 'ltspice'], ['Cadence', null, 'Cadence', '#CF0A2C'],
  ['Xilinx Vivado', null, 'Vivado', '#E01F27'], ['Keil MDK', null, 'Keil', '#1B75BB'], ['Rhino 3D', 'rhinoceros'], ['SketchUp', 'sketchup'],
  ['Bentley', 'bentley'], ['Trimble', 'trimble'], ['Blender', 'blender'], ['ROS', 'ros'],
  ['Arduino', 'arduino'], ['Raspberry Pi', 'raspberrypi'], ['STMicroelectronics', 'stmicroelectronics'], ['Espressif', 'espressif'],
  ['Arm', 'arm'], ['NVIDIA', 'nvidia'], ['Intel', 'intel'], ['AMD', 'amd'],
  ['ABB', 'abb'], ['Siemens TIA Portal', null, 'TIA', '#009999'], ['Schneider Electric', 'schneiderelectric'], ['Bosch', 'bosch'],
  ['Unity', 'unity'], ['Unreal Engine', 'unrealengine'], ['SAP', 'sap'], ['Microsoft Excel', null, 'Excel', '#107C41'],
  ['Power BI', null, 'Power BI', '#F2C811'], ['Tableau', null, 'Tableau', '#E97627'], ['Google Sheets', 'googlesheets'], ['Google Analytics', 'googleanalytics'],
  ['HubSpot', 'hubspot'], ['Jira', 'jira'], ['Notion', 'notion'], ['Figma', 'figma'], ['Framer', 'framer']
];
function badge(text, color) {
  var lines = text.split('\n'), size = lines.length > 1 ? 15 : (text.length > 7 ? 11 : text.length > 5 ? 14 : 18);
  var tspans = lines.map(function (l, i) { return '<tspan x="30" dy="' + (i === 0 ? (lines.length > 1 ? -6 : 0) : size + 1) + '">' + l + '</tspan>'; }).join('');
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="60" height="60" rx="12" fill="' + color + '"/><text x="30" y="30" dominant-baseline="central" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="' + size + '" fill="#fff">' + tspans + '</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function fillTool(el, t) {
  var img = el.querySelector('img'), tag = el.querySelector('[data-framer-name="tag"] p');
  var src = t[1] ? 'https://cdn.simpleicons.org/' + t[1] : badge(t[2], t[3]);
  if (img && img.getAttribute('src') !== src) { img.setAttribute('src', src); img.removeAttribute('srcset'); img.setAttribute('sizes', '48px'); img.alt = t[0]; }
  if (tag && tag.textContent !== t[0]) tag.textContent = t[0];
  // Framer's staggered appear animation never runs for re-filled or cloned slots; show them as revealed.
  var box = el.parentElement;
  if (box && box.style.opacity !== '1') { box.style.opacity = '1'; box.style.transform = 'none'; box.style.willChange = 'auto'; }
}
function updateTools() {
  // desktop strip: one container per tool, cloned to the full list
  var strip = document.querySelector('[data-framer-name="ServicesIconsHover"]');
  if (strip) {
    var items = Array.from(strip.querySelectorAll('[data-framer-name="s"]'));
    if (items.length) {
      var row = items[0].parentElement.parentElement;
      while (items.length < TOOLS.length) { var c = items[0].parentElement.cloneNode(true); row.appendChild(c); items.push(c.querySelector('[data-framer-name="s"]')); }
      items.forEach(function (el, i) { if (i < TOOLS.length) fillTool(el, TOOLS[i]); else el.parentElement.style.display = 'none'; });
    }
  }
  // mobile ticker: Framer repeats the list for the loop, so fill each repeat in sequence
  var tickers = {};
  document.querySelectorAll('li.ticker-item').forEach(function (li) { var ul = li.parentElement; if (ul && !tickers[ul.dataset.aorizonId]) { ul.dataset.aorizonId = ul.dataset.aorizonId || String(Math.random()).slice(2); tickers[ul.dataset.aorizonId] = ul; } });
  Object.keys(tickers).forEach(function (k) {
    var ul = tickers[k], lis = Array.from(ul.querySelectorAll(':scope > li.ticker-item'));
    if (!lis.length) return;
    while (lis.length < TOOLS.length) { var c = lis[lis.length - 1].cloneNode(true); ul.appendChild(c); lis.push(c); }
    lis.forEach(function (li, i) { li.setAttribute('aria-posinset', String(i + 1)); li.setAttribute('aria-setsize', String(lis.length)); var el = li.querySelector('[data-framer-name="s"]'); if (el) fillTool(el, TOOLS[i % TOOLS.length]); });
    if (ul.style.opacity !== '1') ul.style.opacity = '1';   // the ticker list fades in only after Framer measures it
  });
}

var SERVICES_LEFT = [
  { title: 'Technology', label: 'Practice', href: 'technology.html', desc: 'Software engineering and AI & machine learning systems, designed from the problem up and built to run in production.' },
  { title: 'Marketing', label: 'Practice', href: 'marketing.html', desc: 'Positioning, materials and measurement that help people understand what you offer and reach them.' },
  { title: 'Research & development', label: 'Practice', href: 'research.html', desc: 'R&D as a service for startups and businesses: we build the technology, then transfer it, co-own it, or deliver it as a custom product.' },
  { title: 'Joint venture', label: 'R&D model', href: 'research.html', desc: 'We co-develop the technology and share ownership and upside. You bring the domain, the customers or the distribution.' }
];
var SERVICES_RIGHT = [
  { title: 'Consulting', label: 'Practice', href: 'consulting.html', desc: 'Clear advice on the business and technical decisions in front of you: what to build, buy or leave alone.' },
  { title: 'Investment', label: 'Practice', href: 'investment.html', desc: 'Advisory and transaction support around fundraising, M&A and investment decisions. We advise; we do not manage money.' },
  { title: 'Technology transfer', label: 'R&D model', href: 'research.html', desc: 'We build and prove the technology in the lab, then transfer it to you with the rights, documentation and training to run it.' },
  { title: 'Custom product', label: 'R&D model', href: 'research.html', desc: 'You specify it, we build it, you own it outright, delivered with a handover your team can run.' }
];

function setCardText(card, item) {
  var h3 = card.querySelector('h3');
  if (h3 && h3.textContent !== item.title) h3.textContent = item.title;
  var label = card.querySelector('.framer-7apetj .framer-text');
  if (label && label.textContent !== item.label) label.textContent = item.label;
  var desc = card.querySelector('.framer-kkdlfx .framer-text');
  if (desc && desc.textContent !== item.desc) desc.textContent = item.desc;
  card.querySelectorAll('a').forEach(function (a) { a.setAttribute('href', item.href); });
  if (card.getAttribute('data-aorizon-href') !== item.href) {
    card.setAttribute('data-aorizon-href', item.href);
    card.setAttribute('role', 'link'); card.setAttribute('tabindex', '0');
    if (!card.dataset.aorizonClick) {
      card.dataset.aorizonClick = '1';
      card.addEventListener('click', function () { window.location.href = card.getAttribute('data-aorizon-href'); });
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') window.location.href = card.getAttribute('data-aorizon-href'); });
    }
  }
}

function applyServiceColumn(columnName, items) {
  var col = document.querySelector('[data-framer-name="' + columnName + '"]');
  if (!col) return;
  var cards = Array.from(col.querySelectorAll(':scope > [data-framer-name="ServiceItem"]'));
  if (cards.length === 0) return;
  var template = cards[0];
  while (cards.length < items.length) { var clone = template.cloneNode(true); clone.removeAttribute('data-aorizon-href'); delete clone.dataset.aorizonClick; col.appendChild(clone); cards.push(clone); }
  cards.forEach(function (c, i) { if (i < items.length) { c.style.display = ''; setCardText(c, items[i]); } else c.style.display = 'none'; });
}

function updateServices() {
  applyServiceColumn('ServicesListLeft', SERVICES_LEFT);
  applyServiceColumn('ServicesListRight', SERVICES_RIGHT);
}

// Showcase cards link to the practice that builds that kind of system, not to the studio's case pages.
var PROJECT_LINKS = ['research.html', 'technology.html', 'technology.html', 'research.html'];
function updateProjectCards() {
  document.querySelectorAll('[data-framer-name="ProjectCard"]').forEach(function (card, i) {
    card.querySelectorAll('a').forEach(function (a) {
      var href = PROJECT_LINKS[i % PROJECT_LINKS.length];
      if (a.getAttribute('href') !== href) { a.setAttribute('href', href); a.removeAttribute('target'); a.removeAttribute('rel'); }
    });
  });
}

// ---------- process-style pages (how we work, the five practices) ----------

var PAGES = {
  'how-we-work': {
    headline: 'Three phases. One team. No handoff gaps.',
    intro: 'Our process has three stages and each builds on the last. The same team that does the research designs the system and, when needed, builds and ships it.',
    labels: ['Blueprint', 'Build', 'Launch'],
    thesis: 'Research first. Then design and engineering by the same people.',
    paragraph: 'Before we open an editor, we open our research tools. We analyse the problem, the market, the existing systems and the people who will use the result. Then the same team designs every screen and state, formulates the models and builds the system in milestones you can see and run.',
    collage: ['Research', 'Requirements', 'Architecture', 'Milestones', 'Evaluation', 'Handover'],
    g1: { label: 'Blueprint, 1–2 weeks', title: 'Research, strategy and the plan that makes everything else possible.', paragraph: 'We analyse the problem, the market, the existing systems and the people who will use the result. The output is a strategy that answers one question:', question: ['what should this system', 'actually do, and for whom?'], items: ['Problem definition and success criteria', 'Market, competitor and technical landscape analysis', 'Requirements and feature definition', 'Architecture options with a recommendation', 'A strategy brief that explains every decision'] },
    g2: { title: 'Build, 2–6 weeks: design, engineering and the models, by the people who did the research.', paragraph: 'Once the direction is locked we design every screen, state and interaction, formulate the models and algorithms, and build the system in milestones you can see and run. Work is shared early and often through your repositories.', items: ['Working software at every milestone', 'UI and component system where there is an interface', 'Models, evaluation results and training notes', 'Tests, observability and deployment pipeline', 'Progress updates every 48 hours or sooner'] },
    g3: { label: 'Launch, 1–2 weeks', title: 'Production deployment and a handover your team can run without us.', paragraph: 'We deploy to production, document everything your engineers need, train the people who will own it, and agree what happens next: a maintenance plan, a lab retainer, or nothing at all.', phone: 'Handed over, running.', phone2: 'Specs, APIs, model files and documentation, all there.', items: ['Production deployment', 'Developer handover: specs, APIs, model files, annotations', 'Operations runbook', 'Training session for your team', 'Optional maintenance or lab plan'] },
    faq: [['What does it cost?', 'Monthly plans start at ₹75,000 for Indian customers ($1,400 international); fixed-scope projects from ₹80,000 ($1,500). The proposal is free.'], ['How long does it take?', 'The phase durations above are typical. A timeline is agreed for the specific engagement.'], ['Can a project span more than one practice?', 'Yes. Put all of it in the brief. A product build with a launch campaign, or a transaction with technical due diligence, is scoped as one engagement.']]
  },
  'technology': {
    headline: 'Build the system your work actually needs.',
    intro: 'Software engineering and AI & machine learning are the core of Aorizon\'s technology practice. From architecture to production deployment, we build systems that hold up as the business scales.',
    labels: ['Software', 'AI & ML', 'Research tech'],
    thesis: 'Designed from the problem up. Built to run in production.',
    paragraph: 'Enterprise platforms, web and mobile products, LLM integrations, computer vision pipelines, agent workflows and process automation. The same team does the architecture, the build, the deployment and the maintenance plan, so nothing is lost between stages.',
    collage: ['Architecture', 'Web & mobile', 'LLM integration', 'Computer vision', 'Automation', 'Deployment'],
    g1: { label: 'Software engineering', title: 'Enterprise platforms, web and mobile products, APIs and integrations.', paragraph: 'Architecture through deployment, with the maintenance plan written before launch. Working software at each milestone, shared through your repositories and reviewed with the people who will own it. The first question is always:', question: ['what should this system', 'actually do, and for whom?'], items: ['System architecture and technical design', 'Web and mobile applications', 'APIs, integrations and data pipelines', 'Cloud infrastructure and deployment', 'Testing, observability and maintenance'] },
    g2: { title: 'AI & machine learning, evaluated against targets you set.', paragraph: 'Custom LLM integrations, real-time computer vision pipelines, autonomous agent workflows and intelligent process automation, built to scale your operations. Every model is measured on your data against criteria agreed at scoping.', items: ['LLM integration, retrieval and evaluation', 'Agent workflows with guardrails', 'Computer vision in real operating conditions', 'Model training, fine-tuning and optimisation', 'MLOps: monitoring, retraining, cost control'] },
    g3: { label: 'Research technology', title: 'When the technology does not exist yet, the lab builds it.', paragraph: 'R&D as a service through Aorizon Research: feasibility studies, prototypes, algorithm and model formulation, evaluation harnesses, and transfer to production by the same team.', phone: 'Prototype to production.', phone2: 'A model that works in a notebook also works at production cost and latency.', items: ['Feasibility studies and prototypes', 'Algorithm and model formulation', 'Evaluation harnesses and benchmarks', 'Transfer to production by the same team', 'Documented handover your engineers can use'] },
    faq: [['Can we bring an existing system?', 'Yes. Describe its current state and the change you need, and we assess the scope before proposing anything.'], ['Do you work with our engineers or replace them?', 'Either. Many engagements embed with an in-house team; others deliver a complete system with a handover at the end.'], ['What stack do you use?', 'The one the problem needs. We propose it in the scope with the reasons, and avoid lock-in to tools your team cannot maintain.']]
  },
  'consulting': {
    headline: 'Make the next decision with a clearer view.',
    intro: 'Strategic engineering and business advisory: deep learning optimisation, neural network architecture, AI infrastructure, and the commercial decisions around them. Tell us the question and the context, and we tell you what we would do.',
    labels: ['Technology', 'Business', 'Action'],
    thesis: 'Advice you can check, not a deck you have to trust.',
    paragraph: 'Architecture reviews, AI infrastructure and model strategy, technical due diligence, business planning, market research and operating-model questions. Where a decision leads to a build, a campaign, a transaction or an R&D programme, the relevant Aorizon practice can carry it through.',
    collage: ['Architecture review', 'AI infrastructure', 'Due diligence', 'Business plan', 'Market research', 'Roadmap'],
    g1: { label: 'Technology decisions', title: 'What to build, buy or retire.', paragraph: 'Architecture reviews, AI infrastructure and model strategy, and technical due diligence before a commitment. The output is a recommendation with the reasoning behind it and the material you need to act on it. The question underneath is usually:', question: ['what should we build,', 'buy or leave alone?'], items: ['Architecture and codebase reviews', 'Deep learning and neural network optimisation advice', 'AI infrastructure and model strategy', 'Technical due diligence for investors and acquirers', 'Build vs buy analysis and technology roadmaps'] },
    g2: { title: 'Business decisions, answered with evidence.', paragraph: 'Business planning, market research and operating-model questions, answered with evidence you can check rather than a deck you have to trust.', items: ['Business plans and feasibility studies', 'Market and competitor research', 'Operating-model and process review', 'Implementation planning', 'Decision memos and roadmaps'] },
    g3: { label: 'From advice to action', title: 'Where the decision leads, a practice can carry it through.', paragraph: 'Define the question, agree the deliverable in a written proposal, do the work with interviews and analysis shared as it develops, then recommend and hand over. If a recommendation would lead to work by another Aorizon practice, we say so, and you are free to take it elsewhere.', phone: 'Define the question first.', phone2: 'A decision memo, a roadmap or a review, in the form and timing we agree.', items: ['Technology: build the system', 'Marketing: take it to market', 'Investment: transaction preparation and support', 'Research: build what does not exist yet', 'Independent advice, stated as such'] },
    faq: [['How is an engagement scoped?', 'Share the decision, the intended outcome and the timing. We define the work and deliverables in a proposal you approve before anything begins.'], ['Is it independent advice?', 'Yes. If a recommendation would lead to work by another Aorizon practice, we say so, and you are free to take it elsewhere.'], ['What does it cost?', 'Priced per engagement in the proposal. Short reviews are typically fixed-fee; longer programmes run on the monthly plans.']]
  },
  'marketing': {
    headline: 'Help people understand what you offer.',
    intro: 'Aorizon\'s marketing practice helps businesses explain their value and reach their audiences. We begin with who you need to reach and what they need to understand, and build the materials and measurement to match.',
    labels: ['Positioning', 'Materials', 'Measurement'],
    thesis: 'One message, in one voice, measured.',
    paragraph: 'Positioning and messaging, the websites, decks, content and campaigns that carry it, and the analytics that show which channel and which message is doing the work. Built with the technology practice where a site or product is involved.',
    collage: ['Positioning', 'Messaging', 'Website', 'Decks', 'Campaigns', 'Analytics'],
    g1: { label: 'Positioning', title: 'What you do, for whom, and why it is different.', paragraph: 'Written so a new customer understands it in one reading: positioning statement and proof points, messaging by audience, naming and tagline work, pitch narrative. It starts with one question:', question: ['who needs to understand this,', 'and what should they do next?'], items: ['Positioning statement and proof points', 'Messaging by audience', 'Naming and tagline work', 'Pitch narrative', 'One outcome for the first engagement, sequenced'] },
    g2: { title: 'The materials that carry it.', paragraph: 'Websites, decks, content and campaigns that say the same thing in the same voice, built with the technology practice where a site or product is involved.', items: ['Websites and landing pages', 'Investor and sales decks', 'Content and social', 'Campaigns in the right channels', 'Brand materials'] },
    g3: { label: 'Measurement', title: 'Analytics set up so you can change course on evidence.', paragraph: 'Analytics and funnel setup, campaign reporting, experiments and iteration, so you can see which channel and which message is doing the work. Paid campaigns where they are the right channel for the audience; we will say so when they are not.', phone: 'Measured, then changed.', phone2: 'Which channel and which message is doing the work.', items: ['Analytics and funnel setup', 'Campaign reporting', 'Experiments and iteration', 'Paid campaigns where they fit', 'Monthly plan for ongoing content'] },
    faq: [['Can marketing work connect with a website or product project?', 'Yes. Mention both needs and we scope them together across the marketing and technology practices.'], ['Do you run paid campaigns?', 'Where it is the right channel for the audience. We will say so when it is not.'], ['How is it priced?', 'Per engagement, in the proposal. Ongoing content and campaign work can run on a monthly plan.']]
  },
  'investment': {
    headline: 'Support for the decisions behind a transaction.',
    intro: 'Advisory and transaction support around fundraising, mergers and acquisitions, and investment decisions. We prepare, analyse and advise. We are not a fund and we do not hold or manage anyone\'s money.',
    labels: ['Fundraising', 'M&A', 'Decisions'],
    thesis: 'We prepare, analyse and advise. We do not manage money.',
    paragraph: 'Fundraising preparation, investor materials and financial models; valuation analysis and due-diligence coordination on either side of a transaction; feasibility and capital-allocation work for a business deciding where to put its own capital. Specialist appointments are agreed with your legal and tax advisers.',
    collage: ['Business plan', 'Pitch deck', 'Financial model', 'Valuation', 'Due diligence', 'Data room'],
    g1: { label: 'Fundraising', title: 'Materials that stand up to questioning.', paragraph: 'Business plans, investor materials and financial models with stated assumptions, a data room, and a process plan for the raise with investor outreach support. Every page is written against one question:', question: ['what would an investor ask,', 'and what is the answer?'], items: ['Business plan and narrative', 'Pitch deck and information memorandum', 'Financial model with stated assumptions', 'Data room preparation', 'Process plan and investor outreach support'] },
    g2: { title: 'Mergers and acquisitions, on either side.', paragraph: 'Target or buyer identification, valuation analysis, due-diligence coordination including technical diligence, structuring questions with your legal and tax advisers, and post-transaction integration planning.', items: ['Target or buyer identification', 'Valuation analysis', 'Due-diligence coordination, including technical diligence', 'Structuring questions with your advisers', 'Post-transaction integration planning'] },
    g3: { label: 'Investment decisions', title: 'Analysis with the assumptions written down.', paragraph: 'Feasibility studies, market sizing and scenario models, capital allocation analysis and decision memos for a business deciding where to put its own capital. A written mandate sets scope, deliverables, confidentiality and fees before any work begins.', phone: 'Assumptions on the face.', phone2: 'Models and memoranda that state their sources and limitations.', items: ['Feasibility studies', 'Market sizing and scenario models', 'Capital allocation analysis', 'Decision memos', 'Specialist sign-off agreed separately'] },
    faq: [['Does Aorizon operate a venture capital fund?', 'No. Our investment work is advisory and support. We do not run a fund, take deposits, hold client assets or make discretionary investments on anyone\'s behalf.'], ['Can you guarantee a raise or a deal closing?', 'No, and we will not say otherwise. The engagement defines the preparation and support we will provide.'], ['Is this regulated investment advice?', 'We provide corporate-finance advisory and transaction support to businesses. Any required specialist appointments must be agreed before work begins. No regulatory registration is claimed on this site.']]
  },
  'research': {
    headline: 'R&D as a service. You choose how to own the result.',
    intro: 'Startups and businesses bring a problem that needs technology that does not exist yet. Aorizon Research Technology, our lab, investigates and develops it through technology transfer, a joint venture or a custom product engagement. Feasibility, deliverables and ownership terms are agreed for each project.',
    labels: ['Transfer', 'Joint venture', 'Custom'],
    thesis: 'Three ways to take the technology. Same lab, same process.',
    paragraph: 'The difference is who owns what at the end, and how the economics work. Problem and feasibility first, then the ownership model, scope, milestones and commercial terms in writing, then research, prototype, production build and transfer or launch.',
    collage: ['Feasibility', 'Prototype', 'Validation', 'Production build', 'Transfer', 'Launch'],
    g1: { label: 'Technology transfer', title: 'Commission the R&D, then own and operate it in-house.', paragraph: 'A scoped programme with milestones, a prototype and further development subject to review, documentation and training agreed in the scope, and rights assigned or licensed as agreed in writing. It begins with:', question: ['can this be built,', 'and what would it take?'], items: ['Scoped R&D programme with milestones', 'Prototype and further development subject to review', 'Documentation and training agreed in the scope', 'Rights assigned or licensed as agreed in writing', 'Fits a company that will run the technology itself'] },
    g2: { title: 'Joint venture: develop and commercialise it together.', paragraph: 'Each party\'s contribution, responsibilities and commercial terms are negotiated for the venture. Shared roadmap and governance agreed up front, clear terms on IP, revenue and exit. Aorizon is not a fund and does not manage anyone else\'s money.', items: ['Shared roadmap and governance, agreed up front', 'Contributions and ownership negotiated for the venture', 'Clear terms on IP, revenue and exit', 'Ongoing development agreed in the venture plan', 'Fits a founder with a market and no lab'] },
    g3: { label: 'Custom product', title: 'A product built to your requirement, owned outright.', paragraph: 'Requirement captured and agreed before pricing, fixed milestones and timeline, ownership or licensing defined in the agreement, and an optional maintenance or lab retainer afterwards. Fits a defined requirement with a fixed budget and timeline.', phone: 'Prototype first, decide later.', phone2: 'Feasibility and prototype work can run as a fixed-scope project; the model is chosen for the production build.', items: ['Requirement captured and agreed before pricing', 'Fixed milestones and timeline', 'Ownership or licensing defined in the agreement', 'Optional maintenance or lab retainer afterwards', 'Research areas: software systems, AI & ML, research and education systems'] },
    faq: [['Who owns the IP?', 'It depends on the model and is agreed in writing before work starts: assigned or licensed to you under technology transfer, held by the venture under a JV, specified in the agreement for a custom product.'], ['Can we start with a prototype and decide the model later?', 'Yes. Feasibility and prototype work can run as a fixed-scope project first. The ownership model is then chosen for the production build.'], ['How much does it cost?', 'Feasibility work is scoped like a project; research and build are priced per programme. An AI prototype starts from the Core Engineering Sprint plan; the Advanced AI & Research Lab plan suits ongoing programmes.']]
  },
  'contact': {
    headline: 'Tell us what you’re working on.',
    intro: 'contact@aorizon.in. Om Arora +91 99713 89828, Ritik Raj +91 96081 91857, Kartik Bhardwaj +91 87005 53614. Shop No. 4, D-15/29, Sector 3, Rohini, Delhi 110085. Monday to Saturday, Indian Standard Time; replies within one working day.',
    hideSections: ['TeamSection', 'BleuprintSection', 'SparkSection', 'BuildSection', 'BenefitsSection', 'Spark']
  }
};

// Original strings of the process template, in order, so each page's content lands in the right slot.
var TPL = {
  g1items: ['Competitor analysis report, JTBD Framework', 'Product requirements and feature definition', 'User persona and journey mapping', 'Information architecture and sitemap', 'A strategy brief that explains every design decision'],
  g2items: ['Visual concept explorations (2 to 3 directions)', 'A design direction that\'s been validated, not guessed', 'Moodboard with typography, color, and style references', 'Wireframes for key screens', 'Key screens designed at high fidelity'],
  g3items: ['Complete UI design for all screens (mobile, desktop, or both)', 'Figma component library with a design system', 'Developer handoff with specs, assets, and annotations', 'Interactive prototype', 'Framer build (optional, quoted separately)'],
  collage: ['Research', 'Moodboard', 'Design Concepts', 'Wireframes', 'Design system', 'Final result'],
  labels: ['Blueprint', 'Spark', 'Build'],
  faqTitles: ['You talk to the people doing the work.', 'You see progress constantly.', 'Files are always production-ready.'],
  faqDescs: ['No middlemen. The same team researches your market and designs your product.', 'No disappearing for weeks. We share work early and often, so there are no surprises.', 'Developers don’t have to guess. Specs, assets, spacing, and components are all there.']
};

function pageBlocks(c) {
  if (!c) return [];
  var b = [
    ['Process Overview', c.headline],
    ['How we work', c.headline, { sel: 'h1', exact: true }],
    ['three phases: Blueprint, Spark, and Build', c.intro]
  ];
  if (c.hideSections) return b;
  b.push(['handoff gaps', c.thesis]);
  b.push(['Our process has three stages', c.paragraph]);
  c.labels.forEach(function (t, i) { b.push([TPL.labels[i], t, { exact: true }]); });
  c.collage.forEach(function (t, i) { b.push([TPL.collage[i], t, { exact: true }]); });
  b.push(['1-2 weeks', c.g1.label, { exact: true }]);
  b.push(['the plan that makes everything else possible', c.g1.title]);
  b.push(['Before we open Figma', c.g1.paragraph]);
  b.push(['what should this product', c.g1.question[0], { exact: true }]);
  b.push(['actually do, and for whom', c.g1.question[1]]);
  b.push(['Blueprint deliverables', c.labels[0], { exact: true }]);
  b.push(['Spark deliverables', c.labels[1], { exact: true }]);
  b.push(['Build deliverables', c.labels[2], { exact: true }]);
  c.g1.items.forEach(function (t, i) { b.push([TPL.g1items[i], t]); });
  b.push(['the creative exploration that gives your product its identity', c.g2.title]);
  b.push(['This is where research meets creativity', c.g2.paragraph]);
  c.g2.items.forEach(function (t, i) { b.push([TPL.g2items[i], t]); });
  b.push(['2-4 weeks', c.g3.label, { exact: true }]);
  b.push(['everything your developer needs to ship', c.g3.title]);
  b.push(['Once the direction is locked', c.g3.paragraph]);
  b.push(['Fixa.', 'Aorizon.', { exact: true }]);
  b.push(['without overwhelm', c.g3.phone]);
  b.push(['ADHD-friendly planner', c.g3.phone2]);
  c.g3.items.forEach(function (t, i) { b.push([TPL.g3items[i], t]); });
  b.push(['stays constant across every project', 'Common questions.']);
  b.push(['No matter the scope or budget', 'The practical ones. Anything else, ask us.']);
  c.faq.forEach(function (qa, i) { b.push([TPL.faqTitles[i], qa[0], { sel: 'span, p' }]); });
  return b;
}

function pageReplacements(c) {
  if (!c || !c.faq) return [];
  return c.faq.map(function (qa, i) { return { search: TPL.faqDescs[i], replace: qa[1] }; });
}

// ---------- links, menu, titles ----------

function updateLinks() {
  document.querySelectorAll('a').forEach(function (a) {
    var href = a.getAttribute('href') || '', text = collapse(a.textContent);
    if (href === './how-we-work') a.setAttribute('href', 'how-we-work.html');
    if (href.includes('contact@midu.design')) a.setAttribute('href', href.replace('contact@midu.design', 'contact@aorizon.in'));
    if (/^(Research & development|Research \(ART\))$/.test(text) && href !== 'research.html') a.setAttribute('href', 'research.html');
    if (/^(Select Plan|Select|Start an enquiry|Join the waitlist)$/.test(text) && href !== 'contact.html#form') a.setAttribute('href', 'contact.html#form');
  });
  document.querySelectorAll('[data-framer-name="BtnPrimary"]').forEach(function (btn) {
    if (collapse(btn.textContent) === 'Get in touch' && !btn.dataset.aorizonClick) {
      btn.dataset.aorizonClick = '1';
      btn.addEventListener('click', function (e) { e.preventDefault(); e.stopImmediatePropagation(); window.location.href = 'contact.html#form'; }, true);
    }
  });
  var form = document.querySelector('[data-framer-name="FormSection"]');
  if (form && !form.id) form.id = 'form';
  var t = TITLES[PAGE]; if (t && document.title !== t) document.title = t;
}

// The overlay menu lists three items; add the practices so every page is reachable from it.
var MENU_EXTRA = [['Technology', 'technology.html'], ['Consulting', 'consulting.html'], ['Marketing', 'marketing.html'], ['Investment', 'investment.html'], ['How we work', 'how-we-work.html'], ['Contact', 'contact.html']];
function extendMenu() {
  var list = document.querySelector('[data-framer-name="ListWrapper"] [data-framer-name="List"]');
  if (!list || list.dataset.aorizonMenu) return;
  var items = list.querySelectorAll(':scope > div > a[data-framer-name="MenuItem"]');
  if (items.length < 2) return;
  var lastItem = items[items.length - 1].parentElement, lines = list.querySelectorAll(':scope > [data-framer-name="line"]'), line = lines[lines.length - 1];
  list.dataset.aorizonMenu = '1';
  MENU_EXTRA.forEach(function (m) {
    if (line) list.appendChild(line.cloneNode(true));
    var c = lastItem.cloneNode(true), a = c.querySelector('a'), p = c.querySelector('p');
    a.setAttribute('href', m[1]); if (p) p.textContent = m[0];
    list.appendChild(c);
  });
}

// ---------- contact form (Web3Forms) ----------
var WEB3FORMS_ACCESS_KEY = '99a6ca82-1bdf-440a-bb13-45986a296a9c';

function setupContactForm() {
  document.querySelectorAll('form').forEach(function (form) {
    if (form.dataset.aorizonMail) return;
    if (!form.querySelector('input[name="Email"]')) return;
    form.dataset.aorizonMail = '1';
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      var label = form.querySelector('button[type="submit"] .framer-text') || form.querySelector('button[type="submit"]');
      var original = label ? label.textContent : '';
      var setLabel = function (t) { if (label) label.textContent = t; };
      var botFilled = ['website', 'company'].some(function (n) { var el = form.querySelector('[name="' + n + '"]'); return el && el.value.trim() !== ''; });
      if (botFilled) { showThankYou(form); return; }
      setLabel('Sending...');
      var data = new FormData(form);
      data.delete('website'); data.delete('company');
      data.append('access_key', WEB3FORMS_ACCESS_KEY);
      data.append('subject', 'New enquiry - Aorizon website');
      data.append('from_name', 'Aorizon Website');
      try {
        var res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
        var out = await res.json();
        if (!out.success) throw new Error(out.message || 'submission failed');
        showThankYou(form);
      } catch (err) {
        console.error('[Aorizon] Form submission failed:', err);
        setLabel('Failed - please try again');
        setTimeout(function () { setLabel(original); }, 5000);
      }
    }, true);
  });
}

function showThankYou(form) {
  form.reset();
  if (form.nextElementSibling && form.nextElementSibling.classList.contains('aorizon-thankyou')) { form.style.display = 'none'; return; }
  var msg = document.createElement('div');
  msg.className = 'aorizon-thankyou'; msg.setAttribute('role', 'status');
  msg.textContent = 'Thanks. Your enquiry has been sent to contact@aorizon.in.';
  msg.style.cssText = 'padding:48px 24px;text-align:center;font-family:"Switzer Medium","Switzer Medium Placeholder",sans-serif;font-size:24px;font-weight:500;letter-spacing:-0.03em;color:#ffffff;';
  form.style.display = 'none';
  form.parentNode.insertBefore(msg, form.nextSibling);
}

// ---------- run ----------

var textsToHide = ['Design for those who want to become a better version of themselves.', '4/5 slots for June', '3/5 slots for Feb'];
var pageContent = PAGES[PAGE];
var pageBlockList = SHARED_BLOCKS.concat(PAGE === 'index' ? HOME_BLOCKS : pageBlocks(pageContent));
replacements = pageReplacements(pageContent).concat(replacements);

function applyAll() {
  injectHideStyles();
  hideElementsWithText(textsToHide);
  if (pageContent && pageContent.hideSections) hideByName(pageContent.hideSections);
  if (PAGE === 'index') { hideByName(['Trusted by 20+ companies']); updateTools(); hideFaq(HOME_HIDE_FAQ); setFaq(HOME_FAQ); updateServices(); updateProjectCards(); }
  replaceImages();
  replaceText();
  setTextBlocks(pageBlockList);
  updateLinks();
  extendMenu();
  setupContactForm();
}

document.addEventListener('DOMContentLoaded', function () {
  applyAll();
  [500, 1000, 2000, 4000].forEach(function (ms) { setTimeout(applyAll, ms); });
});

var observer = new MutationObserver(function () { applyAll(); });
observer.observe(document.body, { childList: true, subtree: true });
