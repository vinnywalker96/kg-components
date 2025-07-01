import { SignupForm } from '@/components/auth/signup-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | KG Components',
  description: 'Create a new account',
}

export default function SignupPage() {
  return (
    <div className="container max-w-screen-md py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Create a New Account</h1>
      <SignupForm />
    </div>
  )
}

