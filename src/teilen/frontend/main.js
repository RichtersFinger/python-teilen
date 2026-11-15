import "./globals.js";

/** Register root component */

import "./components/root.js";

/** bootstrap App logic */

export let configuration;
let root;

async function bootstrap() {
  const r = await fetch("/api/v1/configuration");
  if (!r.ok) {
    alert("Cannot connect to API: " + r.statusText);
    console.error(r);
    return;
  }
  configuration = await r.json();

  root = document.createElement("teilen-root");
  document.getElementById("teilen-root").replaceWith(root);
}

bootstrap();
