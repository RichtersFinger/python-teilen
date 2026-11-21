import Base from "./base.js";

const attributeHeight = "height";

class Logo extends Base {
  static css = css`
    :host {
      display: inline-flex;
      align-items: center;
      height: 100%;
    }

    .logo-text {
      font-weight: bold;
      font-size: larger;
      user-select: none;
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <img
        src="/static/img/favicon2.svg"
        height="${this.getAttribute(attributeHeight) ?? "95%"}"
      />
      <span class="logo-text">teilen</span>
    `;
  }
}

export default Logo;

customElements.define("teilen-logo", Logo);
