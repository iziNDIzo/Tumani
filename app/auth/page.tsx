"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient" // <-- your supabase client
import { useRouter } from "next/navigation"

export default function AuthPage(){
  const router = useRouter()
  const [step,setStep]=useState(1)
  const [loading,setLoading]=useState(false)
  const [form,setForm]=useState({name:"",phone:"",whatsapp:"",vehicle:"",reg:"",email:"",password:"",images:[] as File[]})

  const next = () => setStep(s=>Math.min(4,s+1))
  const back = () => setStep(s=>Math.max(1,s-1))

  const handleCreate = async () => {
    if(!form.email ||!form.password || form.password.length < 6){
      alert("Please enter a valid email and password (min 6 chars)")
      return
    }
    setLoading(true)
    try{
      // 1. Create Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name, role: 'driver' } }
      })
      if(authError) throw authError

      // 2. Upload images (if you have a bucket called 'vehicle-images' - if not, skip this block)
      let imageUrls: string[] = []
      if(form.images.length > 0){
        for(const file of form.images){
          const fileName = `${Date.now()}_${file.name}`
          const { error } = await supabase.storage.from('vehicle-images').upload(fileName, file)
          if(!error){
            const { data } = supabase.storage.from('vehicle-images').getPublicUrl(fileName)
            imageUrls.push(data.publicUrl)
          }
        }
      }

      // 3. Insert driver profile
      const userId = authData.user?.id
      const { error: profileError } = await supabase.from('drivers').insert({
        id: userId,
        full_name: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        vehicle_type: form.vehicle,
        registration_number: form.reg,
        email: form.email,
        vehicle_images: imageUrls,
        verified: false,
      })
      if(profileError) console.warn("Profile insert warning:", profileError.message)

      alert("🎉 Account created! Welcome to Tumani Driver!")
      router.push("/") // go home

    } catch(e:any){
      alert(e.message || "Failed to create account")
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fcfcfc] flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-[32px] border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 md:p-10">
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i=>(
            <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i<=step? "bg-black" : "bg-black/10"}`} />
          ))}
        </div>
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-[#1a73e8] rounded-full flex items-center justify-center font-black text-white">T</div>
          <span className="font-black text-[15px] tracking-widest text-black/40">STEP {step} OF 4</span>
        </div>

        {step===1 && (
          <div>
            <h1 className="font-black text-[32px] leading-[0.95] tracking-tight">Welcome to Tumani Driver 👋</h1>
            <p className="text-[16px] font-medium text-black/60 mt-3 leading-[1.4]">We're excited to have you. Let's get you earning today. Please enter your full name and phone number below.</p>
            <div className="space-y-5 mt-8">
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">FULL NAME</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter full name here... e.g. Victor Kasakula" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold placeholder:text-black/30 focus:bg-white focus:border-black transition" /></div>
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">PHONE NUMBER</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Enter phone number here... e.g. 0998838866" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold placeholder:text-black/30 focus:bg-white focus:border-black transition" /></div>
              <button onClick={next} disabled={!form.name ||!form.phone} className="w-full h-[56px] bg-black text-white rounded-full font-black text-[15px] disabled:opacity-30">Next → Let's continue</button>
            </div>
          </div>
        )}

        {step===2 && (
          <div>
            <h1 className="font-black text-[32px] leading-[0.95] tracking-tight">Stay connected 💬</h1>
            <p className="text-[16px] font-medium text-black/60 mt-3 leading-[1.4]">Your customers would like to reach you through WhatsApp. Please enter your WhatsApp number below so they can chat you directly.</p>
            <div className="space-y-5 mt-8">
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">WHATSAPP NUMBER</label><input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="Enter WhatsApp number here... e.g. 0881234567" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold placeholder:text-black/30 focus:bg-white focus:border-black transition" /><p className="text-[12px] text-black/40 mt-2 font-medium">We’ll never spam. Only booking alerts.</p></div>
              <div className="flex gap-3"><button onClick={back} className="h-[56px] px-8 rounded-full border-2 border-black font-black text-[15px]">Back</button><button onClick={next} disabled={!form.whatsapp} className="flex-1 h-[56px] bg-black text-white rounded-full font-black text-[15px] disabled:opacity-30">Next → Almost there</button></div>
            </div>
          </div>
        )}

        {step===3 && (
          <div>
            <h1 className="font-black text-[32px] leading-[0.95] tracking-tight">Let's verify you ✅</h1>
            <p className="text-[16px] font-medium text-black/60 mt-3 leading-[1.4]">A trusted driver gets <span className="font-black text-black">10x more bookings</span>. Please enter your vehicle type, registration number, and 3 clear images.</p>
            <div className="space-y-5 mt-8">
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">MAIN VEHICLE</label><select value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold"><option value="">Select your main vehicle...</option><option>Sienta - 7 seater</option><option>Noah / Voxy</option><option>Minibus 15 seater</option><option>Pickup / Lorry</option><option>Motorbike</option></select></div>
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">REGISTRATION NUMBER</label><input value={form.reg} onChange={e=>setForm({...form,reg:e.target.value})} placeholder="Enter registration number here... e.g. MH 1234" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold placeholder:text-black/30 focus:bg-white focus:border-black transition" /></div>
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">VEHICLE PHOTOS (3 REQUIRED)</label>
                <div className="mt-2 grid grid-cols-3 gap-3">{[0,1,2].map(i=>(
                  <label key={i} className="h-[88px] rounded-2xl bg-[#f5f3ff] border-2 border-dashed border-black/15 flex flex-col items-center justify-center cursor-pointer hover:bg-black/[0.03] transition">
                    <span className="text-[22px]">📸</span><span className="text-[10px] font-black mt-1">Front / Side / Back</span>
                    <input type="file" hidden accept="image/*" onChange={e=>{ if(e.target.files?.[0]) setForm({...form,images:[...form.images,e.target.files[0]]}) }} />
                  </label>
                ))}</div>
                <p className="text-[12px] text-black/40 mt-2 font-medium">{form.images.length}/3 uploaded — customers trust what they see!</p>
              </div>
              <div className="flex gap-3"><button onClick={back} className="h-[56px] px-8 rounded-full border-2 border-black font-black text-[15px]">Back</button><button onClick={next} disabled={!form.vehicle ||!form.reg} className="flex-1 h-[56px] bg-black text-white rounded-full font-black text-[15px] disabled:opacity-30">Next → Final step</button></div>
            </div>
          </div>
        )}

        {step===4 && (
          <div>
            <h1 className="font-black text-[32px] leading-[0.95] tracking-tight">You're almost done 🎉</h1>
            <p className="text-[16px] font-medium text-black/60 mt-3 leading-[1.4]">Create your login so you can manage trips. This will be your driver account.</p>
            <div className="space-y-5 mt-8">
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">EMAIL ADDRESS</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Enter email address here... e.g. victor@gmail.com" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold placeholder:text-black/30 focus:bg-white focus:border-black transition" /></div>
              <div><label className="text-[11px] font-black tracking-[0.15em] text-black/40">CREATE PASSWORD</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter password here... min. 6 characters" className="mt-2 w-full h-[56px] px-5 rounded-2xl bg-[#f5f3ff] border border-black/10 outline-none font-bold placeholder:text-black/30 focus:bg-white focus:border-black transition" /></div>

              <button onClick={handleCreate} disabled={loading} className="w-full h-[60px] bg-[#1a73e8] text-white rounded-full font-black text-[16px] shadow-[0_8px_20px_rgba(26,115,232,0.3)] disabled:opacity-50">
                {loading? "Creating account..." : "Create Account & Start Earning →"}
              </button>

              <button onClick={back} className="w-full text-center text-[13px] font-black text-black/40">← Go back and review</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}