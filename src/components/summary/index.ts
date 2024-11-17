import Question, { isCorrect, percentScore } from "../../domain/question"
import state from "../../state"
import { htmlDecode } from "../../utils"
import template from "./summary.html?raw"

interface SummaryProps {
  questions: Question[]
}

export default class GameSummary extends HTMLElement {
  state: { props: SummaryProps | null }

  constructor() {
    super()

    this.state = state({ props: null }, (_, oldval, newval) =>
      this.renderView(oldval, newval),
    )
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" })
    shadowRoot.innerHTML = template

    const { props } = this.state
    this.renderView(null, props)
  }

  renderView(_oldval: SummaryProps | null, newval: SummaryProps | null): void {
    if (this.shadowRoot && newval) {
      // Add score
      const { questions } = newval

      const scorEl = this.shadowRoot.querySelector("#score")
      if (scorEl) {
        const score = percentScore(questions).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })
        scorEl.textContent = `${score}%`
      }

      // Populate table
      const table = this.shadowRoot.querySelector("table.recap")
      const tableBody = this.shadowRoot.querySelector("table.recap tbody")
      if (tableBody) {
        const newBody = document.createElement("tbody")
        for (const question of questions) {
          const row = document.createElement("tr")

          const cellsContent = [
            question.question,
            question.player_answer ?? "",
            question.correct_answer,
            isCorrect(question) ? "👌" : "😔",
          ]
          for (const content of cellsContent) {
            const cell = document.createElement("td")
            cell.textContent = htmlDecode(content)
            row.appendChild(cell)
          }

          newBody.appendChild(row)
        }

        table?.replaceChild(newBody, tableBody)
      }
    }
  }
}

customElements.define("game-summary", GameSummary)
