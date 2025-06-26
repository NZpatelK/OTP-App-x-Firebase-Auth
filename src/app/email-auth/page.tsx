'use client'

import { useState } from 'react'
import { auth } from '@/app/lib/firebase'
import { sendSignInLinkToEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Modal from '../components/Modal'

export default function EmailLogin() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('Enter your email to receive a magic link.')
  const router = useRouter()

  const actionCodeSettings = {
    url: `${window.location.origin}/email-auth/verify`,
    handleCodeInApp: true,
  }

  const handleSendLink = async () => {
    const sanitizedEmail = email.trim().toLowerCase()

    if (!sanitizedEmail || !sanitizedEmail.includes('@')) {
      setMessage('Please enter a valid email address.')
      setIsModalOpen(true)
      return
    }

    try {
      await sendSignInLinkToEmail(auth, sanitizedEmail, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', sanitizedEmail)
      setMessage('Magic link sent! Please check your email.')
      setIsModalOpen(true)
      setTimeout(() => router.push('/home'), 2000)
    } catch (error) {
      console.error('Send link error:', error)
      setMessage('Failed to send magic link. Please try again later.')
      setIsModalOpen(true)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="border shadow-lg rounded-lg p-6 bg-white w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Sign In with Email</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setMessage('') }}
          className="border p-2 rounded w-full mb-4 bg-gray-100 text-gray-800"
        />
        <button
          onClick={handleSendLink}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Send Magic Link
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-2 text-center">
          <h2 className="text-lg mb-6 text-gray-800">{message}</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </Modal>
    </main>
  )
}
