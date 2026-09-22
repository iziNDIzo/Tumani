"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

const dict = {
  en: { badge: "LIVE trips on the road", hero1: "Send anything,", hero2:"with drivers", hero3:"you can trust.", sub:"Tumani only uses verified drivers. Every parcel has a code, ID check, and delivery photo.", avail:"View Trips", apply:"Become a Driver", from:"FROM", to:"TO", verified:"VERIFIED LIVE", departs:"DATE", seats:"SPACE", price:"FEE" },
  ny: { badge: "Maulendo amoyo m'njira", hero1: "Tumizani chilichonse,", hero2:"ndi madalaivala", hero3:"odalirika.", sub:"Tumani imagwiritsa ntchito madalaivala otsimikizika okha.", avail:"Onani Maulendo", apply:"Khalani Dalaivala", from:"KUCHOKERA", to:"KUPITA", verified:"OTSIMIKIZIKA AMOYO", departs:"TSIKU", seats:"MALO", price:"MTENGO" }
}

export default function Home(){
  const [lang,setLang]=useState<'en'|'ny'>('en')
  const [trips,setTrips]=useState<any[]>([])
  const t=dict[lang as 'en']
  useEffect(()=>{ supabase.from('trips').select('*').eq('status','active').order('created_at',{ascending:false}).then(r=>{ if(r.data) setTrips(r.data) }) },[])

  return(
    <div className="min-h-screen bg-white text-[#010d19]">
      <header className="sticky top-0 bg-white/90 backdrop-blur border-b border-gray-100"><div className="max-w-[1200px] mx-auto px-5 h-[64px] flex justify-between items-center"><div className="flex gap-2 items-center"><div className="w-9 h-9 bg-[#0a84ff] rounded-[12px] grid place-items-center font-black text-white">T</div><span className="font-black text-[20px]">tumani</span><button onClick={()=>setLang(lang==='en'?'ny':'en')} className="ml-2 border rounded-full px-3 h-[28px] text-[11px] font-bold">{lang==='en'?'EN | NY':'NY | EN'}</button></div><nav className="flex gap-2"><Link href="/available-trips" className="border rounded-full px-5 h-[40px] grid place-items-center font-bold text-[13px]">{dict[lang].avail}</Link><Link href="/apply-driver" className="bg-black text-white rounded-full px-5 h-[40px] grid place-items-center font-bold text-[13px]">{dict[lang].apply}</Link></nav></div></header>

      <section className="max-w-[1200px] mx-auto px-5 pt-10 grid md:grid-cols-2 gap-10">
        <div><div className="bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-[11px] font-bold text-green-700 inline-flex gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{trips.length} {dict[lang].badge}</div><h1 className="text-[42px] md:text-[56px] font-black leading-[0.9] mt-4">{dict[lang].hero1}<br/>{dict[lang].hero2}<br/><span className="text-[#0a84ff]">{dict[lang].hero3}</span></h1><p className="mt-4 opacity-60 max-w-[440px]">{dict[lang].sub}</p><Link href="/send-parcels" className="mt-6 inline-flex h-[50px] px-7 rounded-full bg-[#0a84ff] text-white font-black">Send Parcel</Link></div>

        <div className="space-y-3">{trips.map(tr=>(
          <div key={tr.id} className="border-2 border-black rounded-[28px] p-4 shadow-[0_24px_80px_rgba(1,13,25,0.08)]">
            <div className="flex justify-between"><div className="font-black">{tr.from_city} → {tr.to_city}</div><span className="bg-green-500 text-white text-[9px] px-2 py-1 rounded-full font-black animate-pulse">LIVE</span></div>
            <div className="mt-3 bg-[#010d19] text-white p-4 rounded-[20px] flex justify-between"><div><div className="text-[9px] opacity-60">{dict[lang].from}</div><div className="font-black">{tr.from_city}</div></div><div className="text-[#0a84ff]">→</div><div className="text-right"><div className="text-[9px] opacity-60">{dict[lang].to}</div><div className="font-black">{tr.to_city}</div></div></div>
            <div className="grid grid-cols-3 gap-2 mt-3"><div className="bg-gray-50 p-2.5 rounded-[14px] text-center"><div className="text-[9px] opacity-50">{dict[lang].departs}</div><div className="font-black text-[12px]">{tr.date}</div></div><div className="bg-gray-50 p-2.5 rounded-[14px] text-center"><div className="text-[9px] opacity-50">{dict[lang].seats}</div><div className="font-black text-[12px]">{tr.seats}</div></div><div className="bg-[#8b5cf6]/10 p-2.5 rounded-[14px] text-center"><div className="text-[9px] text-[#8b5cf6]">{dict[lang].price}</div><div className="font-black text-[12px] text-[#8b5cf6]">MK{tr.price}</div></div></div>
          </div>
        ))}</div>
      </section>
    </div>
  )
}