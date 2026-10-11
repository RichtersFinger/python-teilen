class Main extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <div style="margin: 4px; display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 0; padding: 5px; box-sizing: border-box;">
        <section style="flex-shrink: 0;">
          <div
            style="width: 100%; height: 80px; padding: 10px; background-color: rgb(168 168 168); border-radius: 0.75rem; display: flex; flex-direction: row; align-items: center; justify-content: center; box-sizing: border-box;">
            <span>toolbar...</span>
          </div>
        </section>
        <section style="display: flex; flex: 1; min-height: 0;">
          <div
            style="width: 100%; height: 100%; padding: 10px; background-color: white; border-radius: 0.75rem; display: flex; flex-direction: row; align-items: center; justify-content: center; box-sizing: border-box;">
            <span>content...</span>
          </div>
        </section>
      </div>
`;
  }
}

export default Main;
