import dotenv from "dotenv"
import { ApolloServer } from "@apollo/server"
import {
  ExpressMiddlewareOptions,
  expressMiddleware,
} from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import jwt from "jsonwebtoken"
import express from "express"
import http from "http"
import cors from "cors"
import bodyParser from "body-parser"
import { readFileSync } from "fs"

import { AistantApolloContext, UserPayload } from "./src/types.js"
import { resolvers } from "./src/resolvers/index.js"

dotenv.config({ override: true })
const host = process.env.HOSTNAME
const port = process.env.PORT

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" })

const apolloContext: ExpressMiddlewareOptions<AistantApolloContext>["context"] =
  async ({ req }) => {
    const token = req.headers.authorization?.split("Bearer ")[1]

    if (!token) {
      return { user: undefined }
    }

    try {
      const user = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as UserPayload
      return { user }
    } catch {
      return { user: undefined }
    }
  }

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer<AistantApolloContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
await server.start()

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, { context: apolloContext })
)

await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
console.log(`🚀 Server ready at http://${host}:${port}/`)
console.log(`Running a GraphQL API server at http://${host}:${port}/graphql`)
