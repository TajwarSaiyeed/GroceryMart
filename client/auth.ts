import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL } from "@/lib/utils";

declare module "next-auth" {
  interface User {
    token: string;
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

          console.log("Data from login:", data);

          if (!data.token) {
            throw new Error("Invalid credentials");
          }
          return {
            id: data.user_id,
            token: data.token,
            email: data.email,
            name: data.username,
          };
        } catch (error) {
          console.log("Error on login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.token = token.token as string;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.AUTH_SECRET,
});
