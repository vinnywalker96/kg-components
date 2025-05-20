import { AuthForm } from "@/components/auth/auth-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | KG-Components",
  description: "Sign in to your KG-Components account or create a new account.",
}

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <AuthForm />
      </div>
    </div>
  )
}

