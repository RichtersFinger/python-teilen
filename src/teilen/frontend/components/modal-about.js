import Base from "./base.js";
import "./logo.js";
import { configuration } from "../main.js";

class AboutModal extends Base {
  static css = `
    dialog {
      outline: none;
      border: none;
      border-radius: 8px;
      padding: 0px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      width: 320px;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    .dialog-content {
      padding: 16px;
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
      margin: 0px 0px 10px 0px;
    }

    .body {
      display: flex;
      flex-direction: column;
      padding: 16px;
    }
  `;

  open() {
    this.shadowRoot.getElementById("root").showModal();
  }

  close() {
    this.shadowRoot.getElementById("root").close();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <dialog id="root">
        <div class="dialog-content">
          <h2 class="title">Software Info</h2>
          <hr />
          <div class="body">
            <teilen-logo height="60px"></teilen-logo>
            <p>Software version: ${configuration.version ?? "-"}</p>
          </div>
        </div>
      </dialog>
    `;

    // wire dismiss
    let root = this.shadowRoot.getElementById("root");
    root.addEventListener("click", (event) => {
      if (event.target === root) {
        this.close();
      }
    });
  }
}

export default AboutModal;

customElements.define("teilen-modal-about", AboutModal);
