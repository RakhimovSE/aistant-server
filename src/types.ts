import { User } from "@prisma/client"

export type UserPayload = {
  id: User["id"]
  email: User["email"]
  firstName: User["firstName"]
  lastName: User["lastName"]
  emailVerifiedAt: number | undefined
  avatar: User["avatar"]
}

export interface AistantApolloContext {
  user?: UserPayload
}
