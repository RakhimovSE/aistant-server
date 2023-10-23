import { GraphQLError } from "graphql"

export default class NotAuthenticatedError extends GraphQLError {
  constructor() {
    super("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    })
  }
}
