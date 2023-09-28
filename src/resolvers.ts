import { Prisma, PrismaClient } from "@prisma/client"
import { Resolvers } from "./__generated__/resolvers-types"

const prisma = new PrismaClient()

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } })
      return user ? { ...user, id: String(user.id) } : null
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const user = await prisma.user.create({
        data: {
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
          avatar: args.avatar,
        },
      })
      return {
        code: "200",
        success: true,
        message: "User created successfully",
        user: { ...user, id: String(user.id) },
      }
    },
    updateUser: async (_, { id, ...args }) => {
      const data: Prisma.UserUpdateInput = {}
      if (args.email) data.email = args.email
      if (args.firstName) data.firstName = args.firstName
      if (args.lastName) data.lastName = args.lastName
      if (args.avatar) data.avatar = args.avatar
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: data,
      })
      return {
        code: "200",
        success: true,
        message: "User updated successfully",
        user: { ...user, id: String(user.id) },
      }
    },
  },
}
