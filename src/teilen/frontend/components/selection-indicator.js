import Base from "./base.js";

import "./location-indicator.js";
import "./item.js";

import { ItemsStore, ItemsSubscriptions } from "../data/items.js";

const span = "span";

class SelectionIndicator extends Base {
  static css = css`
    span {
      font-style: italic;
    }
    .invisible {
      display: none;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <span id="${span}" class="invisible">items selected</span>
    `;
  }

  onSelectionChange = () => {
    const count = Object.values(ItemsStore).reduce(
      (prev, current) => (current.selected ? prev + 1 : prev),
      0,
    );
    const spanElement = this.shadowRoot.getElementById(span);
    if (count === 0) {
      spanElement.classList.add("invisible");
    } else {
      if (count === 1) {
        spanElement.textContent = "one item selected";
      } else {
        spanElement.textContent = `${count} items selected`;
      }
      spanElement.classList.remove("invisible");
    }
  };

  connectedCallback() {
    ItemsSubscriptions.subscribe(undefined, this.onSelectionChange);
  }

  disconnectedCallback() {
    ItemsSubscriptions.unsubscribe(this.onSelectionChange);
  }
}

export default SelectionIndicator;

customElements.define("teilen-selection-indicator", SelectionIndicator);
