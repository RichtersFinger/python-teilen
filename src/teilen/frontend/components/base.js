import { CSS } from "../styles.js";

class Base extends HTMLElement {
  static css;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (this.constructor.css) {
      const css = new CSSStyleSheet();
      css.replaceSync(this.constructor.css);
      this.shadowRoot.adoptedStyleSheets = [CSS, css];
    } else {
      this.shadowRoot.adoptedStyleSheets = [CSS];
    }

    this.init();
  }

  /**
   * Build HTML, set up event handlers, ...
   */
  init() {}
}

export default Base;
