import Base from "./base.js";

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
        <select id="select">
          <option value="name-asc">Sort by name</option>
          <option value="name-desc">Sort by name (descending)</option>
          <option value="date-asc">Sort by date</option>
          <option value="date-desc">Sort by date (descending)</option>
          <option value="size-asc">Sort by size</option>
          <option value="size-desc">Sort by size (descending)</option>
        </select>
      </div>
    `;
  }
}

export default SortBySelect;

customElements.define("teilen-sort-by-select", SortBySelect);
