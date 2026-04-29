const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

// Toggle theme
function toggleTheme() {
  const root = document.documentElement;

  const isDark = root.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// 📦 Load components (header/footer)
function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}

// load shared parts
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/header.html");
  loadComponent("footer", "components/footer.html");
});

// Apply saved font size on every page load
const savedSize = localStorage.getItem("fontSize");

if (savedSize) {
  document.documentElement.style.setProperty("--font-size", savedSize + "px");
}

// Increase font size
function increaseText() {
  let size = parseInt(localStorage.getItem("fontSize") || "16");
  size += 2;

  document.documentElement.style.setProperty("--font-size", size + "px");
  localStorage.setItem("fontSize", size);
}

// Decrease font size
function decreaseText() {
  let size = parseInt(localStorage.getItem("fontSize") || "16");
  size -= 2;

  document.documentElement.style.setProperty("--font-size", size + "px");
  localStorage.setItem("fontSize", size);
}

// footnotes
function generateFootnotes() {
  const notes = document.querySelectorAll('.footnote');
  const list = document.getElementById('footnote-list');

  notes.forEach((note, index) => {
    const number = index + 1;

    // Create reference
    const ref = document.createElement('sup');
    ref.innerHTML = `<a href="#fn${number}" id="ref${number}">[${number}]</a>`;
    note.parentNode.insertBefore(ref, note);

    // Create footnote
    const li = document.createElement('li');
    li.id = `fn${number}`;
    li.innerHTML = `${note.innerHTML} <a href="#ref${number}">↩</a>`;
    list.appendChild(li);

    // Remove original span
    note.remove();
  });
}

document.addEventListener('DOMContentLoaded', generateFootnotes);