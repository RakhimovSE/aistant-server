import jwt from "jsonwebtoken"
import { User } from "@prisma/client"
import { UserPayload } from "../types"

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(user: User) {
  const data: UserPayload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerifiedAt: user.emailVerifiedAt?.getTime(),
    avatar: user.avatar,
  }
  return jwt.sign(data, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "5m",
  })
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
export function generateRefreshToken(user: User, jti: string) {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "8h",
    }
  )
}
