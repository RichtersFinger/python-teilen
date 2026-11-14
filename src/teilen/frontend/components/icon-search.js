import Base from "./base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";

class SearchIcon extends Base {
  static get observedAttributes() {
    return [attributeSize];
  }

  static css = `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--icon-size);
      height: var(--icon-size);
    }
    svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;

  init() {
    const size = this.getAttribute(attributeSize) || 6;
    this.style.setProperty("--icon-size", `var(--size-${size})`);
    const strokeWidth = this.getAttribute(attributeStrokeWidth) || 2;
    this.shadowRoot.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" stroke-width="${strokeWidth}">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;
  }
}

customElements.define("search-icon", SearchIcon);

export default SearchIcon;
