import Base from "./base.js";

const modalSheet = new CSSStyleSheet();

modalSheet.replaceSync(css`
  .modal {
    outline: none;
    border: none;
    border-radius: var(--size-2);
    padding: 0;
    box-shadow: var(--size-1) var(--size-1) var(--size-3) rgba(0, 0, 0, 0.2);
    width: var(--modal-size, var(--size-80));
  }
  .modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    padding: var(--size-4);
    display: flex;
    flex-direction: column;
  }
  .modal-separator {
    border: none;
    height: 1px;
    background-color: #ccc;
    margin: 0;
  }
  .modal-title {
    margin: 0px 0px var(--size-2) 0px;
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    padding: var(--size-4);
  }
  .modal-footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`);

class BaseModal extends Base {
  constructor() {
    super();
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets,
      modalSheet,
    ];
  }
}

export default BaseModal;
