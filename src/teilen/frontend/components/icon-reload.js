import Base from "./base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";
const attributeMirror = "mirror";

class ReloadIcon extends Base {
  static get observedAttributes() {
    return [attributeSize, attributeMirror];
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
      transform: scaleX(1);
    }
    :host([${attributeMirror}]) svg {
      transform: scaleX(-1);
    }
  `;

  init() {
    const size = this.getAttribute(attributeSize) || 6;
    this.style.setProperty("--icon-size", `var(--size-${size})`);
    const strokeWidth = this.getAttribute(attributeStrokeWidth) || 2;
    this.shadowRoot.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" stroke-width="${strokeWidth}">
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
        </svg>
      `;
  }
}

customElements.define("reload-icon", ReloadIcon);

export default ReloadIcon;
