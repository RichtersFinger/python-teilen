import Base from "./base.js";

import "./toolbar.js";
import "./body.js";

class Main extends Base {
  static css = `
    :host {
      flex: 1;
      display: flex;
      animation: fadein 0.1s linear;
    }

    .outer {
      margin: var(--size-1);
      display: flex;
      flex-direction: column;
      gap: var(--size-2);
      flex: 1;
      min-height: 0;
      padding: var(--size-1);
      box-sizing: border-box;
    }

    .toolbar-outer {
      flex-shrink: 0;
    }

    .body-outer {
      display: flex;
      flex: 1;
    }
  `;

  init() {
    this.shadowRoot.innerHTML = `
      <div class="outer">
        <section class="toolbar-outer">
          <teilen-toolbar></teilen-toolbar>
        </section>
        <section class="body-outer">
          <teilen-body></teilen-body>
        </section>
      </div>
    `;
  }
}

export default Main;

customElements.define("teilen-main", Main);
