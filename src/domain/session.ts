import Question from "./question";

export default interface Session {
  player_name: string,
  category: string | undefined,
  difficulty: string | undefined,
  questions: Question[]
}