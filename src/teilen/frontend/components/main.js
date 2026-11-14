import Base from "./base.js";

import "./toolbar.js";

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
      min-height: 0;
    }

    .body-inner {
      width: 100%;
      height: 100%;
      padding: var(--size-3);
      background-color: var(--gray-0);
      border-radius: var(--size-3);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
  `;

  init() {
    this.shadowRoot.innerHTML = `
      <div class="outer">
        <section class="toolbar-outer">
          <teilen-toolbar></teilen-toolbar>
        </section>
        <section class="body-outer">
          <div class="body-inner">
            <span>content...</span>
          </div>
        </section>
      </div>
    `;
  }
}

export default Main;

customElements.define("teilen-main", Main);
