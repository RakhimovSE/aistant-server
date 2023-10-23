import jwt from "jsonwebtoken"

import { MutationResolvers } from "../../__generated__/resolvers-types"
import {
  InvalidRefreshTokenError,
  UnauthorizedError,
} from "../../utils/errors/index.js"
import { AistantApolloContext, RefreshTokenPayload } from "../../types.js"
import prisma from "../client.js"
import { hashToken } from "../../utils/jwt.js"

const refreshToken: MutationResolvers<AistantApolloContext>["refreshToken"] =
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
      code: "200",
      success: true,
      message: "Issued new access and refresh tokens successfully",
      accessToken,
      refreshToken: newRefreshToken,
    }
  }

export default refreshToken
