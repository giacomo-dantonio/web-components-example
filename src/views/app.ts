import template from "./app.html?raw"

import Session, { isLast } from "../domain/session"
import { AnswerQuestion, StartSession } from "../domain/events"
import {
  capitalize,
  htmlDecode,
  interpolateColor,
  makeOpentdbUrl,
  questionNr,
} from "../utils"
import {
  QuestionDto,
  createQuestions,
  isCorrect,
  percentScore,
} from "../domain/question"
import state from "../state"
import QuestionForm from "../components/question"
import QuestionAnswer from "../components/answer"
import GameSummary from "../components/summary"

class App extends HTMLElement {
  state: { props: Session | null }

  constructor() {
    super()

    this.state = state({ props: null }, (_, oldval, newval) =>
      this.renderView(oldval, newval),
    )
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" })
    shadowRoot.innerHTML = template

    this.addEventListener("start-session", (ev) => {
      const payload = (ev as CustomEvent).detail as StartSession
      this.startSession(payload)
    })

    this.addEventListener("answer-question", (ev) => {
      const payload = (ev as CustomEvent).detail as AnswerQuestion
      this.answerActiveQuestion(payload.answer)
    })

    this.addEventListener("next-question", (_) => this.moveToNextQuestion())

    this.renderView(null, null)
  }

  async startSession(payload: StartSession) {
    const url = makeOpentdbUrl(payload.category, payload.difficulty)

    const response = await fetch(url)
    const results = (await response.json()).results as QuestionDto[]
    const questions = createQuestions(results)

    this.state.props = {
      active_question: 0,
      category: payload.category,
      difficulty: payload.difficulty,
      over: false,
      player_name: payload.player_name,
      questions,
    }
  }

  answerActiveQuestion(answer: string) {
    if (this.state.props !== null) {
      const { active_question, questions } = this.state.props

      questions[active_question]["player_answer"] = answer

      this.state.props = {
        ...this.state.props,
        questions,
      }
    }
  }

  moveToNextQuestion() {
    if (this.state.props !== null) {
      const { active_question, questions } = this.state.props
      this.state.props = {
        ...this.state.props,
        active_question: Math.min(active_question + 1, questions.length - 1),
        over: isLast(this.state.props),
      }
    }
  }

  renderView(oldprops: Session | null, newprops: Session | null) {
    const shadow = this.shadowRoot
    const contentDiv = shadow?.querySelector('[slot="content"]')

    const showAnswer = (props: Session) => {
      const { active_question, questions } = props
      return questions[active_question]?.player_answer !== undefined
    }

    if (!newprops) {
      // If there are no props, the start form will be rendered
      const startForm = document.createElement("start-game")
      contentDiv?.replaceChildren(startForm)
    } else {
      if (newprops.player_name !== oldprops?.player_name) {
        const header = shadow?.querySelector('[slot="header"]')
        if (header) {
          header.textContent = `⁉️ ${newprops.player_name},`
        }
      }

      const background = shadow?.querySelector("#bg")
      if (newprops.over) {
        // set background color
        const score = percentScore(newprops.questions)
        const bgColor = interpolateColor(0xff0000, 0x00ff00, score)
        const background = shadow?.querySelector("#bg")
        background?.classList.remove("correct", "wrong")
        background?.setAttribute(
          "style",
          `background-image: linear-gradient(to bottom right, #${bgColor}, white);`,
        )

        // render summary
        const summary = document.createElement("game-summary") as GameSummary
        summary.state.props = newprops

        contentDiv?.replaceChildren(summary)

        shadow?.querySelector("base-layout")?.setAttribute("large", "")
      } else if (newprops.active_question != oldprops?.active_question) {
        const question = newprops.questions[newprops.active_question]
        if (question !== undefined) {
          const questionForm = document.createElement(
            "question-form",
          ) as QuestionForm
          questionForm.state.props = {
            question: question.question,
            answers: question.answers,
          }

          const content = shadow?.querySelector('[slot="content"]')
          content?.replaceChildren(questionForm)
        }

        const footer = shadow?.querySelector('[slot="footer"]')
        if (footer) {
          footer.textContent =
            `This is your ${questionNr(newprops.active_question)} question / ` +
            `${htmlDecode(question.category)} / ${capitalize(question.difficulty)} /`
        }

        if (background) {
          background.className = ""
        }
      } else if (showAnswer(newprops)) {
        const question = newprops.questions[newprops.active_question]

        const questionAnswer = document.createElement(
          "question-answer",
        ) as QuestionAnswer
        questionAnswer.state.props = {
          last: isLast(newprops),
          question,
        }

        const content = shadow?.querySelector('[slot="content"]')
        content?.replaceChildren(questionAnswer)

        if (background) {
          background.className = isCorrect(question) ? "correct" : "wrong"
        }
      }
    }
  }
}

customElements.define("trivia-app", App)
