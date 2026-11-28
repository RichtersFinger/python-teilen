import Base from "./base.js";

import "./button.js";
import "./icon-download.js";
import "./modal-selection-download.js";

import { Kind } from "./item.js";
import { LocationStore } from "../data/location.js";
import { ItemsStore, ItemsSubscriptions } from "../data/items.js";

const idButton = "button";
const idTooltip = "tooltip";

class SelectionDownload extends Base {
  static css = css`
    :host {
      display: flex;
      flex-direction: row;
      gap: var(--size-2);
      align-items: center;
    }

    .tooltip {
      position: relative;
    }

    .tooltip::before {
      content: "";
      position: absolute;
      bottom: var(---size-2);
      right: var(--size-4);
      width: calc(var(--size-1) * 2);
      height: calc(var(--size-1) * 2);
      background: var(--gray-90);
      transform: rotate(45deg);
      pointer-events: none;
      opacity: 0;
      transition: opacity 100ms ease;
      transition-delay: 0ms;
    }

    .tooltip::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(-50% - var(--size-2));
      right: 0;
      padding: var(--size-1) var(--size-2);
      border-radius: var(--size-1);
      background: var(--gray-90);
      color: var(--gray-10);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 100ms ease;
      transition-delay: 0ms;
    }

    .tooltip:hover::before,
    .tooltip:focus-within::before,
    .tooltip:hover::after,
    .tooltip:focus-within::after {
      opacity: 1;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <span id="${idTooltip}" class="tooltip" data-tooltip="download all">
        <teilen-button id="${idButton}">
          <teilen-download-icon slot="icon" size="5"></teilen-download-icon>
        </teilen-button>
      </span>
    `;

    this.shadowRoot.getElementById(idButton).addEventListener("click", () => {
      // resolve selection
      let targets = Object.values(ItemsStore).filter((item) => item.selected);
      if (targets.length === 0) targets = Object.values(ItemsStore);
      if (targets.length === 0) {
        alert("Please select a target for download first.");
        return;
      }

      // download single file
      if (targets.length === 1 && targets[0].kind === Kind.file.id) {
        window.open(
          `/files/${[...LocationStore.location, this.id].join("/")}`,
          "_blank",
        );
        return;
      }

      // download multiple files or directory
      fetch("/api/v1/archives", {
        method: "POST",
        body: JSON.stringify({
          targets: targets.map((item) =>
            [...LocationStore.location, item.id].join("/"),
          ),
          location: LocationStore.location.join("/"),
        }),
      }).then(async (r) => {
        if (!r.ok) {
          console.error(r);
          alert("Failed to prepare archive for download.");
        }

        const modal = document.createElement("teilen-selection-download-modal");
        modal.archiveId = (await r.json()).id ?? "missing";
        this.shadowRoot.appendChild(modal);
        modal.open();
      });
    });
  }

  onSelectionChange = () => {
    const count = Object.values(ItemsStore).reduce(
      (prev, current) => (current.selected ? prev + 1 : prev),
      0,
    );

    let label = "download all";
    if (count === 1) {
      label = "download one selected item";
    } else if (count > 1) {
      label = `download ${count} selected items`;
    }

    this.shadowRoot.getElementById(idTooltip).setAttribute("data-tooltip", label);
  };

  connectedCallback() {
    ItemsSubscriptions.subscribe(undefined, this.onSelectionChange);
  }

  disconnectedCallback() {
    ItemsSubscriptions.unsubscribe(this.onSelectionChange);
  }
}

export default SelectionDownload;

customElements.define("teilen-selection-download", SelectionDownload);
