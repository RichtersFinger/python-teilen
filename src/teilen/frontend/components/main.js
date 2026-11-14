import Base from "./base.js";

class Main extends Base {
  static css = `
    :host {
      flex: 1;
      display: flex;
      animation: fadein 0.1s linear;
    }

    .main-outer {
      margin: var(--size-1);
      display: flex;
      flex-direction: column;
      gap: var(--size-2);
      flex: 1;
      min-height: 0;
      padding: var(--size-1);
      box-sizing: border-box;
    }

    .main-toolbar-outer {
      flex-shrink: 0;
    }

    .main-toolbar-inner {
      width: 100%;
      height: var(--size-20);
      padding: var(--size-3);
      background-color: var(--gray-0);
      border-radius: var(--size-3);
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
      padding: var(--size-3);
      background-color: var(--gray-0);
      border-radius: var(--size-3);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
  `;

  render() {
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
