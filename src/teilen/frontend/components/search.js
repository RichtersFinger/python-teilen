import Base from "./base.js";
import "./icon-search.js";

const attributeDisabled = "disabled";

class Search extends Base {
  static css = `
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
    }
    .outer:focus:not(:disabled) {
      box-shadow: 0px var(--size-1) var(--size-1) rgba(0, 0, 0, 0.2);
    }
    .disabled {
      cursor: not-allowed;
      color: var(--gray-30);
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

  init() {
    const isDisabled = this.hasAttribute(attributeDisabled) ? "disabled" : "";
    this.shadowRoot.innerHTML = `
      <div class="outer ${isDisabled ? "disabled": ""}">
        <search-icon></search-icon>
        <input id="input" type="text" ${isDisabled} />
      </div>
    `;
  }
}

export default Search;

customElements.define("teilen-search", Search);
