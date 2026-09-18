"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function AuthPage(){
  const router = useRouter()
  const [step,setStep]=useState(1)
  const [loading,setLoading]=useState(false)
  const [errorMsg,setErrorMsg]=useState("")
  const [success,setSuccess]=useState(false)
  const [form,setForm]=useState({name:"",phone:"",whatsapp:"",vehicle:"",reg:"",email:"",password:"",images:[] as File[]})

  const next = () => { setErrorMsg(""); setStep(s=>Math.min(4,s+1)) }
  const back = () => { setErrorMsg(""); setStep(s=>Math.max(1,s-1)) }

const handleCreate = async () => {
  setLoading(true); setErrorMsg("")
  try{
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name, role: 'driver' } }
    })
    if(error) throw error
    const userId = data.user?.id
    if(!userId) throw new Error("Enable email confirm OFF in Supabase Auth settings")

    const { error: dErr } = await supabase.from('drivers').insert({
      id: userId, user_id: userId, full_name: form.name,
      phone: form.phone, whatsapp: form.whatsapp,
      vehicle_type: form.vehicle, registration_number: form.reg,
      email: form.email, verified: false
    })
    if(dErr) throw dErr

    setSuccess(true)
    setTimeout(()=> router.push("/drive/pending"), 1500)
  } catch(e:any){ setErrorMsg(e.message) }
  finally{ setLoading(false) }
}

  if(success){
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fcfcfc] flex items-center justify-center p-4">
        <div className="w-full max-w-[520px] bg-white rounded-[32px] border border-black/10 p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-4xl">✓</div>
          <h1 className="font-black text-[34px] mt-6 leading-none">You're all set! 🎉</h1>
          <p className="text-black/60 font-medium mt-3">Welcome to Tumani Driver, {form.name.split(' ')[0]}! Your account is created.</p>
          <div className="mt-8 bg-black text-white rounded-full h-[56px] flex items-center justify-center font-black">Taking you to your dashboard...</div>
          <p className="text-[12px] text-black/40 mt-4">You will be redirected to Find Trips</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fcfcfc] flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-[32px] border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 md:p-10">
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i=><div key={i} className={`h-2 flex-1 rounded-full ${i<=step? "bg-black" : "bg-black/10"}`} />)}
        </div>
        {/*... keep your steps 1-3 exactly same as before... */}
        {/* STEP 4 with inline error */}
        {step===4 && (
          <div>
            <h1 className="font-black text-[32px] leading-[0.95]">You're almost done 🎉</h1>
            <div className="space-y-5 mt-8">
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">EMAIL ADDRESS</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="victor@gmail.com" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold" /></div>
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">CREATE PASSWORD</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="min. 6 characters" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold" /></div>

              {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] font-bold p-3 rounded-xl">{errorMsg}</div>}

              <button onClick={handleCreate} disabled={loading} className="w-full h-[60px] bg-[#1a73e8] text-white rounded-full font-black text-[16px] disabled:opacity-50">
                {loading? "Creating account..." : "Create Account & Start Earning →"}
              </button>
              <button onClick={back} className="w-full text-center text-[13px] font-black text-black/40">← Go back and review</button>
            </div>
          </div>
        )}
        {/* keep steps 1,2,3 from previous file - I shortened here to focus on fix */}
        {step===1 && (<div><h1 className="font-black text-[32px]">Welcome to Tumani Driver 👋</h1><div className="space-y-5 mt-8"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name e.g. Victor Kasakula" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border font-bold" /><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone e.g. 0998838866" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border font-bold" /><button onClick={next} className="w-full h-[56px] bg-black text-white rounded-full font-black">Next →</button></div></div>)}
        {step===2 && (<div><h1 className="font-black text-[32px]">Stay connected 💬</h1><div className="space-y-5 mt-8"><input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="WhatsApp e.g. 0881234567" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border font-bold" /><div className="flex gap-3"><button onClick={back} className="h-[56px] px-8 rounded-full border-2 border-black font-black">Back</button><button onClick={next} className="flex-1 h-[56px] bg-black text-white rounded-full font-black">Next → Almost there</button></div></div></div>)}
        {step===3 && (<div><h1 className="font-black text-[32px]">Let's verify you ✅</h1><div className="space-y-5 mt-8"><select value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} className="w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border font-bold"><option value="">Select vehicle...</option><option>Sienta - 7 seater</option><option>Noah / Voxy</option><option>Minibus 15 seater</option><option>Pickup / Lorry</option></select><input value={form.reg} onChange={e=>setForm({...form,reg:e.target.value})} placeholder="Registration e.g. MH 1234" className="w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border font-bold" /><div className="flex gap-3"><button onClick={back} className="h-[56px] px-8 rounded-full border-2 border-black font-black">Back</button><button onClick={next} className="flex-1 h-[56px] bg-black text-white rounded-full font-black">Next → Final step</button></div></div></div>)}
      </div>
    </div>
  )
}