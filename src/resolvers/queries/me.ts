import { QueryResolvers } from "../../__generated__/resolvers-types"

import {
  NotAuthenticatedError,
  UserNotFoundError,
} from "../../utils/errors/index.js"
import { AistantApolloContext } from "../../types.js"
import prisma from "../client.js"

const me: QueryResolvers<AistantApolloContext>["me"] = async (
  _,
  __,
  { user: userContext }
) => {
  if (!userContext) {
    throw new NotAuthenticatedError()
  }
  const user = await prisma.findUser({ id: userContext.id })
  if (!user) {
    throw new UserNotFoundError()
  }
  return {
    id: String(user.id),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerifiedAt: user.emailVerifiedAt?.getTime(),
    avatar: user.avatar,
  }
}

export default me
