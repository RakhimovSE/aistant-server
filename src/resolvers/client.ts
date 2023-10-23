import crypto from "crypto"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient, User } from "@prisma/client"

import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"

class AistantPrismaClient extends PrismaClient {
  async findUser(data: { id: number } | { email: string }) {
    return await this.user.findUnique({ where: data })
  }

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar?: string | null
  ) {
    const hashedPassword = bcrypt.hashSync(password, 10)
    return await this.user.create({
      data: { email, password: hashedPassword, firstName, lastName, avatar },
    })
  }

  async createTokens(user: User) {
    const jti = uuidv4()
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user, jti)

    await this.refreshToken.create({
      data: {
        id: jti,
        hashedToken: crypto
          .createHash("sha512")
          .update(refreshToken)
          .digest("hex"),
        userId: user.id,
      },
    })

    return {
      accessToken,
      refreshToken,
    }
  }
}

const prisma = new AistantPrismaClient()

export default prisma
