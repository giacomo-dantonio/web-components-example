export default interface Question {
  question: string,
  index: number,
  category: string,
  type: string,
  difficulty: string,
  correct_answer: string,
  player_answer: string,
  answers: string[]
}