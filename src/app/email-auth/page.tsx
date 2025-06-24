'use client'

import { useState } from 'react'
import { auth } from '@/app/lib/firebase'
import { sendSignInLinkToEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function EmailLogin() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const actionCodeSettings = {
    url: `${window.location.origin}/email-auth/verify`, // where user returns after clicking magic link
    handleCodeInApp: true,
  }

  const handleSendLink = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      alert('Magic link sent! Please check your email.')
      router.push('/email-auth/verify')
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Passwordless Email Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full max-w-md mb-4 bg-gray-200 text-gray-800" 
      />
      <button
        onClick={handleSendLink}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Magic Link
      </button>
    </main>
  )
}
