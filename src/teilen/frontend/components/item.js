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

const attrId = "item-id";
const attrKind = "kind";

const idRoot = "root";
const idImg = "img";
const idLabel = "label";

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
      word-break: break-all;
      transition: box-shadow 100ms ease-out;
    }
    .selected {
      outline: 1px solid var(--gray-10);
      box-shadow: 0 0 var(--size-4) var(--gray-10);
      white-space: normal;
    }
    .name {
      font-size: var(--size-3);
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  get id() {
    return this.getAttribute(attrId);
  }

  set id(value) {
    if (this.getAttribute(attrId) !== null) {
      console.error("Cannot change item-id");
      return;
    }
    this.setAttribute(attrId, value);
  }

  get kind() {
    return this.getAttribute(attrKind);
  }

  set kind(value) {
    if (this.getAttribute(attrKind) !== null) {
      console.error("Cannot change item-kind");
      return;
    }
    this.setAttribute(attrKind, value);

    if (value === Kind.directory.id) {
      this.shadowRoot
        .getElementById(idRoot)
        .addEventListener("dblclick", () =>
          LocationActions.navigateRelative(this.id),
        );
    }
    if (value === Kind.file.id) {
      this.shadowRoot
        .getElementById(idRoot)
        .addEventListener("dblclick", () =>
          window.open(
            `/files/${[...LocationStore.location, this.id].join("/")}`,
            "_blank",
          ),
        );
    }
  }

  get selected() {
    return this.shadowRoot.getElementById(idRoot).classList.contains("selected");
  }

  select() {
    this.shadowRoot.getElementById(idRoot).classList.add("selected");
  }

  unselect() {
    this.shadowRoot.getElementById(idRoot).classList.remove("selected");
  }

  static observedAttributes = [attrId, attrKind];

  attributeChangedCallback(name, _, newValue) {
    if (name === attrId) {
      this.shadowRoot.getElementById(idLabel).innerText = newValue;
    }
    if (name === attrKind) {
      this.shadowRoot.getElementById(idImg).src =
        Kind[newValue]?.img ?? "/static/img/placeholder.svg";
    }
  }

  constructor() {
    super();

    let id = this.getAttribute(attrId);
    let kind = this.getAttribute(attrKind);
    this.shadowRoot.innerHTML = html`
      <div id="${idRoot}" class="outer">
        <img
          id="${idImg}"
          src="${Kind[kind]?.img ?? "/static/img/placeholder.svg"}"
        />
        <span id="${idLabel}" class="name">${id}</span>
      </div>
    `;

    this.shadowRoot.getElementById(idRoot).addEventListener("click", (e) => {
      e.stopPropagation();
      const itemId = this.getAttribute(attrId);
      if (!e.ctrlKey) ItemsActions.clearSelection();
      ItemsActions.selectItem(itemId);
    });
  }

  connectedCallback() {
    let itemId = this.getAttribute(attrId);
    if (!itemId) {
      console.error("Missing item ID during connect.");
      return;
    }

    ItemsActions.addItem(itemId, this);
  }

  disconnectedCallback() {
    let itemId = this.getAttribute(attrId);
    if (!itemId) {
      console.error("Missing item ID during disconnect.");
      return;
    }

    ItemsActions.removeItem(itemId, this);
  }
}

export default Item;

customElements.define("teilen-item", Item);
