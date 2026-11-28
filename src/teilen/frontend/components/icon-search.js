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
      <svg
        class="icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        stroke-width="${strokeWidth}"
      >
        <circle cx="9.95" cy="10.75" r="7.25" />
        <path d="m 15.25,16 5.45,5.45" />
      </svg>
    `;
  }
}

customElements.define("search-icon", SearchIcon);

export default SearchIcon;
