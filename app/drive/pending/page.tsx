"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function PendingPage(){
  const [checked,setChecked]=useState(false)
  useEffect(()=>{
    const check = async ()=>{
      const {data:{user}} = await supabase.auth.getUser()
      if(!user) return
      const {data} = await supabase.from('drivers').select('verified').eq('id', user.id).single()
      if(data?.verified){
        setChecked(true)
        setTimeout(()=>{ window.location.href="/drive" }, 1500)
      }
    }
    check()
    const interval = setInterval(check, 5000)
    return ()=>clearInterval(interval)
  },[])

  if(checked) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-center"><h1 className="text-[32px] font-black text-green-400">✅ You're Verified!</h1><p className="mt-2 font-bold text-white/60">Redirecting to My Drive...</p></div></div>

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center p-6">
      <div className="bg-[#1c202a] border border-white/10 rounded-[32px] p-10 max-w-[420px] w-full text-center">
        <div className="w-16 h-16 bg-amber-400 rounded-full mx-auto flex items-center justify-center text-black font-black text-[24px]">!</div>
        <h1 className="mt-6 text-[24px] font-black">Verification in Progress</h1>
        <p className="mt-3 text-[14px] text-white/50 font-bold leading-relaxed">Our admin is reviewing your documents. You'll be auto-redirected once approved — keep this page open.</p>
        <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-400 w-1/2 animate-pulse"/></div>
      </div>
    </div>
  )
}