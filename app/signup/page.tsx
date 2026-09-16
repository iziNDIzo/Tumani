'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { 
        emailRedirectTo: `${window.location.origin}/login` 
      }
    })

    if (error) {
      alert('Error: ' + error.message)
      console.error(error)
    } else {
      alert('Account created! Check your email to confirm, then login.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Create Account</h1>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              required 
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Min 6 characters" 
              value={password}
              required 
              minLength={6}
              className="w-full border-gray-300 p-3 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}