// src/content/script.js

console.log("scripts.js loaded")

function toggleDyslexiaFont() {
  const el = document.body;
  const currentFont = el.style.fontFamily;
  if (currentFont.includes("OpenDyslexic")) {
    el.style.fontFamily = "";
  } else {
    el.style.fontFamily = '"OpenDyslexic", sans-serif';
    const link = document.createElement("link");
    link.href = "https://fonts.cdnfonts.com/css/open-dyslexic";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
}

function toggleWordSpacing() {
  const el = document.body;
  const currentSpacing = el.style.wordSpacing;
  el.style.wordSpacing = currentSpacing === "0.3em" ? "" : "0.3em";
}

// Expose them to window so they can be called when injected
window.toggleDyslexiaFont = toggleDyslexiaFont;
window.toggleWordSpacing = toggleWordSpacing;