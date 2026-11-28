import BaseModal from "./modal-base.js";

import "./button.js";
import "./progress-bar.js";

const idDialog = "dialog";
const idBtnDownload = "download-button";
const idBtnClose = "close-button";
const idProgress = "progress";
const idInfo = "info";
const idError = "error";

class SelectionDownloadModal extends BaseModal {
  static css = css`
    .info {
      color: var(--gray-50);
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
          <h2 class="modal-title">Download</h2>
          <hr class="modal-separator" />
          <div class="modal-body">
            <span id="${idInfo}" class="info"></span>
            <teilen-progress-bar id="${idProgress}"></teilen-progress-bar>
            <span id="${idError}" class="error" style="display: none"></span>
          </div>
          <div class="modal-footer">
            <teilen-button id="${idBtnClose}">Close</teilen-button>
            <teilen-button id="${idBtnDownload}" disabled>Download</teilen-button>
          </div>
        </div>
      </dialog>
    `;

    this._archiveId = undefined;
    this._interval = undefined;
    this._status = {};

    this.shadowRoot
      .getElementById(idBtnDownload)
      .addEventListener("click", () => {
        window.open(
          "/api/v1/archives?" + new URLSearchParams({ id: this._archiveId }),
          "_blank",
        );
      });
    this.shadowRoot.getElementById(idBtnClose).addEventListener("click", () => {
      if (confirm("Are you sure you want to close this dialog?")) this.close();
    });
  }

  set archiveId(value) {
    this._archiveId = value;
    if (!this._archiveId || this._interval) return;
    this._interval = setInterval(() => this.refresh(), 500);
  }

  open() {
    this.shadowRoot.getElementById(idDialog).showModal();
    if (!this._archiveId || this._interval) return;
    this._interval = setInterval(() => this.refresh(), 500);
  }

  close() {
    this.shadowRoot.getElementById(idDialog).close();
    clearInterval(this._interval);
    this._interval = undefined;
  }

  refresh() {
    fetch(
      "/api/v1/archives?" +
        new URLSearchParams({ id: this._archiveId, status: "" }),
    ).then(async (r) => {
      if (!r.ok) {
        const errorElement = this.shadowRoot.getElementById(idError);
        errorElement.textContent =
          "An error occurred while preparing the download. Please try again.";
        errorElement.style.display = "";
        clearInterval(this._interval);
        return;
      }

      this._status = await r.json();
      this.shadowRoot.getElementById(idProgress).progress = Math.ceil(
        ((this._status?.progress ?? 0) / (this._status?.totalFiles ?? 1)) * 100,
      );
      if (this._status?.completed) {
        this.shadowRoot.getElementById(idInfo).innerText =
          "Your download is ready.";
        this.shadowRoot.getElementById(idBtnDownload).removeAttribute("disabled");
        clearInterval(this._interval);
      } else {
        this.shadowRoot.getElementById(idInfo).innerText =
          "Preparing download ...";
      }
    });
  }
}

export default SelectionDownloadModal;

customElements.define("teilen-selection-download-modal", SelectionDownloadModal);
