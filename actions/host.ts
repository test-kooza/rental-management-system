"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { generateNumericToken } from "@/lib/token";
import { compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import VerificationEmail from "@/components/email-templates/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface VerifyHostCredentials {
  email: string;
  password: string;
}

interface VerifyHostCode {
  verificationCode: string;
}

export async function verifyHostCredentials(data: VerifyHostCredentials) {
  const { email, password } = data;

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        error: "Account not found. Please sign up first.",
        status: 404,
        data: null,
      };
    }

    // Verify password
    if (!user.password) {
      return {
        error: "Please use the same method you used to create your account.",
        status: 400,
        data: null,
      };
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return {
        error: "Invalid credentials. Please try again.",
        status: 401,
        data: null,
      };
    }

    // Check if user is already a host
    if (user.systemRole === "HOST") {
      return {
        error: "You are already registered as a host.",
        status: 409,
        data: null,
      };
    }

    const verificationCode = generateNumericToken(6);

    await db.user.update({
      where: { id: user.id },
      data: { token: verificationCode },
    });

    await resend.emails.send({
      from: "Arbnb <orders@rwoma.com>",
      to: [email],
      subject: "Verify your host account",
      react: VerificationEmail({ 
        name: user.name || "User", 
        verificationCode,
        email
      }),
    });

    return {
      error: null,
      status: 200,
      data: { email },
    };
  } catch (error) {
    console.error("Error verifying host credentials:", error);
    return {
      error: "Something went wrong. Please try again.",
      status: 500,
      data: null,
    };
  }
}

// Resend verification code
export async function resendVerificationCode(email: string) {
  try {
    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        error: "Account not found.",
        status: 404,
        data: null,
      };
    }

    // Generate 6-digit verification code
    const verificationCode = generateNumericToken(6);

    // Update user with verification token
    await db.user.update({
      where: { id: user.id },
      data: { token: verificationCode },
    });

    // Send verification email
    await resend.emails.send({
      from: "Arbnb <verification@arbnb.com>",
      to: [email],
      subject: "Verify your host account",
      react: VerificationEmail({ 
        name: user.name || "User", 
        verificationCode,
        email
      }),
    });

    return {
      error: null,
      status: 200,
      data: { success: true },
    };
  } catch (error) {
    console.error("Error resending verification code:", error);
    return {
      error: "Something went wrong. Please try again.",
      status: 500,
      data: null,
    };
  }
}

// Verify the code and update user role
export async function verifyHostCode(data: VerifyHostCode, email: string) {
  const { verificationCode } = data;

  try {
    // Find user with matching email and verification code
    const user = await db.user.findFirst({
      where: {
        email,
        token: verificationCode,
      },
    });

    if (!user) {
      return {
        error: "Invalid verification code. Please try again.",
        status: 401,
        data: null,
      };
    }

    // Update user role to HOST and clear token
    await db.user.update({
      where: { id: user.id },
      data: {
        systemRole: "HOST",
        token: null, // Clear the token after successful verification
      },
    });

    // Revalidate session
    revalidatePath("/dashboard");

    return {
      error: null,
      status: 200,
      data: { success: true },
    };
  } catch (error) {
    console.error("Error verifying host code:", error);
    return {
      error: "Something went wrong. Please try again.",
      status: 500,
      data: null,
    };
  }
}