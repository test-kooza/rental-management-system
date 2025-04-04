"use server";
import { ResetPasswordEmail } from "@/components/email-templates/reset-password";
import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import bcrypt, { compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { PasswordProps } from "@/components/Forms/ChangePasswordForm";
import { Resend } from "resend";
import { generateToken } from "@/lib/token";
// import { generateNumericToken } from "@/lib/token";
const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export async function createUser(data: UserProps) {
  const { email, password, name, image } = data;

  try {
    // Check for existing user by email
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return {
        error: `This email ${email} is already in use`,
        status: 409,
        data: null,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        image,
        systemRole: "USER",
      },
    });

    return {
      error: null,
      status: 200,
      data: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      error: `Something went wrong, Please try again`,
      status: 500,
      data: null,
    };
  }
}
export async function getAllMembers() {
  try {
    const members = await db.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
     
    });
    return users;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}

export async function deleteUser(id: string) {
  try {
    const deleted = await db.user.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deleted,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function sendResetLink(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        status: 404,
        error: "We cannot associate this email with any user",
        data: null,
      };
    }
    const token = generateToken();
    const update = await db.user.update({
      where: {
        email,
      },
      data: {
        token,
      },
    });
    const userFirstname = user.name;

    const resetPasswordLink = `${baseUrl}/reset-password?token=${token}&&email=${email}`;
    const { data, error } = await resend.emails.send({
      from: "NextAdmin <info@desishub.com>",
      to: email,
      subject: "Reset Password Request",
      react: ResetPasswordEmail({ userFirstname, resetPasswordLink }),
    });
    if (error) {
      return {
        status: 404,
        error: error.message,
        data: null,
      };
    }
    console.log(data);
    return {
      status: 200,
      error: null,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "We cannot find your email",
      data: null,
    };
  }
}

export async function updateUserPassword(id: string, data: PasswordProps) {
  const existingUser = await db.user.findUnique({
    where: {
      id,
    },
  });
  // Check if the Old Passw = User Pass
  let passwordMatch: boolean = false;
  //Check if Password is correct
  if (existingUser && existingUser.password) {
    // if user exists and password exists
    passwordMatch = await compare(data.oldPassword, existingUser.password);
  }
  if (!passwordMatch) {
    return { error: "Old Password Incorrect", status: 403 };
  }
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
    revalidatePath("/dashboard/clients");
    return { error: null, status: 200 };
  } catch (error) {
    console.log(error);
  }
}
export async function resetUserPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const user = await db.user.findUnique({
    where: {
      email,
      token,
    },
  });
  if (!user) {
    return {
      status: 404,
      error: "Please use a valid reset link",
      data: null,
    };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const updatedUser = await db.user.update({
      where: {
        email,
        token,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      status: 200,
      error: null,
      data: null,
    };
  } catch (error) {
    console.log(error);
  }
}
