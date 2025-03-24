"use client"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import type { LoginProps } from "@/types/types"
import toast from "react-hot-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"
import { Separator } from "@/components/ui/separator"
import Logo from "../frontend/Logo"
import { verifyHostCredentials } from "@/actions/host"

export default function BecomeHostForm() {
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LoginProps>()
  const params = useSearchParams()
  const [passErr, setPassErr] = useState("")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true)
      setPassErr("")
      
      const response = await verifyHostCredentials({
        email: data.email,
        password: data.password
      })
      
      if (response.error) {
        setLoading(false)
        toast.error(response.error)
        setPassErr(response.error)
      } else {
        reset()
        setLoading(false)
        toast.success("Verification code sent to your email!")
        router.push(`/become-host/verify?email=${encodeURIComponent(data.email)}`)
      }
    } catch (error) {
      setLoading(false)
      console.error("Network Error:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] relative">
      <div className="flex items-center justify-center md:pb-10 md:pt-0 pt-12">
        <div className="mx-auto md:max-w-[500px] w-full md:px-6">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>

          <div className="bg-white rounded-xl shadow-lg md:p-8 p-4 border border-gray-100">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold">Become a Host</h1>
              <p className="text-muted-foreground text-sm mt-2">
                Start your hosting journey with <span className="text-primary">Arbnb</span>
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Please sign in with your existing account to continue
              </div>
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
                  <label htmlFor="password" className="text-xs font-semibold">
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

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg font-medium bg-primary hover:bg-primary/90">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue to become a host"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500">
              Don't have an account yet?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <Link href="/login" className="text-xs text-gray-500 hover:underline">
                Return to regular login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}