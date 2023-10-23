import { GraphQLError } from "graphql"

export default class UserNotFoundError extends GraphQLError {
  constructor() {
    super("User not found", {
      extensions: {
        code: "NOT_FOUND",
        http: { status: 404 },
      },
    })
  }
}
