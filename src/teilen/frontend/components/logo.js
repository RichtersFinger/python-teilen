import Base from "./base.js";

class Logo extends Base {
  static css = `
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
    this.shadowRoot.innerHTML = `
      <img src="/static/img/favicon2.svg" height="95%" />
      <span class="logo-text">teilen</span>
    `;
  }
}

export default Logo;

customElements.define("teilen-logo", Logo);
