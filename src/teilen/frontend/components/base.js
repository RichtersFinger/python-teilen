import { CSS } from "../styles.js";

class Base extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [CSS];
  }
}

export default Base;
