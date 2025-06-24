'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/app/lib/firebase'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function EmailVerify() {
  const [message, setMessage] = useState('Verifying...')
  const router = useRouter()

  useEffect(() => {
    async function verify() {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn')
        if (!email) {
          email = window.prompt('Please enter your email for confirmation')
        }
        if (!email) {
          setMessage('Email required for sign-in')
          return
        }
        try {
          const result = await signInWithEmailLink(auth, email, window.location.href)
          window.localStorage.removeItem('emailForSignIn')
          setMessage('Login successful! Redirecting...')
          router.push('/welcome') // no uid in url needed
        } catch (error: any) {
          setMessage('Error: ' + error.message)
        }
      } else {
        setMessage('Invalid sign-in link.')
      }
    }
    verify()
  }, [router])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 text-center">
      <p className="text-lg text-gray-800">{message}</p>
    </main>
  )
}
