import { resolveTripleslashReference } from "typescript"

const { v4: uuidv4 } = require("uuid")
const path = require("path")
const fs = require("fs")

// @desc    Get one question from the pool of questions
// @param   GET /api/get-question
const getRandomQuestion = (request: any, response: any) => {
  const data: Array<Question> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./data.json"))
  )
  const index: number = Math.floor(Math.random() * data.length)
  const question: Question = data[index]

  response.send({
    success: true,
    data: question,
  })
}

// @desc    Get one question from the pool of questions
// @param   GET /api/get-question/:id
const getQuestionById = (
  request: { params: { id: string } },
  response: any
) => {
  const data: Array<Question> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./data.json"))
  )
  const { id } = request.params
  const question: Question = data.find((question) => question._id === id)

  if (question) {
    response.send({
      success: true,
      data: question,
    })
  } else {
    response.status(404)
    response.send({
      success: false,
      message: "Question not found",
    })
  }
}

// @desc    Add a question to the pool of questions
// @param   POST /api/add-question
const addQuestion = (request: any, response: any) => {
  const data: Array<Question> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./data.json"))
  )
  const { content }: { content: string } = request.body

  if (!content) {
    response.status(400)
    response.send({
      success: false,
      message: "Invalid request",
    })
  } else {
    const newQuestion: Question = {
      _id: uuidv4(),
      content: content,
      upVote: 0,
      downVote: 0,
    }
    const newData: Array<Question> = [...data, newQuestion]
    fs.writeFileSync(
      path.resolve(__dirname, "./data.json"),
      JSON.stringify(newData)
    )

    response.send({
      success: true,
      data: newQuestion,
    })
  }
}

// @desc    Add a vote
// @param   PUT /api/add-vote
const addVote = (request: any, response: any) => {
  const data: Array<Question> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./data.json"))
  )
  const voteReq: Vote = request.body

  if (!voteReq) {
    response.status(403)
    response.send({
      success: false,
      message: "Invalid request",
    })
  } else {
    const { _id, vote } = voteReq
    const newData: Array<Question> = data.map((question: Question) => {
      if (question._id === _id && (vote === "up" || vote === "down")) {
        return { ...question, [`${vote}Vote`]: question[`${vote}Vote`] + 1 }
      }
      return question
    })

    fs.writeFileSync(
      path.resolve(__dirname, "./data.json"),
      JSON.stringify(newData)
    )

    response.send({
      success: true,
      data: newData.find((x) => x._id === _id),
    })
  }
}

export { getRandomQuestion, addQuestion, addVote, getQuestionById }
