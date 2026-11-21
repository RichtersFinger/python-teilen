import Base from "./base.js";

import { ItemsActions } from "../data/items.js";

export const attributeItemId = "item-id";
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
      transition: box-shadow 100ms ease-out;
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

  get itemId() {
    return this.getAttribute(attributeItemId);
  }

  set itemId(id) {
    this.setAttribute(attributeItemId, id);
  }

  get selected() {
    return this.shadowRoot.getElementById(root).classList.contains("selected");
  }

  select() {
    this.shadowRoot.getElementById(root).classList.add("selected");
  }

  unselect() {
    this.shadowRoot.getElementById(root).classList.remove("selected");
  }

  static observedAttributes = [attributeItemId];

  attributeChangedCallback(name, _, newValue) {
    if (name === attributeItemId) {
      this.shadowRoot.getElementById(label).innerText = newValue;
    }
  }

  constructor() {
    super();

    let itemId = this.getAttribute(attributeItemId);
    this.shadowRoot.innerHTML = html`
      <div id="${root}" class="outer">
        <img src="/static/img/folder2.svg" />
        <span id="${label}" class="name">${itemId}</span>
      </div>
    `;

    this.shadowRoot.getElementById(root).addEventListener("click", (e) => {
      e.stopPropagation();
      const itemId = this.getAttribute(attributeItemId);
      if (!e.ctrlKey) ItemsActions.clearSelection();
      ItemsActions.selectItem(itemId);
    });
  }

  connectedCallback() {
    let itemId = this.getAttribute(attributeItemId);
    if (!itemId) {
      console.error("Missing item ID during connect.");
      return;
    }

    ItemsActions.addItem(itemId, this);
  }

  disconnectedCallback() {
    let itemId = this.getAttribute(attributeItemId);
    if (!itemId) {
      console.error("Missing item ID during disconnect.");
      return;
    }

    ItemsActions.removeItem(itemId, this);
  }
}

export default Folder;

customElements.define("teilen-folder", Folder);
