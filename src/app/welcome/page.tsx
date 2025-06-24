'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'

export default function Welcome() {
  const [userUID, setUserUID] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid)
        setLoading(false)
      } else {
        // Not logged in → redirect to home/login
        router.push('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  function handleLogout() {
    signOut(auth).then(() => {
      router.push('/')
    })
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <h1 className="text-3xl font-bold mb-4 text-green-800">Welcome!</h1>
      <p className="text-lg text-gray-700">You are now logged in.</p>
      <p className="text-sm text-gray-500 mt-2">
        Your UID: <code>{userUID}</code>
      </p>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>

    </main>
  )
}
