import Base from "./base.js";

import "./search.js";
import "./select.js";
import "./button.js";
import "./icon-chevron.js";
import "./icon-reload.js";

import { ToolbarSingleton } from "../singletons.js";

const search = "search";
const order = "order";

class Toolbar extends Base {
  static css = css`
    .inner {
      width: 100%;
      height: var(--size-12);
      border-radius: var(--size-3);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      gap: var(--size-4);
    }

    .nav-items {
      display: flex;
      flex-direction: row;
      gap: var(--size-1);
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <div class="inner">
        <div class="nav-items">
          <teilen-search id="${search}"></teilen-search>
          <teilen-button>
            <reload-icon slot="icon" size="5"></reload-icon>
          </teilen-button>
        </div>
        <teilen-select id="${order}" disabled></teilen-select>
      </div>
    `;
  }

  connectedCallback() {
    ToolbarSingleton.search = this.shadowRoot.getElementById(search);
    ToolbarSingleton.order = this.shadowRoot.getElementById(order);
  }

  disconnectedCallback() {
    ToolbarSingleton.search = undefined;
    ToolbarSingleton.order = undefined;
  }
}

export default Toolbar;

customElements.define("teilen-toolbar", Toolbar);
