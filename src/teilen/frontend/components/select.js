import Base from "./base.js";

const attributeDisabled = "disabled";

class Select extends Base {
  static css = `
    .outer {
      height: var(--size-10);
      background-color: var(--gray-0);
      border-radius: var(--size-2);
      border: 1px solid var(--gray-20);
      display: inline-flex;
      align-items: center;
      gap: var(--size-2);
      outline: none;
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
    }
    .outer:focus-within:not(.disabled) {
      box-shadow: 0px var(--size-1) var(--size-1) rgba(0, 0, 0, 0.2);
    }
    .disabled {
      cursor: not-allowed;
      color: var(--gray-30);
    }
    select {
      padding: var(--size-2);
      width: 100%;
      border: none;
      background: none;
      outline: none;
      font: inherit;
      color: inherit;
      cursor: pointer;
    }
    select:disabled {
      cursor: not-allowed;
    }
  `;

  static observedAttributes = [attributeDisabled];

  attributeChangedCallback(name, _, newValue) {
    if (name === attributeDisabled) {
      const select = this.shadowRoot.getElementById("select");
      if (newValue !== null) {
        select.setAttribute("disabled", "");
      } else {
        select.removeAttribute("disabled");
      }
    }
  }

  init() {
    const isDisabled = this.hasAttribute(attributeDisabled) ? "disabled" : "";
    this.shadowRoot.innerHTML = `
      <div class="outer ${isDisabled ? "disabled" : ""}">
        <select id="select" ${isDisabled}>
          <option value="">Please select..</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </div>
    `;
  }
}

export default Select;

customElements.define("teilen-select", Select);
