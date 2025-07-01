import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | KG Components',
  description: 'Login to your account',
}

export default function LoginPage() {
  return (
    <div className="container max-w-screen-md py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Login to Your Account</h1>
      <LoginForm />
    </div>
  )
}

