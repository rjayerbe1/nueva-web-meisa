import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          restrictedToTalento: user.restrictedToTalento,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase() ?? ""
        if (!email.endsWith("@meisa.com.co")) {
          return false
        }
        const existing = await prisma.user.findUnique({ where: { email } })
        if (!existing) {
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
        token.restrictedToTalento = (user as any).restrictedToTalento ?? false
      }
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true, avatar: true, restrictedToTalento: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.restrictedToTalento = dbUser.restrictedToTalento
          ;(token as any).picture = dbUser.avatar ?? (token as any).picture
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.restrictedToTalento = token.restrictedToTalento as boolean
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Después del login, redirigir al admin si el usuario es admin/editor
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/admin`
      }
      // Si viene de otra URL, permitir esa redirección
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
    },
  },
}

// Middleware para proteger rutas
export const requireAuth = (role?: UserRole) => {
  return async (req: any, res: any, next: any) => {
    // Este middleware se usará en las API routes
    next()
  }
}