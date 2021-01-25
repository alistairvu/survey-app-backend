import {
  getRandomQuestion,
  addQuestion,
  addVote,
  getQuestionById,
} from "./controller/methods"
const express = require("express")
const path = require("path")

const app = express()
const port = process.env.PORT || 6960

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/api/get-question", getRandomQuestion)
app.get("/api/get-question/:id", getQuestionById)
app.post("/api/add-question", addQuestion)
app.put("/api/add-vote", addVote)

app.listen(port, (err: any) => {
  if (err) throw err
  console.log(`Experience the magic at http://localhost:${port}`)
})
