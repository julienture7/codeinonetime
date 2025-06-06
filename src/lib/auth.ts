
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
// import { User } from '@prisma/client'; // Original problematic import

// Placeholder/Mock Prisma User type (should match the one in src/types/index.ts or be imported)
type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  password?: string | null; 
  role: string; 
  kidName?: string | null;
};


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          // @ts-ignore // Prisma types might not be fully mocked for args
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          kidName: user.kidName,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.kidName) {
         token.kidName = session.kidName;
      }
      if (user) {
        token.id = user.id;
        token.role = (user as User).role; 
        token.kidName = (user as User).kidName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.kidName = token.kidName as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    // error: '/auth/error', // Custom error page
    // newUser: '/auth/new-user' // New users will be created via API
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
