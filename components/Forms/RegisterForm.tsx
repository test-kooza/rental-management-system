"use client";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserProps } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createUser } from "@/actions/users";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import Logo from "../frontend/Logo";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserProps>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.name = data.name;
    data.image =
      "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
    try {
      const res = await createUser(data);
      if (res.status === 409) {
        setLoading(false);
        setEmailErr(res.error);
      } else if (res.status === 200) {
        setLoading(false);
        toast.success("Account Created successfully");
        router.push("/login");
      } else {
        setLoading(false);
        toast.error("Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong, try again");
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] relative">
      <div className="flex items-center justify-center md:pb-4 md:pt-0 pt-12">
        <div className="mx-auto md:max-w-[500px] w-full md:px-6">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>

          <div className="bg-white rounded-xl shadow-lg md:p-8 p-4 border border-gray-100">
            <div className="text-center mb-3">
              <h1 className="text-base font-bold">Create an account</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Welcome to <span className="text-primary">Arbnb</span>
              </p>
            </div>

            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold">
                  Full Name :
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full h-10 px-4 py-2 border text-sm ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none placeholder:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
                    {...register("name", {
                      required: "Full name is required",
                    })}
                  />
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email :
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full h-10 px-4 py-2 border text-sm ${
                      errors.email || emailErr ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none placeholder:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                {emailErr && <p className="text-red-500 text-xs mt-1">{emailErr}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password :
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className={`w-full h-10 px-4 py-2 text-sm border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition placeholder:text-sm`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg font-medium">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500 uppercase">or continue with</span>
              </div>
            </div>

            <div className="grid gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full h-12 text-sm font-medium border-[1px] border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <img src="https://cdn-icons-png.flaticon.com/128/2702/2702602.png" alt="" className="w-4 h-4 mr-2" />
                Sign up with Google
              </Button>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}