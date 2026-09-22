"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // normalize phone
    const cleanPhone = phone.trim()

    const { data, error } = await supabase
     .from('drivers')
     .select('*')
     .eq('phone', cleanPhone)
     .maybeSingle()

    if(error ||!data){
      alert("Driver not found. Did you apply at /apply-driver? Use same phone.")
      setLoading(false)
      return
    }

    const isVerified = data.is_verified || data.verified || data.status==='verified'

    if(!isVerified){
      alert(`Zikomo ${data.full_name}! Status: PENDING. Admin will verify in 2hrs. You will get SMS.`)
      setLoading(false)
      router.push('/pending?phone='+cleanPhone)
      return
    }

    // Verified — save session
    localStorage.setItem('tumani_driver_id', data.id)
    localStorage.setItem('tumani_driver_phone', data.phone)
    localStorage.setItem('tumani_driver_name', data.full_name)

    router.push('/driver')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-5">
      <div className="max-w-[380px] w-full p-7 bg-white rounded-[24px] border border-black/5 shadow-xl">
        <div className="w-10 h-10 bg-[#0a84ff] rounded-[12px] text-white grid place-items-center font-black mb-4">T</div>
        <h1 className="text-[22px] font-black leading-[1]">Driver Login</h1>
        <p className="text-[12px] opacity-60 mt-2">Use phone you applied with. No password.</p>

        <form onSubmit={handleLogin} className="space-y-3 mt-6">
          <input
            type="tel"
            placeholder="0998838866"
            required
            value={phone}
            onChange={e=>setPhone(e.target.value)}
            className="w-full border-gray-200 p-3.5 rounded-[14px] text-[14px] font-medium"
          />
          <button disabled={loading} className="w-full bg-[#010d19] text-white p-3.5 rounded-full font-black text-[14px] disabled:opacity-50">
            {loading? 'Checking...' : 'Login with Phone →'}
          </button>
        </form>

        <div className="mt-4 text-center text-[12px]">
          <a href="/apply-driver" className="text-[#0a84ff] font-bold">New? Apply to become driver →</a>
        </div>

        <p className="text-[10px] opacity-40 mt-6 text-center">Demo: 0998838866 = Victor (verified)</p>
      </div>
    </div>
  )
}