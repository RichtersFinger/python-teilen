import Base from "./base.js";

import { content, contentSubscriptions } from "../store.js";

export const attributeSelected = "selected";
export const attributeContentId = "content-id";
const root = "root";
const label = "label";

class Folder extends Base {
  static css = css`
    .outer {
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: start;
      padding: var(--size-2);
      border-radius: var(--size-1);
      min-width: 0;
      user-select: none;
      white-space: nowrap;
      transition: box-shadow 200ms ease-out;
    }
    .selected {
      outline: 1px solid var(--gray-10);
      box-shadow: 0 0 var(--size-4) var(--gray-10);
      white-space: normal;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  static observedAttributes = [attributeContentId, attributeSelected];

  attributeChangedCallback(name, _, newValue) {
    if (name === attributeSelected) {
      if (newValue !== null) {
        this.shadowRoot.getElementById(root).classList.add("selected");
      } else {
        this.shadowRoot.getElementById(root).classList.remove("selected");
      }
    }
    if (name === attributeContentId) {
      this.shadowRoot.getElementById(label).innerText = newValue;
    }
  }

  constructor() {
    super();

    let contentId = this.getAttribute(attributeContentId);
    this.shadowRoot.innerHTML = html`
      <div
        id="${root}"
        class="outer ${this.getAttribute(attributeSelected) === null
          ? ""
          : "selected"}"
      >
        <img src="/static/img/folder2.svg" />
        <span id="${label}" class="name">
          ${content[contentId] ?? contentId}
        </span>
      </div>
    `;

    this.shadowRoot.getElementById(root).addEventListener("click", (e) => {
      e.stopPropagation();
      const currentId = this.getAttribute(attributeContentId);
      if (!e.ctrlKey) contentSubscriptions.clearSelection();
      contentSubscriptions.updateSelection(currentId, true);
    });
  }

  onChange = (selected) => {
    if (selected) this.setAttribute(attributeSelected, selected);
    else this.removeAttribute(attributeSelected);
  };

  connectedCallback() {
    let contentId = this.getAttribute(attributeContentId);
    contentSubscriptions.subscribe(contentId, this.onChange);
  }

  disconnectedCallback() {
    let contentId = this.getAttribute(attributeContentId);
    contentSubscriptions.unsubscribe(contentId, this.onChange);
  }
}

export default Folder;

customElements.define("teilen-folder", Folder);
