function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    current === "dark" ? "light" : "dark"
  );
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

function setFontSize(size) {
  document.documentElement.style.setProperty('--font-size', size + 'px');
}

let size = 16;

function increaseText() {
  size += 2;
  setFontSize(size);
}

function decreaseText() {
  size -= 2;
  setFontSize(size);
}
