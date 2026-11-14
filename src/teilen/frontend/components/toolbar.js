import Base from "./base.js";

import "./search.js";
import "./select.js";
import "./button.js";
import "./icon-chevron.js";
import "./icon-reload.js";

class Toolbar extends Base {
  static css = `
    .inner {
      width: 100%;
      height: var(--size-12);
      border-radius: var(--size-3);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .nav-items {
      display: flex;
      flex-direction: row;
      gap: var(--size-1);
    }
  `;

  render() {
    this.shadowRoot.innerHTML = `
      <div class="inner">
        <div class="nav-items">
          <teilen-button disabled>
            <chevron-icon slot="icon" direction="left"></chevron-icon>
            Back
          </teilen-button>
          <teilen-button disabled>
            <chevron-icon slot="icon" direction="up"></chevron-icon>
            Up
          </teilen-button>
          <teilen-button>
            <reload-icon slot="icon" size="5"></reload-icon>
          </teilen-button>
        </div>
        <teilen-search disabled></teilen-search>
        <teilen-select disabled></teilen-select>
      </div>
    `;
  }
}

export default Toolbar;

customElements.define("teilen-toolbar", Toolbar);
