import BaseModal from "./modal-base.js";

import "./logo.js";
import "./button.js";

import { configuration } from "../data/configuration.js";

const dialog = "dialog";
const btnClose = "close-button";

class AboutModal extends BaseModal {
  static css = css``;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <dialog id="${dialog}" class="modal">
        <div class="modal-content">
          <h2 class="modal-title">Software Info</h2>
          <hr class="modal-separator" />
          <div class="modal-body">
            <teilen-logo height="var(--size-16)"></teilen-logo>
            <p>Software version: ${configuration.version ?? "-"}</p>
          </div>
          <div class="modal-footer">
            <teilen-button id="${btnClose}">Close</teilen-button>
          </div>
        </div>
      </dialog>
    `;

    // wire dismiss
    let dialogEl = this.shadowRoot.getElementById(dialog);
    dialogEl.addEventListener("click", (event) => {
      if (event.target === dialogEl) {
        this.close();
      }
    });
    this.shadowRoot
      .getElementById(btnClose)
      .addEventListener("click", () => this.close());
  }

  open() {
    this.shadowRoot.getElementById(dialog).showModal();
  }

  close() {
    this.shadowRoot.getElementById(dialog).close();
  }
}

export default AboutModal;

customElements.define("teilen-modal-about", AboutModal);
