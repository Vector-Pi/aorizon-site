/*
  Midu Studio Replica Script File
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
    // Check for the Midu Studio Logo image
    if (
      (img.alt && img.alt.includes('Midu Studio Logo')) ||
      (img.src && img.src.includes('HwtHwcHTsWUUbrz9KdjxmWjRe7o'))
    ) {
      img.src = 'logos.png';
      img.srcset = '';
    }
  });
}

// Replace specific text
function replaceText() {
  const replacements = [
    {
      search: 'Explore how Midu has helped businesses elevate their digital presence.',
      replace: 'Explore how Aorizon helps businesses elevate their digital presence.'
    },
    {
      search: 'Midu is a research-driven design studio that treats every project like its own product. We go deep into your market  and your users before designing a single screen.',
      replace: 'Aorizon is a research-driven organisation that treats every project like its own product. We go deep into your market and your users before designing every single screen. The result: Digital experiences that don\'t just look sharp, they perform.'
    },
    {
      search: 'Midu Studio Design Process Overview',
      replace: 'Aorizon Design Process Overview'
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
    }
  ];

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        for (const rep of replacements) {
          if (node.textContent && node.textContent.includes(rep.search)) {
            return NodeFilter.FILTER_ACCEPT;
          }
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    let text = node.textContent;
    for (const rep of replacements) {
      if (text && text.includes(rep.search)) {
        // Use a global replace to handle multiple occurrences
        text = text.split(rep.search).join(rep.replace);
      }
    }
    node.textContent = text;
  }
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
    document.title = 'Aorizon Design Process';
  } else if (filename === 'privacy-policy.html' || filename === 'privacy-policy') {
    document.title = 'Privacy Policy';
  } else if (filename === 'terms-of-use.html' || filename === 'terms-of-use') {
    document.title = 'Terms of use';
  }
}

// Aorizon services — enforced client-side because the remote Framer bundle
// rebuilds the services list on hydration, discarding any SSR edits.
// Left/right columns mirror the "Our tools & your brand" section layout.
const SERVICES_LEFT = [
  { title: 'Software Engineering', label: 'Tech',
    desc: 'Every line of code is optimized. From architecture design to production deployment, we build robust enterprise solutions that drive business scaling.' },
  { title: 'AI & Machine Learning', label: 'Tech',
    desc: 'Custom LLM integrations, real-time computer vision pipelines, autonomous agent workflows, and intelligent process automation designed to scale your operations.' },
  { title: 'Development Agency', label: 'Tech',
    desc: 'End-to-end product development. We design, build, and ship web, mobile, and enterprise software — turning ambitious ideas into production-ready systems.' },
  { title: 'Investment Consulting', label: 'Consulting',
    desc: 'Strategic guidance for capital decisions. We help you evaluate opportunities, structure deals, and align technology bets with long-term returns.' },
  { title: 'Risk Advisory & Investment Analysis', label: 'Risk & Investment Analysis',
    desc: 'Clarity before you commit. We assess risk, model scenarios, and deliver rigorous analysis so every investment decision is grounded in data.' },
  { title: 'National Scale Exams', label: 'Education',
    desc: 'Assessment infrastructure built for scale. We design and deliver secure, reliable platforms that power examinations for entire nations.' }
];
const SERVICES_RIGHT = [
  { title: 'Consulting', label: 'Consulting',
    desc: 'Strategic engineering advisory in Quantum Machine Learning, Deep Learning optimizations, neural network design, and AI infrastructure architectures.' },
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

// Initial check
const textsToHide = [
  'Design for those who want to become a better version of themselves.',
  '4/5 slots for June'
];
document.addEventListener('DOMContentLoaded', () => {
  hideElementsWithText(textsToHide);
  replaceImages();
  replaceText();
  updateLinksAndEmails();
  updateServices();

  // Fallback to set title after a delay
  setTimeout(updateLinksAndEmails, 1000);
  setTimeout(updateLinksAndEmails, 2000);
  setTimeout(updateServices, 1000);
  setTimeout(updateServices, 2000);
});

// Watch for dynamic changes (Framer hydration)
const observer = new MutationObserver(() => {
  hideElementsWithText(textsToHide);
  replaceImages();
  replaceText();
  updateLinksAndEmails();
  updateServices();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
