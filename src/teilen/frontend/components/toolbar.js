import Base from "./base.js";

import "./search.js";
import "./select-sort-by.js";
import "./button.js";
import "./icon-reload.js";

import { BodySingleton, ToolbarSingleton } from "../singletons.js";

const idSearch = "search";
const idReload = "reload";
const idOrder = "order";

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
          <teilen-search id="${idSearch}"></teilen-search>
          <teilen-button id="${idReload}">
            <teilen-reload-icon slot="icon" size="5"></teilen-reload-icon>
          </teilen-button>
        </div>
        <teilen-sort-by-select id="${idOrder}"></teilen-select>
      </div>
    `;

    this.shadowRoot
      .getElementById(idReload)
      .addEventListener("click", () => BodySingleton.body.updateBody());
  }

  connectedCallback() {
    ToolbarSingleton.search = this.shadowRoot.getElementById(idSearch);
    ToolbarSingleton.order = this.shadowRoot.getElementById(idOrder);
  }

  disconnectedCallback() {
    ToolbarSingleton.search = undefined;
    ToolbarSingleton.order = undefined;
  }
}

export default Toolbar;

customElements.define("teilen-toolbar", Toolbar);
