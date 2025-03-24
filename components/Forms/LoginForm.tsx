"use client"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import type { LoginProps } from "@/types/types"
import toast from "react-hot-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { FaGithub, FaGoogle, FaApple } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { Separator } from "@/components/ui/separator"
import CustomCarousel from "../frontend/custom-carousel"
import Logo from "../frontend/Logo"

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LoginProps>()
  const params = useSearchParams()
  const returnUrl = params.get("returnUrl") || "/dashboard"
  const [passErr, setPassErr] = useState("")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true)
      setPassErr("")
      console.log("Attempting to sign in with credentials:", data)
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      })
      console.log("SignIn response:", loginData)
      if (loginData?.error) {
        setLoading(false)
        toast.error("Sign-in error: Check your credentials")
        setPassErr("Wrong Credentials, Check again")
      } else {
        reset()
        setLoading(false)
        toast.success("Login Successful")
        setPassErr("")
        router.push(returnUrl)
      }
    } catch (error) {
      setLoading(false)
      console.error("Network Error:", error)
    }
  }
  const handleGoogleSignIn = () => {
   
    signIn("google", { callbackUrl: returnUrl });
  }

  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px]  relative ">
      <div className="flex items-center justify-center md:pb-10 md:pt-0 pt-12">
        <div className="mx-auto  md:max-w-[500px] w-full md:px-6">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>

          <div className="bg-white rounded-xl shadow-lg md:p-8 p-4 border border-gray-100">
            <div className="text-center mb-3">
              <h1 className="text-base font-bold">Log in to your account</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Welcome back to <span className="text-primary">Arbnb</span>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full h-10 px-4 py-2 border text-sm ${
                      errors.email ? "border-red-500" : "border-gray-300"
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
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                <input
  id="password"
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  className={`w-full h-10 px-4 py-2 text-sm border ${
    errors.password ? "border-red-500" : "border-gray-300"
  } rounded-lg focus:outline-none text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition placeholder:text-sm`}
  {...register("password", {
    required: "Password is required",
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
                {passErr && <p className="text-red-500 text-xs mt-1">{passErr}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg font-medium">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>

            <div className="relative my-3">
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
        Sign in with Google
      </Button>

            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}

