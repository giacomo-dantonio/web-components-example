import template from "./base.html?raw"

class BaseLayout extends HTMLElement {
  static observedAttributes = ["large"];

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" })
    shadowRoot.innerHTML = template

    this.setLarge()
  }

  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    if (name === "large") {
      this.setLarge()
    }
  }

  setLarge() {
    const shadow = this.shadowRoot

    const main = shadow?.querySelector("#main")
    if (main) {
      main.className = (this.getAttribute("large") !== null) ? "large": ""
    }
  }
}

customElements.define("base-layout", BaseLayout)
