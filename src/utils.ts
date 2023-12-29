export const N_QUESTIONS = 10

export function makeOpentdbUrl(category: string | undefined, difficulty: string | undefined): URL {
  const url = new URL('https://opentdb.com/api.php')
  url.searchParams.append('amount', N_QUESTIONS.toString())
  
  if (category) {
    url.searchParams.append('category', category)
  }

  if (difficulty) {
    url.searchParams.append('difficulty', difficulty)
  }

  return url
}
