import BaseIcon from "./icon-base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";

class HomeIcon extends BaseIcon {
  static css = css``;

  constructor() {
    super();

    const size = this.getAttribute(attributeSize) || 6;
    this.style.setProperty("--icon-size", `var(--size-${size})`);
    const strokeWidth = this.getAttribute(attributeStrokeWidth) || 2;
    this.shadowRoot.innerHTML = html`
      <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" stroke-width="${strokeWidth}">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    `;
  }
}

customElements.define("home-icon", HomeIcon);

export default HomeIcon;
