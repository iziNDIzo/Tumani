"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MyDrivePage(){
  const [driver, setDriver] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async()=>{
      const { data: {user} } = await supabase.auth.getUser()
      if(!user) return
      const { data } = await supabase.from('drivers').select('*').eq('user_id', user.id).single()
      setDriver(data)
      setLoading(false)
    }
    load()
  },[])

  if(loading) return <div className="p-10 font-black">Loading...</div>

  // NOT VERIFIED YET
  if(!driver?.verified){
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#fcfcfc]">
        <div className="max-w-[520px] w-full bg-white rounded-[32px] border border-black/10 p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto text-3xl">⏳</div>
          <h1 className="font-black text-[30px] mt-6 leading-none">Application Received!</h1>
          <p className="text-black/60 font-medium mt-3">Thanks {driver?.full_name?.split(' ')[0]}, we’re reviewing your vehicle <b>{driver?.registration_number}</b></p>

          <div className="mt-8 bg-black/5 rounded-2xl p-5 text-left">
            <p className="text-[11px] font-black tracking-widest text-black/40">WHAT HAPPENS NEXT</p>
            <ol className="mt-3 space-y-2 text-[14px] font-bold">
              <li>1. Admin verifies your docs (under 2 hours)</li>
              <li>2. You get WhatsApp approval</li>
              <li>3. Then you can Post Trips here</li>
            </ol>
          </div>

          <p className="text-[12px] text-black/40 mt-6">Need help? WhatsApp us 099... </p>
          <button onClick={async()=>{await supabase.auth.signOut(); location.href="/"}} className="mt-6 w-full h-[56px] bg-black text-white rounded-full font-black">Logout</button>
        </div>
      </div>
    )
  }

  // VERIFIED - CLEAN POST TRIP
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-black text-[28px]">My Drive — ✅ Verified</h1>
        <p className="text-sm font-bold text-black/60">Welcome, {driver.full_name}</p>
      </div>

      <div className="bg-white rounded-[32px] border border-black/10 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <h2 className="font-black text-xl mb-6">Post New Trip</h2>
        <p className="text-sm text-black/60 font-medium mb-6 -mt-4">This trip will be visible to passengers on Find Trips</p>

        {/* Your existing Post Trip form goes here - keep it */}
        {/* I removed Driver Name / WhatsApp inputs because we already know them from driver profile */}

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="From e.g. Mchinji" className="h-[56px] px-5 rounded-full border-2 border-black font-bold" />
          <input placeholder="To e.g. Lilongwe" className="h-[56px] px-5 rounded-full border-2 border-black font-bold" />
        </div>
        {/*... rest of your form */}
      </div>
    </div>
  )
}