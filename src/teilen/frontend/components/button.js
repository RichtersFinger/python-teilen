import Base from "./base.js";

const attrDisabled = "disabled";

class Button extends Base {
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
      transition: background-color 0.2s;
      outline: none;
      font-size: var(--size-4);
    }
    .outer:hover:not(:disabled) {
      background-color: var(--gray-10);
      cursor: pointer;
    }
    .outer:active:not(:disabled) {
      background-color: var(--gray-20);
    }
    .outer:focus:not(:disabled) {
      box-shadow: var(--size-05) var(--size-05) var(--size-05) rgba(0, 0, 0, 0.2);
    }
    .outer:disabled {
      cursor: not-allowed;
    }
  `;

  static observedAttributes = [attrDisabled];

  attributeChangedCallback(name, _, newValue) {
    if (name === attrDisabled) {
      const btn = this.shadowRoot.querySelector(".outer");
      if (btn) {
        if (newValue !== null) {
          btn.setAttribute("disabled", "");
        } else {
          btn.removeAttribute("disabled");
        }
      }
    }
  }

  constructor() {
    super();

    const isDisabled = this.hasAttribute(attrDisabled) ? "disabled" : "";
    this.shadowRoot.innerHTML = html`
      <button class="outer" ${isDisabled}>
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `;
  }
}

export default Button;

customElements.define("teilen-button", Button);
