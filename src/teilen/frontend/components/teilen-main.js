import Base from "./base.js";

class Main extends Base {
  static css = `
    :host {
      flex: 1;
      display: flex;
      animation: fadein 0.1s linear;
    }

    .main-outer {
      margin: 4px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      min-height: 0;
      padding: 5px;
      box-sizing: border-box;
    }

    .main-toolbar-outer {
      flex-shrink: 0;
    }

    .main-toolbar-inner {
      width: 100%;
      height: 80px;
      padding: 10px;
      background-color: rgb(168 168 168);
      border-radius: 0.75rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    .main-body-outer {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    .main-body-inner {
      width: 100%;
      height: 100%;
      padding: 10px;
      background-color: white;
      border-radius: 0.75rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
  `;

  constructor() {
    super();
    this.shadowRoot.innerHTML = `
      <div class="main-outer">
        <section class="main-toolbar-outer">
          <div class="main-toolbar-inner">
            <span>toolbar...</span>
          </div>
        </section>
        <section class="main-body-outer">
          <div class="main-body-inner">
            <span>content...</span>
          </div>
        </section>
      </div>
    `;
  }
}

export default Main;

customElements.define("teilen-main", Main);
