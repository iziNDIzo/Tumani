"use client"
import { useState } from "react"

const dict = {
  en: {
    badge: "Verified drivers on the road now",
    hero1: "Send anything,",
    hero2: "with drivers",
    hero3: "you can trust.",
    sub: "Tumani only uses verified drivers. Every parcel has a code, ID check, and delivery photo.",
    send: "Send Parcel — MK 3,500",
    track: "Track My Parcel",
    avail: "View Trips", apply: "Become a Driver",
    trustTitle: "Built for safety, not just speed.",
    trustSub: "We know parcel stories in Malawi. Tumani fixes that with 3 checks.",
    t1: "Verified drivers", t1d: "NRC + License + selfie verified by us. No anonymous drivers.",
    t2: "Code + ID check", t2d: "4-digit pickup code to collect. Receiver shows NRC to collect.",
    t3: "Photo proof", t3d: "Parcel photo at send, delivery photo at drop. You see everything.",
    cardTitle: "How your parcel travels", cardDesc: "Real trip now. With safety checks at every step.",
    from: "FROM", to: "TO", verified: "VERIFIED", departs: "DEPARTS", seats: "SPACE", price: "FEE",
    stepCode: "Pickup code: 4821", stepId: "ID check at delivery", stepPhoto: "Delivery photo required",
    how: "How it works", howSub: "Simple, safe, same day.",
    s1t: "Declare & photo", s1d: "Take photo, tick no illegal items. Get your TUM- code.",
    s2t: "Driver picks with code", s2d: "Only driver with matching route + your 4-digit code can pick.",
    s3t: "Receiver shows NRC", s3d: "NRC last 4 digits match + delivery photo. Done.",
    banned: "No cash >MK100k, no drugs, no weapons, no unpackaged phones",
  },
  ny: {
    badge: "Madalaivala otsimikizika ali m'njira",
    hero1: "Tumizani chilichonse,",
    hero2: "ndi madalaivala",
    hero3: "odalirika.",
    sub: "Tumani imagwiritsa ntchito madalaivala otsimikizika okha. Phukusi lililonse lili ndi code, ID check, ndi chithunzi.",
    send: "Tumizani Phukusi — MK 3,500",
    track: "Tsatirani Phukusi",
    avail: "Onani Maulendo", apply: "Khalani Dalaivala",
    trustTitle: "Yamangidwa mwachitetezo.",
    trustSub: "Timadziwa nkhani za maphukusi. Tumani imateteza ndi macheke 3.",
    t1: "Madalaivala otsimikizika", t1d: "NRC + License + selfie yotsimikizika. Palibe wachinsinsi.",
    t2: "Code + ID check", t2d: "Code ya manambala 4 kutenga. Wolandira awonetse NRC.",
    t3: "Umboni ndi chithunzi", t3d: "Chithunzi potumiza ndi pofika. Mukuwona zonse.",
    cardTitle: "Momwe phukusi lanu limayendera", cardDesc: "Ulendo weniweni tsopano. Ndi chitetezo pa sitepe iliyonse.",
    from: "KUCHOKERA", to: "KUPITA", verified: "OTSIMIKIZIKA", departs: "NYAMUKA", seats: "MALO", price: "MTENGO",
    stepCode: "Code yotenga: 4821", stepId: "ID check pofika", stepPhoto: "Chithunzi chofunikira pofika",
    how: "Momwe zimagwirira", howSub: "Zosavuta, zotetezeka, tsiku lomwelo.",
    s1t: "Fotokozani & chithunzi", s1d: "Jambulani phukusi, tsimikizani palibe zoletsedwa. Pezani code ya TUM-.",
    s2t: "Dalaivala atenga ndi code", s2d: "Dalaivala woyenera + code yanu ya manambala 4 okha.",
    s3t: "Wolandira awonetse NRC", s3d: "Manambala 4 omaliza a NRC afanane + chithunzi. Kwatha.",
    banned: "Palibe ndalama >MK100k, mankhwala, zida, mafoni opanda bokosi",
  }
}

export default function Home(){
  const [lang,setLang]=useState<'en'|'ny'>('en')
  const t=dict[lang]
  return(
    <div className="min-h-screen bg-white text-[#010d19] antialiased">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#0a84ff] rounded-[12px] flex items-center justify-center font-black text-white">T</div>
            <span className="font-black text-[20px] tracking-tight">tumani</span>
            <button onClick={()=>setLang(lang==='en'?'ny':'en')} className="ml-2 h-[28px] px-3 rounded-full border border-gray-200 text-[11px] font-bold inline-flex items-center justify-center leading-none">{lang==='en'?'EN | NY':'NY | EN'}</button>
          </div>
          <nav className="hidden md:flex gap-2">
            <a href="/available-trips" className="h-[40px] px-5 rounded-full border border-gray-200 text-[13px] font-bold inline-flex items-center justify-center leading-none">{t.avail}</a>
            <a href="/apply-driver" className="h-[40px] px-5 rounded-full bg-[#010d19] text-white text-[13px] font-bold inline-flex items-center justify-center leading-none">{t.apply}</a>
            <a href="/send-parcels" className="h-[40px] px-6 rounded-full bg-[#0a84ff] text-white text-[13px] font-black inline-flex items-center justify-center leading-none shadow-[0_8px_24px_rgba(10,132,255,0.25)]">Send Parcel</a>
          </nav>
        </div>
      </header>

      <section className="max-w-[1200px] mx-auto px-5 pt-10 md:pt-16 pb-10 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-[11px] font-bold text-green-700 mb-4"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{t.badge}</div>
          <h1 className="text-[38px] md:text-[56px] font-black leading-[0.9] tracking-[-0.03em]">{t.hero1}<br/>{t.hero2}<br/><span className="text-[#0a84ff]">{t.hero3}</span></h1>
          <p className="mt-4 text-[15px] leading-[1.6] text-[#010d19]/60 max-w-[440px]">{t.sub}</p>

          {/* TRUST STRIP - PUBLIC SAFETY */}
          <div className="mt-6 grid grid-cols-1 gap-3 max-w-[460px]">
            <div className="flex gap-3 bg-gray-50 border border-gray-100 p-3 rounded-[16px]"><div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-[14px]">🛡️</div><div><div className="font-black text-[13px] leading-none">{t.t1}</div><div className="text-[11px] text-[#010d19]/60 mt-1">{t.t1d}</div></div></div>
            <div className="flex gap-3 bg-gray-50 border border-gray-100 p-3 rounded-[16px]"><div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-[14px]">🔑</div><div><div className="font-black text-[13px] leading-none">{t.t2}</div><div className="text-[11px] text-[#010d19]/60 mt-1">{t.t2d}</div></div></div>
            <div className="flex gap-3 bg-gray-50 border border-gray-100 p-3 rounded-[16px]"><div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-[14px]">📸</div><div><div className="font-black text-[13px] leading-none">{t.t3}</div><div className="text-[11px] text-[#010d19]/60 mt-1">{t.t3d}</div></div></div>
          </div>

          <div className="mt-6 flex gap-3">
            <a href="/send-parcels" className="h-[50px] px-7 rounded-full bg-[#0a84ff] text-white font-black text-[14px] inline-flex items-center justify-center leading-none shadow-[0_12px_32px_rgba(10,132,255,0.3)]">{t.send}</a>
            <a href="/my-parcels" className="h-[50px] px-5 rounded-full border border-gray-200 font-bold text-[13px] inline-flex items-center justify-center leading-none">{t.track}</a>
          </div>
          <div className="mt-3 text-[10px] text-[#010d19]/40 font-medium">⚠️ {t.banned}</div>
        </div>

        <div className="relative">
          <div className="bg-white border border-gray-100 rounded-[28px] p-4 shadow-[0_24px_80px_rgba(1,13,25,0.08)]">
            <div className="flex justify-between items-start mb-3"><div><h3 className="font-black text-[15px]">{t.cardTitle}</h3><p className="text-[11px] text-[#010d19]/50">{t.cardDesc}</p></div><span className="bg-[#010d19] text-white text-[9px] font-black px-2 py-1 rounded-full">{t.verified}</span></div>
            <div className="bg-[#010d19] text-white p-4 rounded-[20px] flex justify-between items-center"><div><div className="text-[9px] opacity-60 tracking-widest">{t.from}</div><div className="font-black text-[17px]">Lilongwe</div></div><div className="text-[#0a84ff]">→</div><div className="text-right"><div className="text-[9px] opacity-60 tracking-widest">{t.to}</div><div className="font-black text-[17px]">Blantyre</div></div></div>
            <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded-[16px] text-[11px] space-y-1"><div>✅ {t.stepCode}</div><div>✅ {t.stepId}</div><div>✅ {t.stepPhoto}</div></div>
            <div className="grid grid-cols-3 gap-2 mt-3"><div className="bg-gray-50 p-2.5 rounded-[14px] text-center"><div className="text-[9px] opacity-50">{t.departs}</div><div className="font-black text-[12px]">Today 2PM</div></div><div className="bg-gray-50 p-2.5 rounded-[14px] text-center"><div className="text-[9px] opacity-50">{t.seats}</div><div className="font-black text-[12px]">3 parcels</div></div><div className="bg-[#8b5cf6]/10 p-2.5 rounded-[14px] text-center"><div className="text-[9px] text-[#8b5cf6]">{t.price}</div><div className="font-black text-[12px] text-[#8b5cf6]">MK 3,500</div></div></div>
          </div>
        </div>
      </section>

      <section className="bg-[#010d19] text-white py-14 rounded-t-[36px]">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-[28px] font-black">{t.how} <span className="text-[#0a84ff]">— safe.</span></h2><p className="text-white/50 text-[13px] mt-1 mb-7">{t.howSub}</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-white/[0.06] border border-white/10 p-5 rounded-[20px]"><div className="w-8 h-8 bg-white text-[#010d19] rounded-full flex items-center justify-center font-black text-[12px] mb-3">1</div><div className="font-bold text-[14px]">{t.s1t}</div><div className="text-[12px] text-white/50 mt-1">{t.s1d}</div></div>
            <div className="bg-white/[0.06] border border-white/10 p-5 rounded-[20px]"><div className="w-8 h-8 bg-[#0a84ff] rounded-full flex items-center justify-center font-black text-[12px] mb-3">2</div><div className="font-bold text-[14px]">{t.s2t}</div><div className="text-[12px] text-white/50 mt-1">{t.s2d}</div></div>
            <div className="bg-white/[0.06] border border-white/10 p-5 rounded-[20px]"><div className="w-8 h-8 bg-[#8b5cf6] rounded-full flex items-center justify-center font-black text-[12px] mb-3">3</div><div className="font-bold text-[14px]">{t.s3t}</div><div className="text-[12px] text-white/50 mt-1">{t.s3d}</div></div>
          </div>
        </div>
      </section>
    </div>
  )
}