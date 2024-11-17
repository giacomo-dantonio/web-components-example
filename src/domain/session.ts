import Question from "./question"

export default interface Session {
  player_name: string
  category: string | undefined
  difficulty: string | undefined
  questions: Question[]
  active_question: number
  over: boolean
}

export function isLast(session: Session) {
  return session.active_question === session.questions.length - 1
}