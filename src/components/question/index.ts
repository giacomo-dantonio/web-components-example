import state from '../../state'
import template from './question.html?raw'

interface QuestionProps {
  question: string,
  answers: string[],
}

// from this: https://stackoverflow.com/a/1912522
function htmlDecode(input: string): string | null {
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export default class QuestionForm extends HTMLElement {
  state: { props: QuestionProps | null }

  constructor() {
    super()

    this.state = state(
      { props: null },
      (_, oldval, newval) => this.renderView(oldval, newval)
    )
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = template

    const { props } = this.state
    this.renderView(null, props)
  }

  renderView(_oldval: QuestionProps | null, newval: QuestionProps | null): void {
    const shadow = this.shadowRoot
    const container = shadow?.querySelector('div.answers')
    if (!shadow || ! container) {
      return
    }

    if (newval === null) {
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }
    } else {
      const questionSpan = shadow.querySelector("#question")
      if (questionSpan) {
        questionSpan.textContent = htmlDecode(newval.question)
      }

      const children = []
      for (const answer of newval.answers) {
        const input = document.createElement("input")
        input.setAttribute("type", "radio")
        input.setAttribute("name", "answer")
        input.setAttribute("value", answer)
        input.setAttribute("required", "true")

        const text = document.createElement("span")
        text.textContent = answer

        const label = document.createElement("label")
        label.appendChild(input)
        label.appendChild(text)

        children.push(label)
      }

      Element.prototype.replaceChildren.apply(container, children)
    }
  }
}

customElements.define("question-form", QuestionForm);
