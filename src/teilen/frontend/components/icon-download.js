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
      <svg
        class="icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        stroke-width="${strokeWidth}"
      >
        <path
          d="m 22.95,14.1 v 3.25 C 21.95,19 22,19 19.75,19 H 4.25 C 2,19 2,19 2,17.35 V 14.1"
        />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    `;
  }
}

customElements.define("download-icon", DownloadIcon);

export default DownloadIcon;
