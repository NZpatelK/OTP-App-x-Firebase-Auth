'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/app/lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import SixDigitCodeInput from '@/app/components/SixDigitCodeInput'
import Modal from '../components/Modal'

export default function PhoneLogin() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          console.log('reCAPTCHA solved', response)
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired, resetting...')
          window.recaptchaVerifier.clear()
          delete window.recaptchaVerifier
        },
      })
    }

    return () => {
      if (window.recaptchaVerifier?.clear) {
        window.recaptchaVerifier.clear()
        delete window.recaptchaVerifier
      }
    }
  }, [])

  const sendCode = async () => {
    const sanitizedPhone = phone.trim()

    if (!sanitizedPhone.startsWith('+') || sanitizedPhone.length < 10) {
      setMessage('Please enter a valid phone number in international format (e.g., +6421XXXXXXX).')
      setIsModalOpen(true)
      return
    }

    try {
      setIsSubmitting(true)
      setLoading(true)
      const result = await signInWithPhoneNumber(auth, sanitizedPhone, window.recaptchaVerifier)
      setConfirmationResult(result)
      setMessage('Verification code sent to your phone.')
      setIsModalOpen(true)
    } catch (err: any) {
      console.error('Error sending code:', err)
      setMessage('Failed to send code. Please try again later.')
      setIsModalOpen(true)
    }
    finally {
      setLoading(false)
    }
  }


  const verifyCode = async (code: string) => {
    if (!confirmationResult) {
      setMessage('Verification session expired. Please request a new code.')
      setIsModalOpen(true)
      setIsSubmitting(false)
      return
    }

    try {
      const trimmedCode = code.trim()
      const result = await confirmationResult.confirm(trimmedCode)
      console.log('Verification successful:', result)
      setMessage('Login successful! Redirecting...')
      router.push('/welcome')
    } catch (err: any) {
      console.error('Verification failed:', err)
      setMessage('Invalid verification code. Please try again.')
      setIsModalOpen(true)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-8 w-full max-w-lg flex flex-col">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          {isSubmitting ? 'Enter Verification Code' : 'Sign in with Phone'}
        </h1>

        {loading && (
          <p className="text-gray-600 text-lg text-center">
            Please wait while we verify your phone number.
          </p>
        )}

        {!isSubmitting && (
          <div className="flex flex-col max-w-md">
            <input
              type="tel"
              placeholder="+64..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            />
            <button
              onClick={sendCode}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 text-lg font-semibold"
            >
              Send Code
            </button>
          </div>
        )}

        {isSubmitting && !loading && (
          <SixDigitCodeInput verifyCode={verifyCode} />
        )}


        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <h4 className="m-4 text-lg text-gray-600 text-center">{message}</h4>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-blue-500 mt-4 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full"
          >
            Close
          </button>
        </Modal>

        <div id="recaptcha-container" className="mt-6" />
      </div>
    </main>
  )
}
