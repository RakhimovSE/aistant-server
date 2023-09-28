import dotenv from "dotenv"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import express from "express"
import http from "http"
import cors from "cors"
import bodyParser from "body-parser"
import { readFileSync } from "fs"

import { resolvers } from "./src/resolvers.js"

dotenv.config({ override: true })
const host = process.env.HOSTNAME
const port = process.env.PORT

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" })

export interface MyContext {
  token?: string
}

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
await server.start()

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
)

await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
console.log(`🚀 Server ready at http://${host}:${port}/`)
console.log(`Running a GraphQL API server at http://${host}:${port}/graphql`)
