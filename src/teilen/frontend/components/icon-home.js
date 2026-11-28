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
      <svg
        class="icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        stroke-width="${strokeWidth}"
      >
        <path
          d="M 3.6,22 V 8.25 l 8.4,-6 8.4,6 V 22 H 14.6 V 12.8 h -5.3 v 9.2 z"
        ></path>
      </svg>
    `;
  }
}

customElements.define("home-icon", HomeIcon);

export default HomeIcon;
