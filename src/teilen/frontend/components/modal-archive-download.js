import BaseModal from "./modal-base.js";

import "./button.js";
import "./progress-bar.js";

const dialog = "dialog";
const btnDownload = "download-button";
const btnClose = "close-button";
const progress = "progress";
const info = "info";
const error = "error";

class ArchiveDownloadModal extends BaseModal {
  static css = css`
    .info {
      color: var(--gray-50);
    }
    .error {
      display: none;
      color: red;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <dialog id="${dialog}" class="modal">
        <div class="modal-content">
          <h2 class="modal-title">Download</h2>
          <hr class="modal-separator" />
          <div class="modal-body">
            <span id="${info}" class="info"></span>
            <teilen-progress-bar id="${progress}"></teilen-progress-bar>
            <span id="${error}" class="error"></span>
          </div>
          <div class="modal-footer">
            <teilen-button id="${btnClose}">Close</teilen-button>
            <teilen-button id="${btnDownload}" disabled>Download</teilen-button>
          </div>
        </div>
      </dialog>
    `;

    this._archiveId = undefined;
    this._interval = undefined;
    this._status = {};

    this.shadowRoot
      .getElementById(btnDownload)
      .addEventListener("click", () => {
        window.open(
          "/api/v1/archives?" + new URLSearchParams({ id: this._archiveId }),
          "_blank",
        );
      });
    this.shadowRoot.getElementById(btnClose).addEventListener("click", () => {
      if (confirm("Are you sure you want to close this dialog?")) this.close();
    });
  }

  set archiveId(value) {
    this._archiveId = value;
    if (!this._archiveId || this._interval) return;
    this._interval = setInterval(() => this.refresh(), 500);
  }

  open() {
    this.shadowRoot.getElementById(dialog).showModal();
    if (!this._archiveId || this._interval) return;
    this._interval = setInterval(() => this.refresh(), 500);
  }

  close() {
    this.shadowRoot.getElementById(dialog).close();
    clearInterval(this._interval);
    this._interval = undefined;
  }

  refresh() {
    fetch(
      "/api/v1/archives?" +
        new URLSearchParams({ id: this._archiveId, status: "" }),
    ).then(async (r) => {
      if (!r.ok) {
        const errorElement = this.shadowRoot.getElementById(error);
        errorElement.textContent =
          "An error occurred while preparing the download. Please try again.";
        errorElement.style.display = undefined;
        clearInterval(this._interval);
        return;
      }

      this._status = await r.json();
      this.shadowRoot.getElementById(progress).progress = Math.ceil(
        ((this._status?.progress ?? 0) / (this._status?.totalFiles ?? 1)) * 100,
      );
      if (this._status?.completed) {
        this.shadowRoot.getElementById(info).innerText =
          "Your download is ready.";
        this.shadowRoot.getElementById(btnDownload).removeAttribute("disabled");
        clearInterval(this._interval);
      } else {
        this.shadowRoot.getElementById(info).innerText =
          "Preparing download ...";
      }
    });
  }
}

export default ArchiveDownloadModal;

customElements.define("teilen-modal-archive-download", ArchiveDownloadModal);
