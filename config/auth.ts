import { AuthOptions, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/prisma/db";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
          systemRole: "USER",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            systemRole: user.systemRole,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      // For Google provider, check if user with this email already exists
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // Link Google account to existing credentials user
          if (!existingUser.systemRole) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { systemRole: "USER" },
            });
          }
          
          // Update user with Google details if they don't have them yet
          if (!existingUser.image && user.image) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { image: user.image },
            });
          }
          
          // Link Google account if not already linked
          const existingAccount = await db.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
            },
          });
          
          if (!existingAccount && account.providerAccountId) {
            // Create a new account link
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type || "oauth",
                provider: "google",
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
        }
        // New user via OAuth will be handled by the adapter
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.systemRole || "USER"; // Map systemRole to role
      }

      // Handle session update (for role changes)
      if (trigger === "update" && session?.user) {
        if (session.user.role) {
          token.role = session.user.role;
        }
      }

      // Always return the latest user data on token refresh
      if (token.email) {
        const userData = await db.user.findUnique({
          where: { email: token.email },
        });
        
        if (userData) {
          token.role = userData.systemRole;
          token.picture = userData.image || token.picture;
          token.name = userData.name || token.name;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
  },
};