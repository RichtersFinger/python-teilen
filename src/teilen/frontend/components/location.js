import Base from "./base.js";

import "./icon-home.js";

class Location extends Base {
  static css = `
    .outer {
      user-select: none;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      font-weight: bold;
      font-size: var(--size-5);
    }
    .segment {
      cursor: pointer;
    }
  `;

  init() {
    this.shadowRoot.innerHTML = `
      <div class="outer">
        <span>
          <home-icon class="segment" size=6 stroke-width=2.4>
          </home-icon>
          / <span class="segment">test</span> / <span class="segment">path</span>
        </span>
      </div>
    `;
  }
}

export default Location;

customElements.define("teilen-location", Location);
