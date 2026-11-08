import Base from "./base.js";

class Header extends Base {
  static css = `
    .logo-outer {
      display: inline-flex;
      align-items: center;
      height: 100%;
      cursor: pointer;
    }

    .logo-text {
      font-family: sans-serif;
      font-weight: bold;
      font-size: larger;
      user-select: none;
    }
  `;

  constructor() {
    super();
    this.shadowRoot.innerHTML = `
      <div id="logo-outer" class="logo-outer">
        <img src="/static/img/favicon2.svg" height="95%" />
        <span class="logo-text">teilen</span>
      </div>
    `;

  }
}

export default Header;

customElements.define("teilen-header", Header);
