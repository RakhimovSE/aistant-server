import { MutationResolvers } from "../../__generated__/resolvers-types"

import { EmailExistsError } from "../../utils/errors/index.js"
import { AistantApolloContext } from "../../types.js"
import prisma from "../client.js"

const signUp: MutationResolvers<AistantApolloContext>["signUp"] = async (
  _,
  { input: { email, password, firstName, lastName, avatar } }
) => {
  const existingUser = await prisma.findUser({ email })
  if (existingUser) {
    throw new EmailExistsError()
  }

  const user = await prisma.createUser(
    email,
    password,
    firstName,
    lastName,
    avatar
  )
  const { accessToken, refreshToken } = await prisma.createTokens(user)

  return {
    code: "200",
    success: true,
    message: "User successfully created",
    accessToken: accessToken,
    refreshToken: refreshToken,
  }
}

export default signUp
