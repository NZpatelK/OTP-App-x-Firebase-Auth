'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <main className="flex items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-lg border border-gray-100 shadow-lg p-8 w-full max-w-md flex flex-col justify-between h-80">
        <h1 className="text-3xl font-bold font-sans mb-6 text-gray-800 text-center">Sign In with</h1>
        <div className="flex flex-col items-center space-y-4">
          <button
            className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-semibold transition ease-in-out duration-300"
            onClick={() => router.push('/email-auth')}
          >
            Email
          </button>
          <button
            className="w-full px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600 text-lg font-semibold transition ease-in-out duration-300"
            onClick={() => router.push('/phone-auth')}
          >
            Phone
          </button>
        </div>
      </div>
    </main>

  )
}
