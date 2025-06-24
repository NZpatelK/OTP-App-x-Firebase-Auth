'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/app/lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import SixDigitCodeInput from '../components/sixDigitCodeInput'

export default function PhoneLogin() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => { },
      })
    }
  }, [])

  const sendCode = async () => {
    try {
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      setConfirmationResult(result)
      setIsSubmitting(true);
      alert('Code sent!')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const verifyCode = async () => {
    try {
      await confirmationResult.confirm(code)
      router.push(`/welcome`)
    } catch (err: any) {
      alert('Invalid code')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-8 w-full max-w-lg flex flex-col">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">{isSubmitting ? 'Enter Verification Code' : 'Sign in with Phone'}</h1>

        {!isSubmitting && <div className="flex flex-col max-w-md flex flex-col">
          <input
            type="tel"
            placeholder="+64..."
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
          />
          <button
            onClick={sendCode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 text-lg font-semibold"
          >
            Send Code
          </button>
        </div>}

        {isSubmitting && <SixDigitCodeInput verifyCode={(e) => setCode(e)} />
        // <div className="flex flex-col max-w-md flex flex-col">
        //   <input
        //     type="text"
        //     placeholder="Enter Code"
        //     onChange={(e) => setCode(e.target.value)}
        //     className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
        //   />
        //   <button
        //     onClick={verifyCode}
        //     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 text-lg font-semibold"
        //   >
        //     Verify Code
        //   </button>
        // </div>
        }

        <div id="recaptcha-container" className="mt-6" />
      </div>
    </main>

  )
}
