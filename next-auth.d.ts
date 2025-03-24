import { DefaultSession } from "next-auth";
import { SystemRole } from "@prisma/client";

// Type for login form
export interface LoginProps {
  email: string;
  password: string;
}

// Type for user registration
export interface UserProps {
  email: string;
  password: string;
  name: string;
  image?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: SystemRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    systemRole?: SystemRole;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: SystemRole;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}