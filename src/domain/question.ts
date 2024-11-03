export default interface Question {
  question: string
  index: number
  category: string
  type: string
  difficulty: string
  correct_answer: string
  player_answer: string | undefined
  answers: string[]
}

export interface QuestionDto {
  category: string
  correct_answer: string
  difficulty: string
  incorrect_answers: string[]
  question: string
  type: string
}

function createQuestion(index: number, dto: QuestionDto): Question {
  const answers = [dto.correct_answer].concat(dto.incorrect_answers)

  // shuffle answers array
  answers.sort(() => Math.random() - 0.5)

  return {
    question: dto.question,
    category: dto.category,
    type: dto.type,
    difficulty: dto.difficulty,
    correct_answer: dto.correct_answer,
    player_answer: undefined,
    index,
    answers,
  }
}

export function createQuestions(dtos: QuestionDto[]): Question[] {
  const questions = []
  for (let index = 0; index < dtos.length; index++) {
    questions.push(createQuestion(index, dtos[index]))
  }
  return questions
}

export function isCorrect(question: Question): boolean {
  return question.player_answer === question.correct_answer
}
