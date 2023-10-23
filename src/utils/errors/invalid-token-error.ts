import { GraphQLError } from "graphql"

export default class InvalidTokenError extends GraphQLError {
  constructor() {
    super("Access token is not valid", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    })
  }
}
