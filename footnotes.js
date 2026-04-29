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