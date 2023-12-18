import template from './start-game.html?raw';

class StartGame extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = template;
  }
}

customElements.define("start-game", StartGame);
