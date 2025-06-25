'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { User } from '../lib/userData'

export default function Welcome() {
  const [user, setUser] = useState<User | null>(null)
  const [isUser, setIsUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function fetchUsers() {
    const response = await fetch('/api/users')
    const data = await response.json()
    return data
  }

  async function addUser() {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    const data = await response.json()
    return data
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await fetchUsers()
        const userUid = user.uid

        if (userData) {
          const user = userData.find((user: User) => user.id === userUid)
          if (user) {
            setUser(user)
            setIsUser(true)
          }
          else {
            setUser({ id: userUid, name: '' })
            setIsUser(false)
          }
        }

        setLoading(false)
      } else {
        router.push('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  function handleChangeUserName(event: React.ChangeEvent<HTMLInputElement>) {
    setUser({ id: user?.id ?? '', name: event.target.value })
  }

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
      {!loading && isUser && <p className="text-sm text-gray-500 mt-2">
        Hello, {user?.name}
      </p>}
      {!loading && !isUser &&
        <div>
          <p className="text-lg text-gray-700">Please enter your name:</p>
          <input type="text" placeholder="Enter your name" value={user?.name} onChange={handleChangeUserName}  className="border border-gray-300 rounded px-2 py-1 mt-4" />
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={addUser}>Submit</button>
        </div>}
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  )
}
