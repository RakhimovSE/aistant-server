import { GraphQLError } from "graphql"

export default class InvalidLoginError extends GraphQLError {
  constructor() {
    super("Invalid login credentials", {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 403 },
      },
    })
  }
}
