// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import {  User } from "@prisma/client";
import { authOptions } from "./auth";
import { UserProp, UserProps } from "@/types/types";

// Type for authenticated user with permissions
export interface AuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  // roles: Role[];
  permissions: string[];
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Function to check authorization and return NotAuthorized component if needed
// export async function checkPermission(requiredPermission: string) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/login");
//   }

//   const userPermissions = session.user.permissions || [];

//   if (!userPermissions.includes(requiredPermission)) {
//     // Redirect to unauthorized page or return unauthorized component
//     redirect("/unauthorized");
//   }

//   return true;
// }

// Function to get authenticated user or redirect
export async function getAuthenticatedUser(): Promise<UserProp> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
    throw new Error("User not authenticated"); 
  }

  return session.user as UserProp;
}
export async function getAuthenticatedUser2(): Promise<UserProp> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated"); 
  }
  return session.user as UserProp;
}

// Function to check multiple permissions (any)
// export async function checkAnyPermission(permissions: string[]) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/login");
//   }

//   const userPermissions = session.user.permissions || [];

//   const hasAnyPermission = permissions.some((permission) =>
//     userPermissions.includes(permission)
//   );

//   if (!hasAnyPermission) {
//     redirect("/unauthorized");
//   }

//   return true;
// }

// Function to check multiple permissions (all)
// export async function checkAllPermissions(permissions: string[]) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/login");
//   }

//   const userPermissions = session.user.permissions || [];

//   const hasAllPermissions = permissions.every((permission) =>
//     userPermissions.includes(permission)
//   );

//   if (!hasAllPermissions) {
//     redirect("/unauthorized");
//   }

//   return true;
// }
