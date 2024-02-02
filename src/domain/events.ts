export interface StartSession {
  player_name: string,
  category: string | undefined,
  difficulty: string | undefined,
}

export interface AnswerQuestion {
  answer: string
}
