'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/app/lib/firebase'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function EmailVerify() {
  const [message, setMessage] = useState('Verifying...')
  const [emailInput, setEmailInput] = useState('')
  const [needsEmail, setNeedsEmail] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function verify() {
      const url = window.location.href

      if (isSignInWithEmailLink(auth, url)) {
        const storedEmail = window.localStorage.getItem('emailForSignIn')

        if (!storedEmail) {
          setNeedsEmail(true)
          setMessage('Please enter your email to complete sign-in.')
          setLoading(false)
          return
        }

        await completeSignIn(storedEmail)
      } else {
        setMessage('Invalid or expired sign-in link.')
        setLoading(false)
      }
    }

    verify()
  }, [])

  async function completeSignIn(email: string) {
    try {
      setLoading(true)
      await signInWithEmailLink(auth, email, window.location.href)
      window.localStorage.removeItem('emailForSignIn')
      setMessage('Sign-in successful! Redirecting...')
      setTimeout(() => router.push('/welcome'), 2000)
    } catch (error) {
      console.error('Sign-in error:', error)
      setMessage('Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedEmail = emailInput.trim().toLowerCase()

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setMessage('Please enter a valid email address.')
      return
    }

    window.localStorage.setItem('emailForSignIn', trimmedEmail)
    completeSignIn(trimmedEmail)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 text-center">
      <p className="text-lg text-gray-800 mb-4">{message}</p>

      {needsEmail && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border border-gray-300 rounded"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            Verify Email
          </button>
        </form>
      )}
    </main>
  )
}
