import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()
  const { addToast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await resetPassword(data.email)
      if (error) throw error
      setSent(true)
    } catch (error) {
      addToast(error.message || 'Failed to send reset email', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-secondary-50 dark:bg-secondary-950">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-secondary-900 dark:text-white">ContentAI</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Check your email</h1>
            <p className="text-secondary-500 mb-6">
              We&apos;ve sent a password reset link to your email address.
            </p>
            <Link to="/login">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Reset password</h1>
            <p className="text-secondary-500 mb-6">Enter your email to receive a reset link</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-secondary-500">
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
