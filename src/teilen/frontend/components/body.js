import Base from "./base.js";

import "./location.js";
import "./selection-indicator.js";
import "./item.js";

import { Kind } from "./item.js";
import { ItemsActions } from "../data/items.js";

const innerBottom = "innerBottom";

const content = {
  "folder-1": {
    id: "folder-1",
    kind: Kind.directory.id,
  },
  "folder-2": {
    id: "folder-2",
    kind: Kind.directory.id,
  },
  "folder-3": {
    id: "folder-3",
    kind: Kind.directory.id,
  },
  "file-1": {
    id: "file-1",
    kind: Kind.file.id,
  },
  "file-2": {
    id: "file-2",
    kind: Kind.file.id,
  },
  "link-4": {
    id: "link-4",
    kind: "unknown",
  },
};

class Body extends Base {
  static css = css`
    :host {
      display: flex;
      flex: 1;
    }
    .outer {
      width: 100%;
      padding: var(--size-3);
      background-color: var(--gray-0);
      border-radius: var(--size-3);
      display: flex;
      flex-direction: column;
      gap: var(--size-4);
      align-items: start;
      justify-content: start;
    }
    .inner-top {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .inner {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(var(--size-24), 0.1fr));
      grid-auto-rows: max-content;
      gap: var(--size-3);
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <div class="outer">
        <div class="inner-top">
          <teilen-location></teilen-location>
          <teilen-selection-indicator></teilen-selection-indicator>
        </div>
        <div id="${innerBottom}" class="inner"></div>
      </div>
    `;

    this.shadowRoot
      .getElementById(innerBottom)
      .addEventListener("click", (e) => {
        if (!e.ctrlKey) ItemsActions.clearSelection();
      });
  }

  updateBody() {
    const innerElement = this.shadowRoot.getElementById(innerBottom);
    const children = Object.values(content)
      .map((item) => {
        let _element;
        _element = document.createElement("teilen-item");
        _element.id = item.id;
        _element.kind = item.kind;
        if (!_element) return undefined;

        return _element;
      })
      .filter(Boolean);

    innerElement.replaceChildren(...children);
  }

  connectedCallback() {
    this.updateBody();
  }
}

export default Body;

customElements.define("teilen-body", Body);
