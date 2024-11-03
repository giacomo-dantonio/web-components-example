import Question, { isCorrect } from "../../domain/question"
import state from "../../state"
import { htmlDecode } from "../../utils"
import template from "./answer.html?raw"

interface AnswerProps {
  last: boolean
  question: Question
}

export default class QuestionAnswer extends HTMLElement {
  [x: string]: any
  state: { props: AnswerProps | null }
  questionAnswer: any

  constructor() {
    super()

    this.state = state({ props: null }, (_, oldval, newval) =>
      this.renderView(oldval, newval),
    )
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" })
    shadowRoot.innerHTML = template

    const form = shadowRoot.querySelector("form") as HTMLFormElement
    form.onsubmit = (ev) => {
      ev.preventDefault()

      const nextEvent = new CustomEvent("next-question", {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(nextEvent)
    }

    const { props } = this.state
    this.renderView(null, props)
  }

  renderView(_oldval: AnswerProps | null, newval: AnswerProps | null): void {
    if (newval !== null) {
      const { question } = newval

      const shadow = this.shadowRoot
      const correct = shadow?.querySelector("p#answer-correct")
      if (correct) {
        correct.textContent = isCorrect(question)
          ? "Congratulations, your answer is correct 🥳"
          : "Sorry, your answer is wrong 😞"
      }

      const playerText = shadow?.querySelector("p#player-answer .answer-text")
      if (playerText) {
        playerText.textContent = htmlDecode(question.player_answer ?? "")
      }

      const correctAnswer = shadow?.querySelector(
        "p#correct-answer",
      ) as HTMLElement | null
      const correctText = shadow?.querySelector("p#correct-answer .answer-text")
      if (isCorrect(question) && correctAnswer) {
        correctAnswer.style.display = "none"
      } else if (!isCorrect(question) && correctText) {
        correctText.textContent = htmlDecode(question.correct_answer)
      }

      const submitButton = shadow?.querySelector("input#submit")
      if (submitButton) {
        submitButton.setAttribute(
          "value",
          newval.last ? "Game finished" : "Next question >>",
        )
      }
    }
  }
}

customElements.define("question-answer", QuestionAnswer)
