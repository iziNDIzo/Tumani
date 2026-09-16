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

  const I="w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 px-4 py-3.5 rounded-xl text-[15px]"
  const L="text-[11px] font-black text-slate-900 uppercase mb-1.5 block"
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-6">
      <div className="bg-white border rounded-3xl p-8 w-full max-w-105 shadow-sm">
        <Link href="/" className="font-black text-blue-600 text-[22px]">Tumani</Link>
        <h1 className="text-[26px] font-black text-slate-900 mt-4">{isSignup? "Driver Sign Up" : "Driver Login"}</h1>
        <p className="text-[13px] text-slate-600 mt-1 mb-6">{isSignup? "Verified drivers get 3x more bookings" : "Welcome back"}</p>
        {isSignup && <>
          <span className={L}>Full Name</span><input className={I} placeholder="e.g. Victor Banda" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><div className="h-3" />
          <span className={L}>Phone WhatsApp</span><input className={I} placeholder="e.g. 0998838866" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /><div className="h-3" />
          <span className={L}>Main Vehicle</span><select className={I} value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})}><option>Sienta</option><option>Freed</option><option>Sedan</option><option>Minibus - 16 Seater</option><option>Pickup</option><option>Truck</option></select><div className="h-3" />
        </>}
        <span className={L}>Email</span><input className={I} placeholder="e.g. victor@gmail.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><div className="h-3" />
        <span className={L}>Password</span><input type="password" className={I} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button onClick={handleAuth} disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl mt-6">{loading? "..." : isSignup? "Create Driver Account" : "Login"}</button>
        <button onClick={()=>setIsSignup(!isSignup)} className="w-full text-[13px] font-bold text-slate-600 mt-4">{isSignup? "Already have account? Login" : "New driver? Sign Up"}</button>
      </div>
    </div>
  )
}