import fetch from "node-fetch"
import { Book, Resolvers } from "./__generated__/resolvers-types.js"

type ResponseUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

const books: Book[] = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
]

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }) => {
      try {
        const res = await fetch(`https://reqres.in/api/users/${id}`)
        const { data: user } = (await res.json()) as { data: ResponseUser }
        return {
          id: String(user.id),
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar,
        }
      } catch {
        return null
      }
    },
    quoteOfTheDay: () => {
      return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
    },
    random: () => {
      return Math.random()
    },
    rollThreeDice: () => {
      return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6))
    },
    rollDice: (_, { numDice, numSides }) => {
      var output = []
      for (var i = 0; i < numDice; i++) {
        output.push(1 + Math.floor(Math.random() * (numSides || 6)))
      }
      return output
    },
    books: () => books,
  },
  Mutation: {
    addUser: (parent, args, context, info) => {
      console.log(parent, args, context, info)
      return {
        code: "301",
        success: false,
        message: "Not implemented",
      }
    },
  },
}
