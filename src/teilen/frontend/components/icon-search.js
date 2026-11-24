import BaseIcon from "./icon-base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";

class SearchIcon extends BaseIcon {
  static css = css``;

  constructor() {
    super();

    const size = this.getAttribute(attributeSize) || 6;
    this.style.setProperty("--icon-size", `var(--size-${size})`);
    const strokeWidth = this.getAttribute(attributeStrokeWidth) || 2;
    this.shadowRoot.innerHTML = html`
      <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" stroke-width="${strokeWidth}">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    `;
  }
}

customElements.define("search-icon", SearchIcon);

export default SearchIcon;
