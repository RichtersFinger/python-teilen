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
      <svg
        class="icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        stroke-width="${strokeWidth}"
      >
        <path d="M 22,2.73 21.66,7.72 16.67,7.37"></path>
        <path
          d="M 22.2175,12 C 22.2175,17.65 17.65,22.2175 12,22.2175 6.36,22.2175 1.78,17.65 1.78,12 1.78,6.36 6.36,1.78 12,1.78 c 3.83,0 7.17,2.11 8.92,5.23"
        ></path>
      </svg>
    `;
  }
}

customElements.define("reload-icon", ReloadIcon);

export default ReloadIcon;
