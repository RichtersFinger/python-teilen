import BaseIcon from "./icon-base.js";

const attributeDirection = "direction";
const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";

class ChevronIcon extends BaseIcon {
  static css = css`
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

  constructor() {
    super();

    const size = this.getAttribute(attributeSize) || 6;
    this.style.setProperty("--icon-size", `var(--size-${size})`);
    const strokeWidth = this.getAttribute(attributeStrokeWidth) || 2;
    this.shadowRoot.innerHTML = html`
      <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" stroke-width="${strokeWidth}">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;
  }
}

customElements.define("chevron-icon", ChevronIcon);

export default ChevronIcon;
