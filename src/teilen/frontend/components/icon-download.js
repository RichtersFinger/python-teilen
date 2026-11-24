import BaseIcon from "./icon-base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";
const attributeMirror = "mirror";

class DownloadIcon extends BaseIcon {
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    `;
  }
}

customElements.define("download-icon", DownloadIcon);

export default DownloadIcon;
