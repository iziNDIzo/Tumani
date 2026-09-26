'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      // Go back to the page that sent you here, e.g. /login?next=/apply-driver.
      // Only allow paths inside this site (must start with a single "/").
      const next = new URLSearchParams(window.location.search).get('next')
      const safe = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
      router.push(safe)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login to Tumani</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" required className="w-full border p-3 rounded" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full border p-3 rounded" onChange={e => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-bold">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link href="/signup" className="text-blue-600">Sign up</Link>
        </p>
      </div>
    </div>
  )
}