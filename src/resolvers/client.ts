import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient, User, RefreshToken } from "@prisma/client"

import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/jwt.js"

class AistantPrismaClient extends PrismaClient {
  async findUser(data: { id: User["id"] } | { email: User["email"] }) {
    return await this.user.findUnique({ where: data })
  }

  async createUser(
    email: User["email"],
    password: User["password"],
    firstName: User["firstName"],
    lastName: User["lastName"],
    avatar?: User["avatar"]
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
        hashedToken: hashToken(refreshToken),
        userId: user.id,
      },
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async findRefreshToken(id: RefreshToken["id"]) {
    return await this.refreshToken.findUnique({ where: { id } })
  }

  async deleteRefreshToken(id: RefreshToken["id"]) {
    return await this.refreshToken.update({
      where: { id },
      data: { revoked: true },
    })
  }
}

const prisma = new AistantPrismaClient()

export default prisma
