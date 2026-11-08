import Base from "./base.js";
import "./logo.js";
import "./modal-about.js";

class Header extends Base {
  static css = `
    .logo {
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.shadowRoot.innerHTML = `
      <teilen-modal-about id="about-modal"></teilen-modal-about>
      <teilen-logo id="logo-outer" class="logo"></teilen-logo>
    `;

    // wire about modal
    let aboutModal = this.shadowRoot.getElementById("about-modal");
    this.shadowRoot
      .getElementById("logo-outer")
      .addEventListener("click", () => aboutModal.open());
  }
}

export default Header;

customElements.define("teilen-header", Header);
