import { StartSession } from "../../domain/events"
import template from "./start-game.html?raw"

class StartGame extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" })
    shadowRoot.innerHTML = template

    const form = shadowRoot.querySelector("form") as HTMLFormElement
    form.onsubmit = (ev) => {
      ev.preventDefault()

      const nameInput = form.querySelector("#name") as HTMLInputElement
      const difficultyInput = form.querySelector(
        "#difficulty",
      ) as HTMLSelectElement
      const categoryInput = form.querySelector("#category") as HTMLSelectElement

      const detail: StartSession = {
        player_name: nameInput.value,
        category: categoryInput.value || undefined,
        difficulty: difficultyInput.value || undefined,
      }

      const startEvent = new CustomEvent("start-session", {
        bubbles: true,
        composed: true,
        detail,
      })
      this.dispatchEvent(startEvent)
    }

    this.updateCategories(shadowRoot)
  }

  async updateCategories(shadowRoot: ShadowRoot): Promise<void> {
    const response = await fetch("https://opentdb.com/api_category.php")
    const json = await response.json()
    const categories = json["trivia_categories"]

    const select = shadowRoot.querySelector("select#category")
    for (const category of categories) {
      const option = document.createElement("option")
      option.setAttribute("value", category["id"])
      option.textContent = category["name"]

      select?.appendChild(option)
    }
  }
}

customElements.define("start-game", StartGame)
