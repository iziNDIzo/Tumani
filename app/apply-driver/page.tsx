"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

const dict = {
  en: {
    title: "Become a verified driver",
    sub: "We verify NRC + License + selfie. No anonymous drivers on Tumani. Your docs are private, only admin sees them.",
    phone: "Phone number", phonePh: "099... (Airtel/TNM)",
    sendOtp: "Send code", otp: "4-digit code", otpPh: "Enter 1234 for demo", verify: "Verify phone",
    verified: "Phone verified ✓", name: "Full name as on NRC", nrc: "NRC number", vehicle: "Vehicle registration", route: "Your route",
    routePh: "Select route", llbt: "Lilongwe - Blantyre", btll: "Blantyre - Lilongwe", lzll: "Lilongwe - Mzuzu",
    uploads: "Safety verification (private)", nrcFront: "NRC Front", nrcBack: "NRC Back", selfie: "Selfie holding NRC",
    uploadTap: "Tap to upload",
    agree: "I confirm I have valid License + Blue Book. I will not carry banned items. I understand fake docs = permanent ban.",
    submit: "Submit for verification", submitting: "Submitting...",
    successTitle: "Application sent!", successSub: "We will verify in 2 hours. You will get SMS. Status: PENDING",
    changeLang: "EN | NY", banned: "Banned: cash >MK100k, drugs, weapons, unpackaged phones"
  },
  ny: {
    title: "Khalani dalaivala wotsimikizika",
    sub: "Timatsimikizira NRC + License + selfie. Palibe dalaivala wachinsinsi pa Tumani. Zikalata zanu zachinsinsi.",
    phone: "Nambala ya foni", phonePh: "099... (Airtel/TNM)",
    sendOtp: "Tumizani code", otp: "Code ya manambala 4", otpPh: "Lembani 1234", verify: "Tsimikizani foni",
    verified: "Foni yatsimikizika ✓", name: "Dzina lonse pa NRC", nrc: "Nambala ya NRC", vehicle: "Nambala ya galimoto", route: "Njira yanu",
    routePh: "Sankhani njira", llbt: "Lilongwe - Blantyre", btll: "Blantyre - Lilongwe", lzll: "Lilongwe - Mzuzu",
    uploads: "Chitsimikizo cha chitetezo (chachinsinsi)", nrcFront: "NRC Kutsogolo", nrcBack: "NRC Kumbuyo", selfie: "Selfie mutanyamula NRC",
    uploadTap: "Dinani kuti mukweze",
    agree: "Ndikutsimikiza kuti ndili ndi License + Blue Book. Sindidzanyamula zoletsedwa. Zikalata zabodza = kuletsedwa kosatha.",
    submit: "Tumizani kuti mutsimikizidwe", submitting: "Kutumiza...",
    successTitle: "Pempho latumizidwa!", successSub: "Tidzatsimikizira mu maola 2. Mudzalandira SMS. Status: PENDING",
    changeLang: "NY | EN", banned: "Zoletsedwa: ndalama >MK100k, mankhwala, zida, mafoni opanda bokosi"
  }
}

export default function ApplyDriver(){
  const [lang,setLang]=useState<'en'|'ny'>('en')
  const t=dict[lang]
  const [step,setStep]=useState(1)
  const [phone,setPhone]=useState("")
  const [otpInput,setOtpInput]=useState("")
  const [form,setForm]=useState({name:"",nrc:"",vehicle:"",route:""})
  const [files,setFiles]=useState<{front:File|null,back:File|null,selfie:File|null}>({front:null,back:null,selfie:null})
  const [agreed,setAgreed]=useState(false)
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)

  const sendOtp = ()=>{ if(phone.length<9) return alert("Enter valid phone"); setStep(2) }
  const verifyOtp = ()=>{ if(otpInput==="1234"){ setStep(3) } else alert("Wrong code. Use 1234 for demo") }

  const uploadFile = async (file:File, name:string)=>{
    const path = `${phone}/${Date.now()}_${name}_${file.name}`
    const {error} = await supabase.storage.from("driver-docs").upload(path,file)
    if(error) throw error
    return path
  }

  const handleSubmit = async ()=>{
    if(!form.name ||!form.nrc ||!form.vehicle ||!form.route) return alert("Fill all fields")
    if(!files.front ||!files.back ||!files.selfie) return alert("Upload 3 photos")
    if(!agreed) return alert("Tick agreement")
    setLoading(true)
    try{
      const frontUrl = await uploadFile(files.front!,"front")
      const backUrl = await uploadFile(files.back!,"back")
      const selfieUrl = await uploadFile(files.selfie!,"selfie")

      const {error} = await supabase.from("drivers").insert({
        full_name: form.name,
        phone: phone,
        nrc_number: form.nrc,
        registration_number: form.vehicle,
        vehicle_type: form.route,
        route: form.route,
        nrc_front_url: frontUrl,
        nrc_back_url: backUrl,
        selfie_url: selfieUrl,
        status: "pending",
        is_verified: false,
        verified: false
      })
      if(error) throw error
      setDone(true)
    }catch(e:any){
      console.log(e)
      alert("Error: "+e.message)
    }
    setLoading(false)
  }

  if(done){
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-5">
        <div className="bg-white border border-gray-100 rounded-[24px] p-8 max-w-[420px] w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto text-[24px]">✅</div>
          <h1 className="font-black text-[22px] mt-4">{t.successTitle}</h1>
          <p className="text-[13px] text-[#010d19]/60 mt-2">{t.successSub}</p>
          <p className="text-[11px] bg-amber-50 border border-amber-200 p-3 rounded-[12px] mt-4">{t.banned}</p>
          <a href="/" className="mt-6 block h-[44px] leading-[44px] bg-[#010d19] text-white rounded-full font-bold text-[13px]">Go home</a>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-[#fafafa] text-[#010d19]">
      <div className="max-w-[520px] mx-auto px-5 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <a href="/" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[16px]">←</a>
            <a href="/" className="font-black text-[20px] flex items-center gap-2"><span className="w-8 h-8 bg-[#0a84ff] rounded-[10px] text-white flex items-center justify-center">T</span>tumani</a>
          </div>
          <button onClick={()=>setLang(lang==='en'?'ny':'en')} className="h-[32px] px-4 rounded-full border border-gray-200 text-[11px] font-bold">{t.changeLang}</button>
        </div>
        <h1 className="text-[26px] font-black leading-[0.95] tracking-[-0.02em]">{t.title}</h1>
        <p className="text-[12px] text-[#010d19]/60 mt-2 leading-[1.5]">{t.sub}</p>
        <div className="mt-6 bg-white border border-gray-100 rounded-[20px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          {step===1 && (<div><label className="text-[11px] font-bold tracking-widest opacity-60">{t.phone}</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={t.phonePh} className="mt-1 w-full h-[48px] px-4 rounded-[14px] border border-gray-200 text-[14px] font-medium"/><button onClick={sendOtp} className="mt-3 w-full h-[48px] rounded-full bg-[#0a84ff] text-white font-black text-[14px]">{t.sendOtp}</button></div>)}
          {step===2 && (<div><label className="text-[11px] font-bold tracking-widest opacity-60">{t.otp}</label><input value={otpInput} onChange={e=>setOtpInput(e.target.value)} placeholder={t.otpPh} className="mt-1 w-full h-[48px] px-4 rounded-[14px] border border-gray-200 text-[14px] font-medium tracking-[0.3em]"/><button onClick={verifyOtp} className="mt-3 w-full h-[48px] rounded-full bg-[#010d19] text-white font-black text-[14px]">{t.verify}</button></div>)}
          {step===3 && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold p-2.5 rounded-[12px] text-center">{t.verified} — {phone}</div>
              <div><label className="text-[11px] font-bold opacity-60">{t.name}</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full h-[46px] px-4 rounded-[12px] border border-gray-200 text-[13px]"/></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-[11px] font-bold opacity-60">{t.nrc}</label><input value={form.nrc} onChange={e=>setForm({...form,nrc:e.target.value})} className="mt-1 w-full h-[46px] px-3 rounded-[12px] border border-gray-200 text-[13px]"/></div><div><label className="text-[11px] font-bold opacity-60">{t.vehicle}</label><input value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} placeholder="RU 1234" className="mt-1 w-full h-[46px] px-3 rounded-[12px] border border-gray-200 text-[13px]"/></div></div>
              <div><label className="text-[11px] font-bold opacity-60">{t.route}</label><select value={form.route} onChange={e=>setForm({...form,route:e.target.value})} className="mt-1 w-full h-[46px] px-3 rounded-[12px] border border-gray-200 text-[13px]"><option value="">{t.routePh}</option><option>{t.llbt}</option><option>{t.btll}</option><option>{t.lzll}</option></select></div>
              <div className="pt-2"><div className="text-[11px] font-black tracking-widest opacity-70 mb-2">{t.uploads}</div><div className="grid grid-cols-3 gap-2">
                {(["front","back","selfie"] as const).map(k=>(
                  <label key={k} className="bg-gray-50 border border-dashed border-gray-300 rounded-[14px] h-[92px] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
                    {files[k]? <span className="text-[10px] font-bold text-green-600 p-1 text-center">✓ {files[k]!.name.slice(0,10)}</span> : <><span className="text-[18px]">{k==="selfie"?"🤳":"🪪"}</span><span className="text-[9px] font-bold mt-1 opacity-60">{k==="front"?t.nrcFront:k==="back"?t.nrcBack:t.selfie}</span><span className="text-[8px] opacity-40">{t.uploadTap}</span></>}
                    <input type="file" accept="image/*" className="hidden" onChange={e=>setFiles({...files,[k]:e.target.files?.[0]||null})}/>
                  </label>
                ))}
              </div></div>
              <label className="flex gap-2 items-start bg-amber-50 border border-amber-200 p-3 rounded-[12px] cursor-pointer"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="mt-0.5"/><span className="text-[10px] leading-[1.4] font-medium">{t.agree}<br/><span className="opacity-60">{t.banned}</span></span></label>
              <button onClick={handleSubmit} disabled={loading} className="w-full h-[50px] rounded-full bg-[#0a84ff] text-white font-black text-[14px] disabled:opacity-50">{loading?t.submitting:t.submit}</button>
            </div>
          )}
        </div>
        <div className="text-center text-[10px] opacity-40 mt-4">🔒 {lang==='en'?'Docs are private, only admin sees them':'Zikalata zachinsinsi, admin yekha amaona'}</div>
      </div>
    </div>
  )
}