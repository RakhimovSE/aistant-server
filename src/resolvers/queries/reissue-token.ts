import jwt from "jsonwebtoken"

import { QueryResolvers } from "../../__generated__/resolvers-types"
import {
  InvalidRefreshTokenError,
  UnauthorizedError,
} from "../../utils/errors/index.js"
import { AistantApolloContext, RefreshTokenPayload } from "../../types.js"
import prisma from "../client.js"
import { hashToken } from "../../utils/jwt.js"

const reissueToken: QueryResolvers<AistantApolloContext>["reissueToken"] =
  async (_, { refreshToken }) => {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as RefreshTokenPayload
    const savedRefreshToken = await prisma.findRefreshToken(payload.jti)

    if (!savedRefreshToken || savedRefreshToken.revoked) {
      throw new InvalidRefreshTokenError()
    }

    const hashedToken = hashToken(refreshToken)
    if (hashedToken !== savedRefreshToken.hashedToken) {
      throw new InvalidRefreshTokenError()
    }

    const user = await prisma.findUser({ id: payload.userId })
    if (!user) {
      throw new UnauthorizedError()
    }

    await prisma.revokeToken(savedRefreshToken.id)
    const { accessToken, refreshToken: newRefreshToken } =
      await prisma.createTokens(user)

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }

export default reissueToken
