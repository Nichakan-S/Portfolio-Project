import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            rank: true,
          },
        })

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            employee: user.rank?.employee,
            evaluation: user.rank?.evaluation,
            overview: user.rank?.overview
          }
        } else {
          throw new Error('Invalid email or password')
        }
      },
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.employee = user.employee;
        token.evaluation = user.evaluation;
        token.overview = user.overview;
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.employee = token.employee;
        session.user.evaluation = token.evaluation;
        session.user.overview = token.overview;
      }
      return session
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
