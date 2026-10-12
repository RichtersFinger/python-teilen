import Base from "./base.js";

class Spinner extends Base {
  static css = `
    .spinner {
      width: 24px;
      aspect-ratio: 1;
      border: 6px solid white;
      border-radius: 50%;
      border-right-color: #ccc;
      animation: spin 0.75s linear infinite;
    }
  `;

  constructor() {
    super();
    this.shadowRoot.innerHTML = `<div class="spinner"/>`;
  }
}

export default Spinner;

customElements.define("base-spinner", Spinner);
