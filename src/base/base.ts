import template from './base.html?raw';

class BaseLayout extends HTMLElement {
  constructor() {
    super();
    // const template = (document.getElementById("base") as HTMLTemplateElement)?.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = template;
    // shadowRoot.appendChild(template.cloneNode(true));
  }
}

customElements.define("base-layout", BaseLayout);
