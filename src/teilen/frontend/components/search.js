import Base from "./base.js";

import "./icon-search.js";

import { BodySingleton } from "../singletons.js";
import { LocationSubscriptions } from "../data/location.js";

const attributeDisabled = "disabled";

const idOuter = "outer";
const idInput = "input";

class Search extends Base {
  static css = css`
    .outer {
      height: var(--size-10);
      background-color: var(--gray-0);
      border-radius: var(--size-2);
      border: 1px solid var(--gray-20);
      padding: var(--size-2);
      display: inline-flex;
      align-items: center;
      gap: var(--size-2);
      outline: none;
      width: 100%;
      box-sizing: border-box;
      cursor: text;
    }
    .outer:focus-within:not(.disabled) {
      box-shadow: var(--size-05) var(--size-05) var(--size-1) rgba(0, 0, 0, 0.2);
    }
    .disabled {
      cursor: not-allowed;
      color: var(--gray-30);
    }
    .icon {
      color: var(--gray-60);
    }
    input {
      border: none;
      background: none;
      outline: none;
      font: inherit;
      color: inherit;
      width: 100%;
      padding: 0;
    }
    input:disabled {
      cursor: not-allowed;
    }
  `;

  static observedAttributes = [attributeDisabled];

  attributeChangedCallback(name, _, newValue) {
    if (name === attributeDisabled) {
      const input = this.shadowRoot.getElementById("input");
      if (newValue !== null) {
        input.setAttribute("disabled", "");
      } else {
        input.removeAttribute("disabled");
      }
    }
  }

  constructor() {
    super();

    const isDisabled = this.hasAttribute(attributeDisabled) ? "disabled" : "";
    this.shadowRoot.innerHTML = html`
      <div id="${idOuter}" class="outer ${isDisabled ? "disabled" : ""}">
        <teilen-search-icon class="icon"></teilen-search-icon>
        <input id="${idInput}" type="text" placeholder="Search ..." ${isDisabled} />
      </div>
    `;

    const outerEl = this.shadowRoot.getElementById(idOuter);
    const inputEl = this.shadowRoot.getElementById(idInput);

    outerEl.addEventListener("click", () => inputEl.focus());
    inputEl.addEventListener("input", () => BodySingleton.body?.renderItems());
  }

  get value() {
    return this.shadowRoot.getElementById(idInput).value;
  }

  onLocationChange = () => {
    this.shadowRoot.getElementById(idInput).value = "";
  };

  connectedCallback() {
    LocationSubscriptions.subscribe(this.onLocationChange);
  }

  disconnectedCallback() {
    LocationSubscriptions.unsubscribe(this.onLocationChange);
  }
}

export default Search;

customElements.define("teilen-search", Search);
