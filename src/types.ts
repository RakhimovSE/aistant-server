import { User } from "@prisma/client"

export type AccessTokenPayload = {
  id: User["id"]
  email: User["email"]
  firstName: User["firstName"]
  lastName: User["lastName"]
  emailVerifiedAt: number | undefined
  avatar: User["avatar"]
}

export type RefreshTokenPayload = {
  userId: User["id"]
  jti: string
}

export interface AistantApolloContext {
  user?: AccessTokenPayload
}
