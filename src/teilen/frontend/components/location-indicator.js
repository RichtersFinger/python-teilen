import { LocationActions, LocationSubscriptions } from "../data/location.js";
import Base from "./base.js";

import "./icon-home.js";

import { LocationStore } from "../data/location.js";

const idHome = "home";
const idInner = "inner";

class Location extends Base {
  static css = css`
    .outer {
      user-select: none;
      width: 100%;
      height: var(--size-6);
      display: flex;
      flex-direction: row;
      align-items: start;
      justify-content: start;
      font-weight: bold;
      font-size: var(--size-5);
      gap: var(--size-1);
    }
    .inner {
      translate: 0 var(--size-1);
      display: flex;
      flex-direction: row;
      gap: var(--size-1);
      flex-wrap: wrap;
    }
    .segment {
      cursor: pointer;
      flex-shrink: 0;
      white-space: nowrap;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <div class="outer">
        <teilen-home-icon
          id="${idHome}"
          class="segment"
          size="6"
          stroke-width="2.4"
        ></teilen-home-icon>
        <div id="${idInner}" class="inner">
          <div></div>
        </div>
      </div>
    `;

    this.shadowRoot
      .getElementById(idHome)
      .addEventListener("click", LocationActions.clearPath);
  }

  onLocationChange = () => {
    const segments = [];
    const currentLocation = [];
    for (const s of LocationStore.location) {
      currentLocation.push(s);
      const separator = document.createElement("span");
      separator.innerText = "/";
      const segment = document.createElement("span");
      segment.classList.add("segment");
      segment.innerText = s;
      let navigationTarget = [...currentLocation];
      segment.addEventListener("click", () =>
        LocationActions.navigateAbsolute(navigationTarget),
      );

      segments.push(separator, segment);
    }
    this.shadowRoot.getElementById(idInner).replaceChildren(...segments);
  };

  connectedCallback() {
    LocationSubscriptions.subscribe(this.onLocationChange);
  }

  disconnectedCallback() {
    LocationSubscriptions.unsubscribe(this.onLocationChange);
  }
}

export default Location;

customElements.define("teilen-location-indicator", Location);
