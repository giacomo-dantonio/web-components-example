import template from './app.html?raw';

import Session from '../domain/session';
import { StartSession } from '../domain/events';
import { capitalize, htmlDecode, makeOpentdbUrl, questionNr } from '../utils';
import { QuestionDto, createQuestions } from '../domain/question';
import state from '../state';
import QuestionForm from '../components/question';

class App extends HTMLElement {
  state: { props: Session | null }

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

    this.addEventListener(
      'start-session',
      ev => {
        const payload = (ev as CustomEvent).detail as StartSession
        this.startSession(payload)
      }
    )

    this.renderView(null, null)
  }

  async startSession(payload: StartSession) {
    const url = makeOpentdbUrl(payload.category, payload.difficulty)

    const response = await fetch(url)
    const results = (await response.json()).results as QuestionDto[]
    const questions = createQuestions(results)

    this.state.props = {
      player_name: payload.player_name,
      category: payload.category,
      difficulty: payload.difficulty,
      active_question: 0,
      questions
    }
  }

  renderView(oldprops: Session | null, newprops: Session | null) {
    const shadow = this.shadowRoot
    const contentDiv = shadow?.querySelector('[slot="content"]')

    if (!newprops) {
      // If there are no props, the start form will be rendered
      const startForm = document.createElement('start-game')
      contentDiv?.replaceChildren(startForm)
    }
    else {
      if (newprops.player_name !== oldprops?.player_name) {
        const header = shadow?.querySelector('[slot="header"]')
        if (header) {
          header.textContent = `⁉️ ${newprops.player_name},`
        }
      }

      if (newprops.active_question != oldprops?.active_question) {
        const question = newprops.questions[newprops.active_question]
        if (question !== undefined) {
          const questionForm = document.createElement("question-form") as QuestionForm
          questionForm.state.props = {
            question: question.question,
            answers: question.answers
          }

          const content = shadow?.querySelector('[slot="content"]')
          content?.replaceChildren(questionForm)
        }

        const footer = shadow?.querySelector('[slot="footer"]')
        if (footer) {
          footer.textContent = `This is your ${questionNr(newprops.active_question)} question / ` +
            `${htmlDecode(question.category)} / ${capitalize(question.difficulty)}`
        }
      }
    }
  }
}

customElements.define("trivia-app", App);
