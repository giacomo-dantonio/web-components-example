import template from './app.html?raw';

import Session from '../domain/session';
import { StartSession } from '../domain/events';
import { makeOpentdbUrl } from '../utils';
import { QuestionDto, createQuestions } from '../domain/question';

class App extends HTMLElement {
  state: Session | undefined

  constructor() {
    super()
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

    this.renderView()
  }

  async startSession(payload: StartSession) {
    const url = makeOpentdbUrl(payload.category, payload.difficulty)

    const response = await fetch(url)
    const results = (await response.json()).results as QuestionDto[]
    const questions = createQuestions(results)

    this.state = {
      player_name: payload.player_name,
      category: payload.category,
      difficulty: payload.difficulty,
      questions
    }

    this.renderView()
  }

  renderView() {
    const shadow = this.shadowRoot
    const contentDiv = shadow?.querySelector('[slot="content"]')

    if (this.state === undefined) {
      const startForm = document.createElement('start-game')
      contentDiv?.replaceChildren(startForm)
    }
    else {
      console.log(this.state)
    }
  }
}

customElements.define("trivia-app", App);
