import BaseModal from "./modal-base.js";

import "./logo.js";
import "./button.js";
import "./icon-external-link.js";

import { configuration } from "../data/configuration.js";

const dialog = "dialog";
const btnClose = "close-button";

class AboutModal extends BaseModal {
  static css = css`
    :root,
    :host {
      --modal-size: var(--size-96);
    }

    a {
      color: black;
      text-decoration: none;
      padding: var(--size-1) var(--size-2);
      margin: var(--size-1) var(--size-1);
      display: flex;
      flex-direction: row;
      gap: var(--size-2);
      align-items: center;
      background-color: var(--gray-20);
      border-radius: var(--size-4);
    }
    a:hover {
      cursor: pointer;
    }
    a:focus {
      outline: none;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <dialog id="${dialog}" class="modal">
        <div class="modal-content">
          <h2 class="modal-title">Software Info</h2>
          <hr class="modal-separator" />
          <div class="modal-body">
            <teilen-logo height="var(--size-16)"></teilen-logo>
            <div
              style="display: flex; flex-direction: column; gap: var(--size-2);"
            >
              <div
                style="display: flex; flex-direction: row; gap: var(--size-2); justify-content: space-between;"
              >
                <a
                  target="_blank"
                  href="https://github.com/RichtersFinger/python-teilen"
                >
                  <external-link-icon size="4"></external-link-icon>
                  View on GitHub
                </a>
                <a target="_blank" href="https://pypi.org/project/teilen/">
                  <external-link-icon size="4"></external-link-icon>
                  View on PyPi
                </a>
              </div>
              <span>Software version: ${configuration.version ?? "-"}</span>
              <span>Copyright (c) 2025 • MIT License</span>
            </div>
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
