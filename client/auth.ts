import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL } from "@/lib/utils";

declare module "next-auth" {
  interface User {
    token: string;
    full_name: string;
    balance: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `${API_URL}/customer/login/`,
            credentials,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!data.token) {
            return null;
          }

          return {
            id: data.user_id,
            token: data.token,
            email: data.email,
            name: data.username,
            full_name: data.full_name,
            balance: data.balance,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.token = user.token;
        token.full_name = user.full_name;
        token.balance = user.balance;
      }

      if (trigger === "update") {
        return {
          ...token,
          ...session?.user,
          balance: session?.user?.balance,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.token = token.token as string;
      session.user.full_name = token.full_name as string;
      session.user.balance = token.balance as number;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.AUTH_SECRET,
});
