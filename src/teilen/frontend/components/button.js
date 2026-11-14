import Base from "./base.js";

class Button extends Base {
  static css = `
    :host {
      display: inline-block;
    }
    .outer {
      background-color: var(--gray-0);
      border-radius: 0.5rem;
      border: 1px solid var(--gray-20);
      padding: 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
      outline: none;
    }
    .outer:hover {
      background-color: var(--gray-10);
      cursor: pointer;
    }
    .outer:active {
      background-color: var(--gray-20);
    }
    .outer:focus {
      outline: 1px solid var(--gray-20);
    }
  `;

  render() {
    this.shadowRoot.innerHTML = `
      <button class="outer">
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `;
  }
}

export default Button;

customElements.define("teilen-button", Button);
