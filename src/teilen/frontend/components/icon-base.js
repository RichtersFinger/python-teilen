import Base from "./base.js";

const iconSheet = new CSSStyleSheet();
iconSheet.replaceSync(css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size);
    height: var(--icon-size);
  }
  .icon-svg {
    width: 100%;
    height: 100%;
    stroke: currentColor;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: rotate(0deg);
  }
`);

class BaseIcon extends Base {
  constructor() {
    super();
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets,
      iconSheet,
    ];
  }
}

export default BaseIcon;
