'use client'  

import { useRouter } from 'next/navigation'

export default function HomePage() {
    const router = useRouter()
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white shadow-xl p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 capitalize">
                    Check your email
                </h1>
                <p className="text-gray-600">
                    We’ve sent you a confirmation link. Please check your inbox and follow the instructions.
                </p>
                <button className="mt-4 px-10 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ease-in-out duration-300" onClick={() => router.push('/')}>Go Home</button>
            </div>
        </main>
    );
}