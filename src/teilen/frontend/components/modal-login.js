import BaseModal from "./modal-base.js";

import "./button.js";
import { Session } from "../data/session.js";
import { BodySingleton } from "../singletons.js";

const idDialog = "dialog";
const idPassword = "password";
const idError = "error";
const idBtnSubmit = "submit";

class LoginModal extends BaseModal {
  static css = css`
    .modal::backdrop {
      backdrop-filter: blur(10px);
    }
    input {
      height: var(--size-10);
      background-color: var(--gray-0);
      border-radius: var(--size-2);
      border: 1px solid var(--gray-20);
      padding: var(--size-2);
      outline: none;
      box-sizing: border-box;
      font: inherit;
      color: inherit;
    }
    .error {
      color: red;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <dialog id="${idDialog}" class="modal">
        <div class="modal-content">
          <h2 class="modal-title">Password Required</h2>
          <hr class="modal-separator" />
          <div class="modal-body">
            <input id="${idPassword}" type="password" />
            <span id="${idError}" class="error" style="display: none"></span>
          </div>
          <div class="modal-footer">
            <teilen-button id="${idBtnSubmit}">Submit</teilen-button>
          </div>
        </div>
      </dialog>
    `;

    // wire login
    let passwordElement = this.shadowRoot.getElementById(idPassword);
    let errorElement = this.shadowRoot.getElementById(idError);
    this.shadowRoot
      .getElementById(idBtnSubmit)
      .addEventListener("click", async () => {
        const r = await fetch("/api/v1/auth", {
          method: "POST",
          body: JSON.stringify({ password: passwordElement.value }),
        });
        if (r.ok) {
          Session.loggedIn = true;
          this.close();
          BodySingleton.body.updateBody();
        } else {
          if (r.status === 403) {
            errorElement.textContent = "Bad password.";
            errorElement.style.display = "";
          } else {
            errorElement.innerText = `Failed (${r.status}): ${r.statusText}`;
            errorElement.style.display = "";
          }
        }
      });
  }

  open() {
    this.shadowRoot.getElementById(idDialog).showModal();
  }

  close() {
    this.shadowRoot.getElementById(idDialog).close();
  }
}

export default LoginModal;

customElements.define("teilen-login-modal", LoginModal);
