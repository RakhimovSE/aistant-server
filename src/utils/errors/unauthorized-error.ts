import { GraphQLError } from "graphql"

export default class UnauthorizedError extends GraphQLError {
  constructor() {
    super("User not found", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    })
  }
}
