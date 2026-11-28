import Base from "./base.js";

import { configuration } from "../data/configuration.js";

import "./header.js";
import "./main.js";
import "./modal-login.js";
import { Session } from "../data/session.js";
import { BodySingleton } from "../singletons.js";

const idLoginModal = "login-modal";

class Root extends Base {
  static css = css`
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .header {
      flex-shrink: 0;
      width: 100%;
      height: 44px;
      box-sizing: border-box;
      background-color: white;
      padding: 4px;
      box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
    }

    .main {
      display: flex;
      flex: 1;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <header class="header">
        <teilen-header></teilen-header>
      </header>
      <teilen-login-modal id="${idLoginModal}"></teilen-login-modal>
      <main class="main">
        <teilen-main></teilen-main>
      </main>
    `;
  }

  async connectedCallback() {
    if (!configuration.passwordRequired) {
      Session.loggedIn = true;
      return;
    }
    if ((await fetch("/api/v1/auth")).ok) {
      Session.loggedIn = true;
      BodySingleton.body.updateBody();
      return;
    }

    this.shadowRoot.getElementById(idLoginModal).open();
  }
}

export default Root;

customElements.define("teilen-root", Root);
