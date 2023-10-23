import { GraphQLError } from "graphql"

export default class InvalidAccessTokenError extends GraphQLError {
  constructor() {
    super("Access token is not valid", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    })
  }
}
