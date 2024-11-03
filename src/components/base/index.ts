import template from "./base.html?raw"

class BaseLayout extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" })
    shadowRoot.innerHTML = template
  }
}

customElements.define("base-layout", BaseLayout)
