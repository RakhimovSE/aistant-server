import express, { Express, Request, Response } from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import dotenv from "dotenv"

dotenv.config({ override: true })

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world! 123"
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
