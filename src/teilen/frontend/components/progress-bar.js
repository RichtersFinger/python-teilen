import Base from "./base.js";

const inner = "inner";
const annotation = "annotation";

class ProgressBar extends Base {
  static css = css`
    .outer {
      position: relative;
      height: var(--size-2);
      background-color: var(--gray-10);
      border-radius: var(--size-1);
      overflow: hidden;
    }
    .inner {
      --progress: 0;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: var(--gray-50);
      width: calc(var(--progress, 0) * 1%);
      height: 100%;
      transition: width 160ms ease-out;
    }
    .annotation {
      padding: var(--size-1) 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: start;
      justify-content: end;
      color: var(--gray-50);
      font-size: var(--size-3);
    }
  `;

  constructor() {
    super();

    this.shadowRoot.innerHTML = html`
      <div>
        <div class="outer">
          <div id="${inner}" class="inner"></div>
        </div>
        <div class="annotation">
          <span id="${annotation}">0%</span>
        </div>
      </div>
    `;

    this._progress = 0;
  }

  get progress() {
    return this._progress;
  }

  set progress(value) {
    this._progress = Math.max(0, Math.min(100, Number(value) || 0));
    this.shadowRoot
      .getElementById(inner)
      .style.setProperty("--progress", this._progress);
    this.shadowRoot.getElementById(annotation).innerText = `${this._progress}%`;
  }
}

export default ProgressBar;

customElements.define("teilen-progress-bar", ProgressBar);
