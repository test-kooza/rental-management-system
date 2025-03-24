"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import Logo from "../frontend/Logo"
import toast from "react-hot-toast"
import { resendVerificationCode, verifyHostCode } from "@/actions/host"

export default function VerificationCodeForm() {
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState("")
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      router.push('/become-host')
    }
  }, [email, router])

  // Focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting multiple digits
      const digits = value.split('').slice(0, 6)
      const newCode = [...verificationCode]
      
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit
        }
      })
      
      setVerificationCode(newCode)
      
      // Focus on appropriate input after paste
      const nextIndex = Math.min(index + digits.length, 5)
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus()
      }
    } else {
      // Single digit input
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      
      // Auto-focus next input
      if (value && index < 5) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus()
        }
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move left
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowRight' && index < 5) {
      // Move right
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Email not found. Please try again.")
      return
    }
    
    const code = verificationCode.join('')
    
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      const response = await verifyHostCode({ verificationCode: code }, email)
      
      if (response.error) {
        setLoading(false)
        setError(response.error)
        toast.error(response.error)
      } else {
        toast.success("Host verification successful!")
        // Redirect to dashboard with updated session
        router.push('/dashboard')
      }
    } catch (error) {
      console.error("Verification error:", error)
      setLoading(false)
      setError("Something went wrong. Please try again.")
      toast.error("Verification failed. Please try again.")
    }
  }

  const handleResendCode = async () => {
    if (!email) return
    
    setResending(true)
    
    try {
      const response = await resendVerificationCode(email)
      
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success("New verification code sent!")
        // Reset inputs
        setVerificationCode(['', '', '', '', '', ''])
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus()
        }
      }
    } catch (error) {
      console.error("Resend error:", error)
      toast.error("Failed to resend code. Please try again.")
    } finally {
      setResending(false)
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
              <h1 className="text-xl font-bold">Verify Your Host Account</h1>
              <p className="text-muted-foreground text-sm mt-2">
                We've sent a 6-digit verification code to
              </p>
              <p className="font-medium text-sm">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ))}
              </div>
              
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 rounded-lg font-medium bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button 
                  type="button"
                  onClick={handleResendCode} 
                  disabled={resending}
                  className="text-primary font-medium hover:underline"
                >
                  {resending ? "Resending..." : "Resend Code"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}