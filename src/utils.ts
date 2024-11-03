export const N_QUESTIONS = 10

export function makeOpentdbUrl(
  category: string | undefined,
  difficulty: string | undefined,
): URL {
  const url = new URL("https://opentdb.com/api.php")
  url.searchParams.append("amount", N_QUESTIONS.toString())

  if (category) {
    url.searchParams.append("category", category)
  }

  if (difficulty) {
    url.searchParams.append("difficulty", difficulty)
  }

  return url
}

// from this: https://stackoverflow.com/a/1912522
export function htmlDecode(input: string): string | null {
  var e = document.createElement("textarea")
  e.innerHTML = input
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue
}

export function questionNr(index: number): string {
  switch (index) {
    case 0:
      return "1st"
    case 1:
      return "2nd"
    case 2:
      return "3rd"
    default:
      return `${index + 1}th`
  }
}

export function capitalize(text: string): string {
  return text && text[0].toUpperCase() + text.slice(1)
}
