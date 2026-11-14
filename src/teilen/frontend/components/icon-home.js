import Base from "./base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";

class HomeIcon extends Base {
  static get observedAttributes() {
    return [attributeSize];
  }

  static css = `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--icon-size, --size-5);
      height: var(--icon-size, --size-5);
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
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      `;
  }
}

customElements.define("home-icon", HomeIcon);

export default HomeIcon;
