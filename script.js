/*
  Midu Studio Replica Script File
  All interactions, custom animations, and layout triggers are loaded inline and from external ESM scripts directly in the HTML pages.
*/

// Hide specific text elements
function hideElementsWithText(text) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (node.textContent && node.textContent.includes(text)) {
          return NodeFilter.FILTER_ACCEPT;
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

// Initial check
document.addEventListener('DOMContentLoaded', () => {
  hideElementsWithText('Design for those who want to become a better version of themselves.');
});

// Watch for dynamic changes (Framer hydration)
const observer = new MutationObserver(() => {
  hideElementsWithText('Design for those who want to become a better version of themselves.');
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
