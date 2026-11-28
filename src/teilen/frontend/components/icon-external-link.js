import BaseIcon from "./icon-base.js";

const attributeSize = "size";
const attributeStrokeWidth = "stroke-width";

class ExternalLinkIcon extends BaseIcon {
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
        <path
          d="m 20,12.95 v 6.8 c 0,2.25 0,2.25 -2.25,2.25 H 5.25 C 3,21 3,21 3,18.75 V 6.25 C 3,4 3,4 5.25,4 h 6.8"
        ></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="11" y1="13" x2="20.3" y2="3.7"></line>
      </svg>
    `;
  }
}

customElements.define("external-link-icon", ExternalLinkIcon);

export default ExternalLinkIcon;
