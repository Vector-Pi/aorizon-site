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
  if (path.includes('index.html') || path === '/' || path === '/index.html' || path.endsWith('/aorizon-research/') || path.endsWith('/aorizon-research')) {
    document.title = 'Aorizon';
  } else if (path.includes('how-we-work.html')) {
    document.title = 'Aorizon Design Process';
  } else if (path.includes('privacy-policy.html')) {
    document.title = 'Privacy Policy';
  } else if (path.includes('terms-of-use.html')) {
    document.title = 'Terms of use';
  }
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
  
  // Fallback to set title after a delay
  setTimeout(updateLinksAndEmails, 1000);
  setTimeout(updateLinksAndEmails, 2000);
});

// Watch for dynamic changes (Framer hydration)
const observer = new MutationObserver(() => {
  hideElementsWithText(textsToHide);
  replaceImages();
  replaceText();
  updateLinksAndEmails();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
