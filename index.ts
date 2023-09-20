import express, { Express, Request, Response } from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import dotenv from "dotenv"

dotenv.config({ override: true })

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6))
  },
  rollDice: ({ numDice, numSides }) => {
    var output = []
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)))
    }
    return output
  },
}

const app: Express = express()
const port = process.env.PORT

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running")
})

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  console.log(
    `Running a GraphQL API server at http://localhost:${port}/graphql`
  )
})
