import Base from "./base.js";

const attributeDirection = "direction";
const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";

class ChevronIcon extends Base {
  static get observedAttributes() {
    return [attributeDirection, attributeSize];
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
      transform: rotate(0deg);
    }
    :host([${attributeDirection}="up"]) svg {
      transform: rotate(180deg);
    }
    :host([${attributeDirection}="right"]) svg {
      transform: rotate(270deg);
    }
    :host([${attributeDirection}="left"]) svg {
      transform: rotate(90deg);
    }
    :host([${attributeDirection}="down"]) svg {
      transform: rotate(0deg);
    }
  `;

  init() {
    const size = this.getAttribute(attributeSize) || 6;
    this.style.setProperty("--icon-size", `var(--size-${size})`);
    const strokeWidth = this.getAttribute(attributeStrokeWidth) || 2;
    this.shadowRoot.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" stroke-width="${strokeWidth}">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
  }
}

customElements.define("chevron-icon", ChevronIcon);

export default ChevronIcon;
