import bcrypt from "bcrypt"
import { QueryResolvers } from "../../__generated__/resolvers-types"

import { InvalidLoginError } from "../../utils/errors/index.js"
import { AistantApolloContext } from "../../types.js"
import prisma from "../client.js"

const signIn: QueryResolvers<AistantApolloContext>["signIn"] = async (
  _,
  { input: { email, password } }
) => {
  const user = await prisma.findUser({ email })
  if (!user) {
    throw new InvalidLoginError()
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    throw new InvalidLoginError()
  }

  const { accessToken, refreshToken } = await prisma.createTokens(user)

  return { accessToken, refreshToken }
}

export default signIn
