import BaseIcon from "./icon-base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";
const attributeMirror = "mirror";

class ReloadIcon extends BaseIcon {
  static css = css`
    :host([${attributeMirror}]) svg {
      transform: scaleX(-1);
    }
  `;

  constructor() {
    super();

    const size = this.getAttribute(attributeSize) || 6;
    this.style.setProperty("--icon-size", `var(--size-${size})`);
    const strokeWidth = this.getAttribute(attributeStrokeWidth) || 2;
    this.shadowRoot.innerHTML = html`
      <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" stroke-width="${strokeWidth}">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
        <path d="M21 3v5h-5"></path>
      </svg>
    `;
  }
}

customElements.define("reload-icon", ReloadIcon);

export default ReloadIcon;
