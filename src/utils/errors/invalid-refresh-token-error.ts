import { GraphQLError } from "graphql"

export default class InvalidRefreshTokenError extends GraphQLError {
  constructor() {
    super("Refresh token is not valid", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    })
  }
}
