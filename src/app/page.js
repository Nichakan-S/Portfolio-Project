'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react';

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('email', email)
      console.log('password', password)
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result.error) {
        console.error(result.error);
      } else {
        const session = await getSession();
        console.log(session);
        console.log(session?.user?.role);
        console.log(session?.user?.id);
        if (session?.user?.role === 'admin') {
          console.log('Admin logged in');
          router.push('/admin');
        } else if (session?.user?.role === 'user') {
          console.log('User logged in');
          router.push('/users');
        } else {
          console.log('Unknown role');
        }
      }

    } catch (error) {
      console.log('Login error', error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <form
    onSubmit={handleSubmit}
    className="p-8 bg-white shadow-md rounded-lg max-w-sm w-full"
  >
    <div className="mb-4">
      <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
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
      <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
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
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Sign In
    </button>
  </form>
</div>
  )
}