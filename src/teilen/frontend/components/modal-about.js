import Base from "./base.js";
import "./logo.js";
import "./button.js";
import { configuration } from "../main.js";

const dialog = "dialog";
const btnClose = "close-button";

class AboutModal extends Base {
  static css = `
    dialog {
      outline: none;
      border: none;
      border-radius: var(--size-2);
      padding: 0;
      box-shadow: var(--size-1) var(--size-1) var(--size-3) rgba(0, 0, 0, 0.2);
      width: var(--size-80);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    .dialog-content {
      padding: var(--size-4);
      display: flex;
      flex-direction: column;
    }

    hr {
      border: none;
      height: 1px;
      background-color: #ccc;
      margin: 0;
    }

    .title {
      margin: 0px 0px var(--size-2) 0px;
    }

    .body {
      display: flex;
      flex-direction: column;
      padding: var(--size-4);
    }

    .footer {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: end;
    }
  `;

  open() {
    this.shadowRoot.getElementById(dialog).showModal();
  }

  close() {
    this.shadowRoot.getElementById(dialog).close();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <dialog id="${dialog}">
        <div class="dialog-content">
          <h2 class="title">Software Info</h2>
          <hr />
          <div class="body">
            <teilen-logo height="var(--size-16)"></teilen-logo>
            <p>Software version: ${configuration.version ?? "-"}</p>
          </div>
          <div class="footer">
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
}

export default AboutModal;

customElements.define("teilen-modal-about", AboutModal);
