import { NextAuthOptions } from 'next-auth'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          // 簡単なダミー認証（実際の実装では適切なハッシュ検証を行う）
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            // 新しいユーザーを作成
            console.log('Creating new user for:', credentials.email)
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0],
                pointsBalance: 400,
              }
            })
            console.log('New user created:', user.id)
          }

          console.log('User authenticated:', user.id)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // GoogleプロバイダーでのサインインとCredentialsプロバイダーでのサインインを処理
      if (account?.provider === 'google') {
        try {
          // GoogleからサインインしたユーザーをDBで検索または作成
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!dbUser) {
            // 新しいユーザーを作成
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: user.image,
                pointsBalance: 400,
              }
            })
            console.log('New Google user created:', dbUser.id)
          }

          // user.idを更新してjwtコールバックで使用できるようにする
          user.id = dbUser.id
          return true
        } catch (error) {
          console.error('Error handling Google sign in:', error)
          return false
        }
      }
      
      // Credentialsプロバイダーの場合は既存の処理をそのまま使用
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        
        // データベースから最新のユーザー情報を取得
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
              position: true,
              image: true,
            }
          })
          
          if (user) {
            session.user.name = user.name
            session.user.email = user.email
            session.user.image = user.image
          }
        } catch (error) {
          console.error('Error fetching user in session:', error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}