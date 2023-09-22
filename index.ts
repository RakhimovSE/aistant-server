import express, { Express, Request, Response } from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import fetch from "node-fetch"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config({ override: true })

var schema = buildSchema(`
  type Query {
    user(id: ID!): User
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    avatar: String!
  }
`)

var root = {
  user: async ({ id }) => {
    try {
      const res = await fetch(`https://reqres.in/api/users/${id}`)
      const { data: user } = await res.json()
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
      }
    } catch {
      return null
    }
  },
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
const host = process.env.HOSTNAME
const port = process.env.PORT
const clientHost = process.env.CLIENT_HOSTNAME
const clientPort = process.env.CLIENT_PORT

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running")
})

app.use(
  cors({
    origin: `http://${clientHost}:${clientPort}`,
  })
)

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`)
  console.log(`Running a GraphQL API server at http://${host}:${port}/graphql`)
})
