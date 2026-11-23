import Base from "./base.js";

import { ItemsActions } from "../data/items.js";
import { LocationStore, LocationActions } from "../data/location.js";

export const Kind = {
  directory: {
    id: "directory",
    img: "/static/img/folder2.svg",
  },
  file: {
    id: "file",
    img: "/static/img/file2.svg",
  },
};

export const attributeId = "item-id";
export const attributeKind = "kind";

const root = "root";
const img = "img";
const label = "label";

class Item extends Base {
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

  get id() {
    return this.getAttribute(attributeId);
  }

  set id(value) {
    if (this.getAttribute(attributeId) !== null) {
      console.error("Cannot change item-id");
      return;
    }
    this.setAttribute(attributeId, value);
  }

  get kind() {
    return this.getAttribute(attributeKind);
  }

  set kind(value) {
    if (this.getAttribute(attributeKind) !== null) {
      console.error("Cannot change item-kind");
      return;
    }
    this.setAttribute(attributeKind, value);

    if (value === Kind.directory.id) {
      this.shadowRoot
        .getElementById(root)
        .addEventListener("dblclick", () =>
          LocationActions.navigateRelative(this.id),
        );
    }
    if (value === Kind.file.id) {
      this.shadowRoot
        .getElementById(root)
        .addEventListener("dblclick", () =>
          window.open(
            `/files/${([...LocationStore.location, this.id].join("/"))}`,
            "_blank",
          ),
        );
    }
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

  static observedAttributes = [attributeId, attributeKind];

  attributeChangedCallback(name, _, newValue) {
    if (name === attributeId) {
      this.shadowRoot.getElementById(label).innerText = newValue;
    }
    if (name === attributeKind) {
      this.shadowRoot.getElementById(img).src =
        Kind[newValue]?.img ?? "/static/img/placeholder.svg";
    }
  }

  constructor() {
    super();

    let id = this.getAttribute(attributeId);
    let kind = this.getAttribute(attributeKind);
    this.shadowRoot.innerHTML = html`
      <div id="${root}" class="outer">
        <img
          id="${img}"
          src="${Kind[kind]?.img ?? "/static/img/placeholder.svg"}"
        />
        <span id="${label}" class="name">${id}</span>
      </div>
    `;

    this.shadowRoot.getElementById(root).addEventListener("click", (e) => {
      e.stopPropagation();
      const itemId = this.getAttribute(attributeId);
      if (!e.ctrlKey) ItemsActions.clearSelection();
      ItemsActions.selectItem(itemId);
    });
  }

  connectedCallback() {
    let itemId = this.getAttribute(attributeId);
    if (!itemId) {
      console.error("Missing item ID during connect.");
      return;
    }

    ItemsActions.addItem(itemId, this);
  }

  disconnectedCallback() {
    let itemId = this.getAttribute(attributeId);
    if (!itemId) {
      console.error("Missing item ID during disconnect.");
      return;
    }

    ItemsActions.removeItem(itemId, this);
  }
}

export default Item;

customElements.define("teilen-item", Item);
