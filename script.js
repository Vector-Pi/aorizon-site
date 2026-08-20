/*
  Product Lab Replica Script File
  All interactions, custom animations, and layout triggers are loaded inline and from external ESM scripts directly in the HTML pages.
*/

// Hide specific text elements
function hideElementsWithText(texts) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        for (const text of texts) {
          if (node.textContent && node.textContent.includes(text)) {
            return NodeFilter.FILTER_ACCEPT;
          }
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  const nodesToHide = [];
  let node;
  while ((node = walker.nextNode())) {
    nodesToHide.push(node.parentElement);
  }

  nodesToHide.forEach(el => {
    if (el) {
      el.style.display = 'none';
      // Also hide parent elements to be safe
      let parent = el.parentElement;
      while (parent) {
        // Check if parent still has other visible content before hiding
        const hasVisibleSiblings = Array.from(parent.children).some(
          child => child !== el && child.style.display !== 'none'
        );
        if (!hasVisibleSiblings) {
          parent.style.display = 'none';
        }
        parent = parent.parentElement;
      }
    }
  });
}

function injectHideStyles() {
  if (document.getElementById('aorizon-hide-styles')) return;
  const style = document.createElement('style');
  style.id = 'aorizon-hide-styles';
  style.textContent = [
    '[data-framer-name="UI/UX"] { display: none !important; }',
    '[data-framer-name="ServicesListContainer"] a,',
    '[data-framer-name="ServicesListContainer"] [data-highlight="true"],',
    '[data-framer-name="ServicesListContainer"] [tabindex="0"] {',
    '  cursor: default !important;',
    '  pointer-events: none !important;',
    '}',
    '[data-framer-name="ServicesListContainer"] [tabindex] {',
    '  outline: none !important;',
    '}'
  ].join('\n');
  document.head.appendChild(style);
}

function hideFramerComponents() {
  const names = ['UI/UX'];
  names.forEach(name => {
    document.querySelectorAll('[data-framer-name="' + name + '"]').forEach(el => {
      if (el.style.display !== 'none') {
        el.style.display = 'none';
      }
    });
  });
}

var servicesCaptureInstalled = false;
function installServicesClickBlocker() {
  if (servicesCaptureInstalled) return;
  servicesCaptureInstalled = true;

  function isInsideServices(target) {
    if (!target || !target.closest) return false;
    var container = target.closest('[data-framer-name="ServicesListContainer"]');
    return !!container;
  }

  var eventsToBlock = ['click', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'keydown', 'keyup'];
  eventsToBlock.forEach(function(evt) {
    document.addEventListener(evt, function(e) {
      if (isInsideServices(e.target)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  });
}

function disableServicesList() {
  installServicesClickBlocker();
  var container = document.querySelector('[data-framer-name="ServicesListContainer"]');
  if (!container) return;

  container.querySelectorAll('a').forEach(function(a) {
    a.removeAttribute('href');
    a.removeAttribute('target');
    a.removeAttribute('rel');
    a.style.pointerEvents = 'none';
    a.style.cursor = 'default';
    a.setAttribute('data-aorizon-disabled-link', '1');
  });

  container.querySelectorAll('[tabindex]').forEach(function(el) {
    el.removeAttribute('tabindex');
  });

  container.querySelectorAll('[data-highlight]').forEach(function(el) {
    el.removeAttribute('data-highlight');
  });

  container.querySelectorAll('[data-framer-name="Variant 1"], [data-framer-name="ServiceItem"]').forEach(function(el) {
    el.style.cursor = 'default';
    el.style.pointerEvents = 'none';
  });
}

// Replace specific images
function replaceImages() {
  // Find all img tags
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Check for the desktop mockup image
    if (
      (img.alt && img.alt.includes('Desktop mockup displaying Fixa app hero screen')) ||
      (img.src && img.src.includes('u6jfgsjP6E6Lpm0j1zcz3Pd1kyY'))
    ) {
      img.src = 'background.png';
      img.srcset = '';
    }
    // Check for the Midu Logo image
    if (
      (img.alt && img.alt.includes('Midu Studio Logo')) ||
      (img.src && img.src.includes('HwtHwcHTsWUUbrz9KdjxmWjRe7o'))
    ) {
      img.src = 'logos.png';
      img.srcset = '';
    }
  });
}

// Replace specific text + image alt attributes
function replaceText() {
  const replacements = [
    {
      search: 'Explore how Midu has helped businesses elevate their digital presence.',
      replace: 'Explore how Aorizon helps businesses elevate their digital presence.'
    },
    {
      search: 'Midu is a research-driven design studio that treats every project like its own product. We go deep into your market  and your users before designing a single screen.',
      replace: 'Aorizon is a research-driven product lab that treats every project like its own product. We go deep into your market  and your users before building a single screen.'
    },
    {
      search: 'Aorizon is a research-driven organisation that treats every project like its own product. We go deep into your market and your users before designing every single screen. The result: Digital experiences that don\'t just look sharp, they perform.',
      replace: 'Aorizon is a research-driven product lab that treats every project like its own product. We go deep into your market  and your users before building a single screen.'
    },
    {
      search: 'Midu Studio Design Process Overview',
      replace: 'Aorizon Product Development Process Overview'
    },
    {
      search: 'Aorizon Design Process Overview',
      replace: 'Aorizon Product Development Process Overview'
    },
    {
      search: 'From research to launch in three phases: Blueprint, Spark, and Build. See how Midu Studio turns ideas into polished digital products with a research-first approach.',
      replace: 'From research to launch in three phases: Blueprint, Spark, and Build. See how Aorizon turns ideas into polished digital products with a research-first approach.'
    },
    {
      search: 'Midu Studio',
      replace: 'Aorizon'
    },
    {
      search: 'Midu',
      replace: 'Aorizon'
    },
    {
      search: 'Aorizon is a research-driven design studio that treats every project like its own product. We go deep into your market  and your users before designing a single screen.',
      replace: 'Aorizon is a research-driven product lab that treats every project like its own product. We go deep into your market  and your users before building a single screen.'
    },
    {
      search: 'UI/UX & Web Design Studio for Startups - Aorizon Studio',
      replace: 'Software & AI Product Development Lab - Aorizon'
    },
    {
      search: 'Aorizon designs and builds advanced enterprise software, AI systems, and research technology - from concept to launch.',
      replace: 'Aorizon builds advanced enterprise software, AI systems, and research technology - from concept to launch.'
    },
    {
      search: 'We design products that live in the digital world: intuitive UX, sharp UI, immersive 3D and motion. From research to launch, we craft bold, seamless experiences.',
      replace: 'We build products that live in the digital world: intuitive UX, sharp UI, immersive 3D and motion. From research to launch, we craft bold, seamless experiences.'
    },
    {
      search: 'We design intuitive interfaces for web and mobile products, from first wireframe to development-ready files.',
      replace: 'We build intuitive interfaces for web and mobile products, from first wireframe to development-ready files.'
    },
    {
      search: 'design',
      replace: 'projects',
      exact: true
    },
    {
      search: 'Web design',
      replace: 'Web products'
    },
    {
      search: 'App design',
      replace: 'App development'
    },
    {
      search: '3D design',
      replace: '3D & motion'
    },
    {
      search: 'Not just talented designers',
      replace: 'Not just talented builders'
    },
    {
      search: 'turned them into professional designs',
      replace: 'turned them into polished products'
    },
    {
      search: 'From architecture design to production deployment',
      replace: 'From architecture to production deployment'
    },
    {
      search: 'intelligent process automation designed to scale your operations',
      replace: 'intelligent process automation built to scale your operations'
    },
    {
      search: 'neural network design, and AI infrastructure architectures',
      replace: 'neural network architecture, and AI infrastructure solutions'
    },
    {
      search: 'Aorizon Studio - design and development studio brand image',
      replace: 'Aorizon - product development company brand image'
    },
    {
      search: 'ART Research Platform AI app design by Aorizon Studio',
      replace: 'ART Research Platform AI product built by Aorizon'
    },
    {
      search: 'Enterprise Platform neobank UX UI design by Aorizon Studio',
      replace: 'Enterprise Platform neobank UX UI built by Aorizon'
    },
    {
      search: 'Cognitive AI Suite bank neobank UX UI design by Aorizon Studio',
      replace: 'Cognitive AI Suite bank neobank UX UI built by Aorizon'
    },
    {
      search: 'Quantum Neural Optimizer pet care app design by Aorizon Studio',
      replace: 'Quantum Neural Optimizer pet care product built by Aorizon'
    },
    {
      search: '2026&nbsp;Aorizon Studio,',
      replace: '2026&nbsp;Aorizon,'
    },
    {
      search: 'Software & AI Product Development Studio - Aorizon',
      replace: 'Software & AI Product Development Lab - Aorizon'
    },
    {
      search: 'Aorizon Studio',
      replace: 'Aorizon'
    },
    {
      search: '$3000',
      replace: '$299'
    }
    ,
    {
      search: '$5000',
      replace: '$499'
    }
    ,
    {
      search: '$3500',
      replace: '$699'
    }
    ,
    {
      search: '/ per month',
      replace: '/ per project'
    }
    ,
    {
      search: 'per month',
      replace: 'per project'
    }
    ,
    {
      search: '3-5k',
      replace: 'below $499'
    }
    ,
    {
      search: '5-10k',
      replace: '$499-899'
    }
    ,
    {
      search: '10k+',
      replace: '$899+'
    }
  ];

  const applyReplacements = (text) => {
    if (!text) return text;
    let out = text;
    for (const rep of replacements) {
      if (out.includes(rep.search)) {
        if (rep.exact && out.trim() !== rep.search) continue;
        out = out.split(rep.search).join(rep.replace);
      }
    }
    return out;
  };

  // Replace text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        return node.textContent && replacements.some(
          (rep) => node.textContent.includes(rep.search)
        ) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    const newText = applyReplacements(node.textContent);
    if (node.textContent !== newText) node.textContent = newText;
  }

  // Replace image alt attributes
  document.querySelectorAll('img[alt]').forEach(img => {
    const newAlt = applyReplacements(img.alt);
    if (img.alt !== newAlt) img.alt = newAlt;
  });

  // Replace meta title / description tags (defense against late hydration)
  document.querySelectorAll('title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]').forEach(el => {
    if (el.tagName === 'TITLE') {
      const t = applyReplacements(el.textContent);
      if (el.textContent !== t) el.textContent = t;
    } else if (el.content) {
      const c = applyReplacements(el.content);
      if (el.content !== c) el.content = c;
    }
  });
}

// Update links and emails
function updateLinksAndEmails() {
  // Find all links and update hrefs
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (link.getAttribute('href') === './how-we-work') {
      link.setAttribute('href', 'how-we-work.html');
    }
    // Update mailto links
    const href = link.getAttribute('href');
    if (href && href.includes('contact@midu.design')) {
      link.setAttribute('href', href.replace('contact@midu.design', 'contact@aorizon.in'));
    }
  });
  
  // Also update text content of email addresses
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (node.textContent && node.textContent.includes('contact@midu.design')) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );
  
  let node;
  while ((node = walker.nextNode())) {
    node.textContent = node.textContent.split('contact@midu.design').join('contact@aorizon.in');
  }
  
  // Update page titles explicitly
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  if (filename === 'index.html' || filename === '' || filename === '/' || filename === 'index') {
    document.title = 'Aorizon';
  } else if (filename === 'how-we-work.html' || filename === 'how-we-work') {
    document.title = 'Aorizon Product Development Process';
  } else if (filename === 'privacy-policy.html' || filename === 'privacy-policy') {
    document.title = 'Privacy Policy';
  } else if (filename === 'terms-of-use.html' || filename === 'terms-of-use') {
    document.title = 'Terms of use';
  }
}

// Aorizon services - enforced client-side because the remote Framer bundle
// rebuilds the services list on hydration, discarding any SSR edits.
// Left/right columns mirror the "Our tools & your brand" section layout.
const SERVICES_LEFT = [
  { title: 'Software Engineering', label: 'Tech',
    desc: 'Every line of code is optimized. From architecture to production deployment, we build robust enterprise solutions that drive business scaling.' },
  { title: 'AI & Machine Learning', label: 'Tech',
    desc: 'Custom LLM integrations, real-time computer vision pipelines, autonomous agent workflows, and intelligent process automation built to scale your operations.' },
  { title: 'Product Development', label: 'Tech',
    desc: 'End-to-end product development. We build and ship web, mobile, and enterprise software - turning ambitious ideas into production-ready systems.' },
  { title: 'Investment Consulting', label: 'Consulting',
    desc: 'Strategic guidance for capital decisions. We help you evaluate opportunities, structure deals, and align technology bets with long-term returns.' },
  { title: 'Risk Advisory & Investment Analysis', label: 'Risk & Investment Analysis',
    desc: 'Clarity before you commit. We assess risk, model scenarios, and deliver rigorous analysis so every investment decision is grounded in data.' },
  { title: 'National Scale Exams', label: 'Education',
    desc: 'Assessment infrastructure built for scale. We build and deliver secure, reliable platforms that power examinations for entire nations.' }
];
const SERVICES_RIGHT = [
  { title: 'Consulting', label: 'Consulting',
    desc: 'Strategic engineering advisory in Quantum Machine Learning, Deep Learning optimizations, neural network architecture, and AI infrastructure solutions.' },
  { title: 'Research Technology (ART)', label: 'Tech',
    desc: 'Our specialized research division focusing on fundamental AI research, academic publications, technical patents, and experimental products.' },
  { title: 'R&D & Prototyping Services', label: 'Tech',
    desc: 'From concept to working prototype. We de-risk new ideas fast, validating technology and product direction before full-scale investment.' },
  { title: 'Marketing & Business Development', label: 'Marketing / Business Development',
    desc: 'Growth engineered end to end. We build the positioning, campaigns, and partnerships that take products to market and open new revenue channels.' },
  { title: 'Building OS for Researchers & Labs', label: 'Education',
    desc: 'Operating systems for discovery. We build the digital infrastructure that helps researchers and labs run, collaborate, and scale their work.' }
];

function setCardText(card, item) {
  const h3 = card.querySelector('h3');
  if (h3 && h3.textContent !== item.title) h3.textContent = item.title;
  const label = card.querySelector('.framer-7apetj .framer-text');
  if (label && label.textContent !== item.label) label.textContent = item.label;
  const desc = card.querySelector('.framer-kkdlfx .framer-text');
  if (desc && desc.textContent !== item.desc) desc.textContent = item.desc;
}

function applyServiceColumn(columnName, items) {
  const col = document.querySelector('[data-framer-name="' + columnName + '"]');
  if (!col) return;
  let cards = Array.from(col.querySelectorAll(':scope > [data-framer-name="ServiceItem"]'));
  if (cards.length === 0) return; // Framer hasn't rendered the list yet
  const template = cards[0];
  // Add cards until we have one per desired service (clone the first rendered card).
  while (cards.length < items.length) {
    const clone = template.cloneNode(true);
    clone.setAttribute('data-aorizon-extra', '1');
    col.appendChild(clone);
    cards.push(clone);
  }
  items.forEach((item, i) => setCardText(cards[i], item));
}

function updateServices() {
  applyServiceColumn('ServicesListLeft', SERVICES_LEFT);
  applyServiceColumn('ServicesListRight', SERVICES_RIGHT);
}

// Contact form -> email delivery (replaces Framer's form backend).
// Submissions are emailed to contact@aorizon.in via Web3Forms.
//
// SETUP (one time): create a free access key at https://web3forms.com using the
// email contact@aorizon.in (Web3Forms sends every submission to the address the
// key is registered to), then paste it below.
const WEB3FORMS_ACCESS_KEY = '99a6ca82-1bdf-440a-bb13-45986a296a9c';

function setupContactForm() {
  document.querySelectorAll('form').forEach(form => {
    if (form.dataset.aorizonMail) return;                     // already wired
    if (!form.querySelector('input[name="Email"]')) return;   // not the contact form
    form.dataset.aorizonMail = '1';

    // Capture phase + stopImmediatePropagation blocks Framer's own submit handler,
    // so the data goes to email instead of Framer's backend. Native "required"
    // validation still runs first, so this only fires when the form is valid.
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const label = form.querySelector('button[type="submit"] .framer-text')
                 || form.querySelector('button[type="submit"]');
      const original = label ? label.textContent : '';
      const setLabel = (t) => { if (label) label.textContent = t; };

      // Honeypots: if a bot filled these hidden fields, pretend success and stop.
      const botFilled = ['website', 'company'].some(n => {
        const el = form.querySelector('[name="' + n + '"]');
        return el && el.value.trim() !== '';
      });
      if (botFilled) { showThankYou(form); return; }

      if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        console.error('[Aorizon] Set WEB3FORMS_ACCESS_KEY in script.js to receive form emails.');
        setLabel('Setup needed');
        setTimeout(() => setLabel(original), 4000);
        return;
      }

      setLabel('Sending...');
      const data = new FormData(form);
      data.delete('website');
      data.delete('company');
      data.append('access_key', WEB3FORMS_ACCESS_KEY);
      data.append('subject', 'New project inquiry - Aorizon website');
      data.append('from_name', 'Aorizon Website');

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        const out = await res.json();
        if (!out.success) throw new Error(out.message || 'submission failed');
        showThankYou(form);
      } catch (err) {
        console.error('[Aorizon] Form submission failed:', err);
        setLabel('Failed - please try again');
        setTimeout(() => setLabel(original), 5000);
      }
    }, true);
  });
}

// Replace the form with a "Thanks for reaching out!" confirmation once submitted.
function showThankYou(form) {
  form.reset();
  if (form.nextElementSibling && form.nextElementSibling.classList.contains('aorizon-thankyou')) {
    form.style.display = 'none';
    return;
  }
  const msg = document.createElement('div');
  msg.className = 'aorizon-thankyou';
  msg.setAttribute('role', 'status');
  msg.textContent = 'Thanks for reaching out!';
  msg.style.cssText = 'padding:48px 24px;text-align:center;' +
    'font-family:"Switzer Medium" ,"Switzer Medium Placeholder",sans-serif;' +
    'font-size:24px;font-weight:500;letter-spacing:-0.03em;color:#ffffff;';
  form.style.display = 'none';
  form.parentNode.insertBefore(msg, form.nextSibling);
}

// Initial check
const textsToHide = [
  'Design for those who want to become a better version of themselves.',
  '4/5 slots for June'
];
document.addEventListener('DOMContentLoaded', () => {
  injectHideStyles();
  installServicesClickBlocker();
  disableServicesList();
  hideFramerComponents();
  hideElementsWithText(textsToHide);
  replaceImages();
  replaceText();
  updateLinksAndEmails();
  updateServices();
  setupContactForm();

  // Fallback to set title after a delay
  setTimeout(updateLinksAndEmails, 1000);
  setTimeout(updateLinksAndEmails, 2000);
  setTimeout(updateServices, 1000);
  setTimeout(updateServices, 2000);
  setTimeout(setupContactForm, 1000);
  setTimeout(setupContactForm, 2000);
  setTimeout(hideFramerComponents, 1000);
  setTimeout(hideFramerComponents, 2000);
  setTimeout(hideFramerComponents, 4000);
  setTimeout(disableServicesList, 1000);
  setTimeout(disableServicesList, 2000);
  setTimeout(disableServicesList, 4000);
  setTimeout(replaceText, 500);
  setTimeout(replaceText, 1000);
  setTimeout(replaceText, 2000);
  setTimeout(replaceText, 4000);
  setTimeout(hideElementsWithText.bind(null, textsToHide), 1000);
  setTimeout(hideElementsWithText.bind(null, textsToHide), 2000);
  setTimeout(hideElementsWithText.bind(null, textsToHide), 4000);
});

// Watch for dynamic changes (Framer hydration)
const observer = new MutationObserver(() => {
  injectHideStyles();
  installServicesClickBlocker();
  disableServicesList();
  hideFramerComponents();
  hideElementsWithText(textsToHide);
  replaceImages();
  replaceText();
  updateLinksAndEmails();
  updateServices();
  setupContactForm();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
