"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthPage(){
  const [isSignup,setIsSignup]=useState(true)
  const [form,setForm]=useState({name:"", phone:"", email:"", password:"", vehicle:"Sienta"})
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleAuth = async () => {
    if(!form.email ||!form.password || (isSignup && (!form.name ||!form.phone))){ alert("Fill all fields"); return }
    setLoading(true)
    if(isSignup){
      const {data, error} = await supabase.auth.signUp({email:form.email, password:form.password})
      if(error){ alert(error.message); setLoading(false); return }
      if(data.user){
        await supabase.from("profiles").insert({id:data.user.id, full_name:form.name, phone:form.phone, vehicle:form.vehicle})
      }
      alert("Account created! Check email, then Login.")
      setIsSignup(false)
    }else{
      const {error} = await supabase.auth.signInWithPassword({email:form.email, password:form.password})
      if(error) alert(error.message)
      else router.push("/drive")
    }
    setLoading(false)
  }

  const I="w-full bg-[#f8f7ff] border-2 border-black/10 rounded-[12px] px-4 py-3.5 text-[14px] font-bold text-black placeholder:text-black/40 outline-none focus:bg-white focus:border-[#7c3aed]/30 focus:ring-2 focus:ring-[#7c3aed]/10 transition-all"
  const L="text-[11px] font-black tracking-widest uppercase text-black/40 mb-2 block"
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black/10 rounded-[24px] p-6 md:p-8 w-full max-w-[420px] shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        <Link href="/" className="inline-flex items-center gap-2 font-black text-[22px] text-black"><span className="w-8 h-8 bg-[#1a73e8] text-white rounded-full flex items-center justify-center text-[14px]">T</span> Tumani</Link>
        <h1 className="text-[28px] font-black tracking-tight text-black mt-5 leading-none">{isSignup? "Driver Sign Up" : "Driver Login"}</h1>
        <p className="text-[13px] font-medium text-black/60 mt-2 mb-6">{isSignup? "Verified drivers get 3x more bookings" : "Welcome back, driver"}</p>

        {isSignup && <>
          <span className={L}>Full Name</span><input className={I} placeholder="Victor Banda" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><div className="h-3.5" />
          <span className={L}>Phone WhatsApp</span><input className={I} placeholder="0998838866" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /><div className="h-3.5" />
          <span className={L}>Main Vehicle</span><select className={I} value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})}><option>Sienta</option><option>Freed</option><option>Sedan</option><option>Minibus - 16 Seater</option><option>Pickup</option><option>Truck</option></select><div className="h-3.5" />
        </>}
        <span className={L}>Email</span><input className={I} placeholder="victor@gmail.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><div className="h-3.5" />
        <span className={L}>Password</span><input type="password" className={I} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />

        <button onClick={handleAuth} disabled={loading} className="w-full bg-[#1a73e8] hover:bg-black text-white font-black py-4 rounded-[12px] mt-6 text-[14px] shadow-[0_4px_16px_rgba(26,115,232,0.24)] transition-colors disabled:opacity-50">{loading? "..." : isSignup? "Create Driver Account" : "Login"}</button>
        <button onClick={()=>setIsSignup(!isSignup)} className="w-full text-[13px] font-black text-black/60 hover:text-[#7c3aed] mt-5 transition-colors">{isSignup? "Already have account? Login" : "New driver? Sign Up"}</button>
      </div>
    </div>
  )
}