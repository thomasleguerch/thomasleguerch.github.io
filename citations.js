/* ==========================================================
   citations.js
   ----------------------------------------------------------
   Write anywhere in HTML:

   {{Evans}}
   {{KS}}
   {{legall}}

   Example:

   <p>
     Brownian motion {{legall}} and stochastic calculus {{KS}}.
   </p>

   <section class="references"></section>

   Features:
   - automatic numbering [1], [2], ...
   - repeated refs reuse same number
   - works in normal HTML text
   - references list auto-generated
   - click citation -> reference
   - click ↩ -> back to first in-text citation
   - smooth scrolling
========================================================== */

document.addEventListener("DOMContentLoaded", initCitations);

async function initCitations() {
  document.documentElement.style.scrollBehavior = "smooth";

  let refs = {};

  try {
    const res = await fetch("refs.json");
    refs = await res.json();
  } catch (err) {
    console.error("Could not load refs.json");
    return;
  }

  const order = [];
  const numbers = {};
  const counts = {};

  replaceCitations(document.body, refs, order, numbers, counts);
  buildReferenceSection(refs, order, numbers);
}

/* ==========================================================
   Replace {{key}} in ALL text nodes
========================================================== */

function replaceCitations(root, refs, order, numbers, counts) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        if (
          parent.closest("script") ||
          parent.closest("style") ||
          parent.closest(".references")
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        if (node.nodeValue.includes("{{")) {
          return NodeFilter.FILTER_ACCEPT;
        }

        return NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach(node => {
    const text = node.nodeValue;
    const frag = document.createDocumentFragment();

    let last = 0;
    const regex = /\{\{(.*?)\}\}/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const full = match[0];
      const key = match[1].trim();

      // text before citation
      frag.appendChild(
        document.createTextNode(text.slice(last, match.index))
      );

      // citation
      if (!refs[key]) {
        frag.appendChild(document.createTextNode("[?]"));
      } else {
        if (!numbers[key]) {
          numbers[key] = order.length + 1;
          order.push(key);
        }

        const n = numbers[key];

        counts[key] = (counts[key] || 0) + 1;
        const citeId = `cite-${n}-${counts[key]}`;

        const a = document.createElement("a");
        a.href = `#ref-${n}`;
        a.id = citeId;
        a.className = "cite-link";
        a.textContent = `[${n}]`;

        frag.appendChild(a);
      }

      last = match.index + full.length;
    }

    // remaining text
    frag.appendChild(
      document.createTextNode(text.slice(last))
    );

    node.parentNode.replaceChild(frag, node);
  });
}

/* ==========================================================
   Build bibliography
========================================================== */

function buildReferenceSection(refs, order, numbers) {
  const section = document.querySelector(".references");
  if (!section) return;

  section.innerHTML = `
    <h2>References</h2>
    <ol class="ref-list"></ol>
  `;

  const list = section.querySelector("ol");

  order.forEach(key => {
    const n = numbers[key];
    const ref = refs[key];

    const li = document.createElement("li");
    li.id = `ref-${n}`;

    li.innerHTML = `
      ${formatReference(ref)}
      <a href="#cite-${n}-1" class="back-link">↩</a>
    `;

    list.appendChild(li);
  });
}

/* ==========================================================
   Reference formatting
========================================================== */

function formatReference(ref) {
  const authors = (ref.author || []).join(", ");
  const title = ref.title || "";
  const year = ref.year ? `(${ref.year})` : "";

  if (ref.type === "book") {
    return `${authors}. <em>${title}</em>. ${year}. ${ref.publisher || ""}.`;
  }

  if (ref.type === "article") {
    return `${authors}. "${title}." ${ref.journal || ""}, ${year}.`;
  }

  if (ref.type === "incollection") {
    return `${authors}. "${title}." In <em>${ref.booktitle || ""}</em>, ${year}.`;
  }

  return `${authors}. <em>${title}</em>. ${year}.`;
}