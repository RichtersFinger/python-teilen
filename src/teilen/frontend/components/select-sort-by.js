import Base from "./base.js";

import { BodySingleton } from "../singletons.js";

// sorting is parsed from these strings, so the naming pattern is mandatory
// (see body.js for details):
// "<item-property>-<asc|desc>"
export const Options = {
  nameAsc: "name-asc",
  nameDesc: "name-desc",
  dateAsc: "date-asc",
  dateDesc: "date-desc",
  sizeAsc: "size-asc",
  sizeDesc: "size-desc",
};

const idSelect = "select";

class SortBySelect extends Base {
  static css = css`
    .outer {
      height: var(--size-10);
      background-color: var(--gray-0);
      border-radius: var(--size-2);
      border: 1px solid var(--gray-20);
      display: inline-flex;
      align-items: center;
      gap: var(--size-2);
      outline: none;
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
    }
    .outer:focus-within {
      box-shadow: var(--size-05) var(--size-05) var(--size-1) rgba(0, 0, 0, 0.2);
    }
    select {
      padding: var(--size-2);
      width: 100%;
      border: none;
      background: none;
      outline: none;
      font: inherit;
      color: inherit;
      cursor: pointer;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <div class="outer">
        <select id="${idSelect}">
          <option value="${Options.nameAsc}">Sort by name</option>
          <option value="${Options.nameDesc}">Sort by name (descending)</option>
          <option value="${Options.dateAsc}">Sort by date</option>
          <option value="${Options.dateDesc}">Sort by date (descending)</option>
          <option value="${Options.sizeAsc}">Sort by size</option>
          <option value="${Options.sizeDesc}">Sort by size (descending)</option>
        </select>
      </div>
    `;

    this.shadowRoot.getElementById(idSelect).addEventListener("change", () => {
      BodySingleton.body?.renderItems();
    });
  }

  get value() {
    return this.shadowRoot.getElementById(idSelect).value;
  }
}

export default SortBySelect;

customElements.define("teilen-sort-by-select", SortBySelect);
