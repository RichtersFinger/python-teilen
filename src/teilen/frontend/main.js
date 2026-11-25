import "./globals.js";
import { configuration } from "./data/configuration.js";

/** Register root component */

import "./components/root.js";

/** bootstrap App logic */

async function bootstrap() {
  const r = await fetch("/api/v1/configuration");
  if (!r.ok) {
    alert("Cannot connect to API: " + r.statusText);
    console.error(r);
    return;
  }
  Object.assign(configuration, await r.json());

  const root = document.createElement("teilen-root");
  document.getElementById("teilen-root").replaceWith(root);
}

bootstrap();
