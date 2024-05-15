'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { WarningAlert } from './components/sweetalert';

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result.error) {
        console.error(result.error)
        WarningAlert('ผิดพลาด!', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง!!');
      } else {
        const session = await getSession()
        if (session?.user?.role === 'admin') {
          router.push(`/admin/${session?.user?.id}`)
        } else if (session?.user?.role === 'user') {
          router.push(`/users/${session?.user?.id}`)
        } else {
          console.log('Unknown role')
        }
      }
    } catch (error) {
      console.log('Login error', error)
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/image/BgChandra.jpg')" }}
    >
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <img
            src="/image/Newchandralogo1.png"
            alt="Logo"
            className=" h-36 w-28"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  )
}
