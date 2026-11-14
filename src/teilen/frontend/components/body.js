import Base from "./base.js";

import "./location.js";

class Body extends Base {
  static css = `
    :host {
      display: flex;
      flex: 1;
    }
    .outer {
      width: 100%;
      padding: var(--size-3);
      background-color: var(--gray-0);
      border-radius: var(--size-3);
      display: flex;
      flex-direction: column;
      gap: var(--size-4);
      align-items: start;
      justify-content: start;
    }
  `;

  init() {
    this.shadowRoot.innerHTML = `
      <div class="outer">
        <teilen-location></teilen-location>
        <span>
          content...
        </span>
      </div>
    `;
  }
}

export default Body;

customElements.define("teilen-body", Body);
