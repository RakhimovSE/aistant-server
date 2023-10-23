import { Resolvers } from "../__generated__/resolvers-types"
import { AistantApolloContext } from "../types.js"
import { me, signIn } from "./queries/index.js"
import { signUp } from "./mutations/index.js"

export const resolvers: Resolvers<AistantApolloContext> = {
  Query: { me, signIn },
  Mutation: { signUp },
}
