import template from './app.html?raw';

import Session from '../domain/session';

class App extends HTMLElement {
  state: Session | undefined

  constructor() {
    super()
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = template

    this.renderView()
  }

  renderView() {
    const shadow = this.shadowRoot
    const contentDiv = shadow?.querySelector('[slot="content"]')

    if (this.state === undefined) {
      const startForm = document.createElement('start-game')
      contentDiv?.replaceChildren(startForm)
    }
  }
}

customElements.define("trivia-app", App);
