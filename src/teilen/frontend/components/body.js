import Base from "./base.js";
import { formatTooltip } from "../lib.js";

import "./location-indicator.js";
import "./selection-indicator.js";
import "./spinner.js";
import "./item.js";

import { ItemsActions } from "../data/items.js";
import { LocationStore, LocationSubscriptions } from "../data/location.js";

const innerBottom = "innerBottom";

class Body extends Base {
  static css = css`
    :host {
      display: flex;
      flex: 1;
    }
    .outer {
      width: 100%;
      max-height: 82vh;
      padding: var(--size-3);
      background-color: var(--gray-0);
      border-radius: var(--size-3);
      display: flex;
      flex-direction: column;
      gap: var(--size-4);
      align-items: start;
      justify-content: start;
    }
    .inner-top {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .inner-bottom {
      width: 100%;
      height: 100%;
      padding: var(--size-1);
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(var(--size-24), 0.1fr));
      grid-auto-rows: max-content;
      gap: var(--size-3);
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <div class="outer">
        <div class="inner-top">
          <teilen-location-indicator></teilen-location-indicator>
          <teilen-selection-indicator></teilen-selection-indicator>
        </div>
        <div id="${innerBottom}" class="inner-bottom">
          <teilen-spinner></teilen-spinner>
        </div>
      </div>
    `;

    this.shadowRoot
      .getElementById(innerBottom)
      .addEventListener("click", (e) => {
        if (!e.ctrlKey) ItemsActions.clearSelection();
      });
  }

  onLocationChange = () => {
    this.updateBody();
  };

  async updateBody() {
    const location = LocationStore.location.join("/");
    const response = await fetch(
      "/api/v1/items?" +
        new URLSearchParams({ path: encodeURIComponent(location) }),
    );
    if (!response.ok) {
      alert(`Failed to look up location '${location}'`);
      return;
    }
    const data = await response.json();

    // TODO: sort items...

    const innerElement = this.shadowRoot.getElementById(innerBottom);
    const children = data.data.items
      .map((item) => {
        let _element;
        _element = document.createElement("teilen-item");
        _element.id = item.name;
        _element.kind = item.kind;
        _element.title = formatTooltip(item);
        if (!_element) return undefined;

        return _element;
      })
      .filter(Boolean);

    innerElement.replaceChildren(...children);
  }

  connectedCallback() {
    this.updateBody();
    LocationSubscriptions.subscribe(this.onLocationChange);
  }

  disconnectedCallback() {
    LocationSubscriptions.unsubscribe(this.onLocationChange);
  }
}

export default Body;

customElements.define("teilen-body", Body);
