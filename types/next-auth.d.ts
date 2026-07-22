import { UserRole } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      restrictedToTalento: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    restrictedToTalento: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    id: string
    restrictedToTalento: boolean
  }
}