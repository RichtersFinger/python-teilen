import Base from "./base.js";

class Spinner extends Base {
  constructor() {
    super();
    this.shadowRoot.innerHTML = `
      <style>
        .spinner {
          width: 24px;
          aspect-ratio: 1;
          border: 6px solid white;
          border-radius: 50%;
          border-right-color: #ccc;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      </style>
      <div class="spinner"/>
`;
  }
}

export default Spinner;

customElements.define("base-spinner", Spinner);
