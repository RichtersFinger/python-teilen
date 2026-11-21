import Base from "./base.js";

import "./location.js";
import "./folder.js";

import { attributeContentId as folderAttributeContentId } from "./folder.js";
import { ContentType, content, contentSubscriptions } from "../store.js";

const inner = "inner";

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
        <teilen-location></teilen-location>
        <div id="${inner}" class="inner"></div>
      </div>
    `;

    this.shadowRoot.getElementById(inner).addEventListener("click", (e) => {
      if (!e.ctrlKey) contentSubscriptions.clearSelection();
    });
  }

  connectedCallback() {
    this.updateBody();
  }

  updateBody() {
    const innerElement = this.shadowRoot.getElementById(inner);
    const children = Object.values(content)
      .map((item) => {
        let _element;
        if (item.kind === ContentType.directory) {
          _element = document.createElement("teilen-folder");
          _element.setAttribute(folderAttributeContentId, item.id);
        }
        if (item.kind === ContentType.file)
          _element = document.createElement("div");
        if (!_element) return undefined;

        return _element;
      })
      .filter(Boolean);

    innerElement.replaceChildren(...children);
  }
}

export default Body;

customElements.define("teilen-body", Body);
