import { GraphQLError } from "graphql"

export default class EmailExistsError extends GraphQLError {
  constructor() {
    super("Email already in use", {
      extensions: {
        code: "CONFLICT",
        http: { status: 409 },
      },
    })
  }
}
