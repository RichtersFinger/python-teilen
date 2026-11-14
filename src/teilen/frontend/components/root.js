import Base from "./base.js";

import "./header.js";
import "./main.js";

class Root extends Base {
  static css = `
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .teilen-header {
      flex-shrink: 0;
      width: 100%;
      height: 44px;
      box-sizing: border-box;
      background-color: white;
      padding: 4px;
      box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
    }

    .teilen-main {
      display: flex;
      flex: 1;
    }
  `;

  render() {
    this.shadowRoot.innerHTML = `
      <header class="teilen-header">
        <teilen-header></teilen-header>
      </header>
      <main class="teilen-main">
        <teilen-main></teilen-main>
      </main>
    `;
  }
}

export default Root;

customElements.define("teilen-root", Root);
