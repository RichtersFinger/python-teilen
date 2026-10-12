/** Register components */

import "./components/base-spinner.js";
import "./components/teilen-main.js";

/** App logic */

let configuration;
let main;

async function bootstrap() {
  const r = await fetch("/api/v1/configuration");
  if (!r.ok) {
    alert("Cannot connect to API: " + r.statusText);
    console.error(r);
    return;
  }
  configuration = await r.json();

  main = document.createElement("teilen-main");
  main.style.flex = 1;
  main.style.display = "flex";
  main.style.animation= "fadein 0.1s linear";
  document.getElementById("teilen-main").replaceChildren(main);
}

window.addEventListener("load", bootstrap);
