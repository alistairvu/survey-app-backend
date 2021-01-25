interface Question {
  _id: string
  content: string
  upVote: number
  downVote: number
}

interface Vote {
  _id: string
  vote: "up" | "down"
}
