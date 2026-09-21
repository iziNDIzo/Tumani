"use client"
import { useState } from "react"

const dict = {
  en: {
    badge: "Drivers on the road right now",
    hero1: "Send anything,",
    hero2: "with drivers",
    hero3: "already going.",
    sub: "Tumani connects you to verified minibus & taxi drivers heading your way. Cheaper, faster, trusted by Malawians.",
    send: "Send Parcel — MK 3,500",
    track: "Track My Parcel",
    avail: "View Available Trips",
    apply: "Apply as Driver",
    howTitle: "How it works",
    howSub: "No warehouses. Just drivers already traveling your route.",
    cardTitle: "See how it works",
    cardDesc: "This is a real trip happening now. Your parcel would ride with this driver.",
    from: "FROM", to: "TO", departs: "DEPARTS", seats: "SEATS FOR PARCELS", price: "YOU PAY",
    today: "Today 2PM", left: "Space for 3 parcels", matches: "Matches this trip",
    waiting: "Waiting for a driver to accept",
    parcelId: "Example parcel • TUM-4RF9-983",
    step1t: "Tell us where", step1d: "Where from, where to, and phone numbers. 30 seconds.",
    step2t: "We match a driver", step2d: "A verified driver on that route picks your parcel.",
    step3t: "Delivered same day", step3d: "Receiver gets SMS. Safe and fast.",
  },
  ny: {
    badge: "Madalaivala ali m'njira tsopano",
    hero1: "Tumizani chilichonse,",
    hero2: "ndi madalaivala",
    hero3: "omwe akupita kale.",
    sub: "Tumani imakulumikizani ndi madalaivala odalirika a minibus ndi taxi. Zotchipa, zachangu, zodalirika.",
    send: "Tumizani Phukusi — MK 3,500",
    track: "Tsatirani Phukusi Langa",
    avail: "Onani Maulendo Alipo",
    apply: "Lembetsani Monga Dalaivala",
    howTitle: "Momwe zimagwirira",
    howSub: "Palibe warehouse. Madalaivala omwe akuyenda kale.",
    cardTitle: "Onani momwe zimagwirira",
    cardDesc: "Uwu ndi ulendo weniweni. Phukusi lanu likadakwera ndi dalaivala uyu.",
    from: "KUCHOKERA", to: "KUPITA", departs: "NYAMUKA", seats: "MIPANDO", price: "MTENGO",
    today: "Lero 2PM", left: "Malo a maphukusi 3", matches: "Zikufanana ndi ulendowu",
    waiting: "Tikudikira dalaivala avomere",
    parcelId: "Chitsanzo • TUM-4RF9-983",
    step1t: "Tiwuzeni komwe", step1d: "Kuchokera kuti, kupita kuti, ndi manambala a foni.",
    step2t: "Tipeza dalaivala", step2d: "Dalaivala wodalirika atenga phukusi lanu.",
    step3t: "Lifika tsiku lomwelo", step3d: "Wolandira alandila SMS. Motetezeka.",
  }
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<'en'|'ny'>('en')
  const t = dict[lang]

  return (
    <div className="min-h-screen bg-white text-[#010d19] antialiased">
      {/* HEADER - FIXED CENTERING */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0a84ff] rounded-[12px] flex items-center justify-center font-black text-white">T</div>
            <span className="font-black text-[20px] tracking-tight">tumani</span>
            <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-black px-2 py-1 rounded-full">BETA</span>
            <button onClick={()=>setLang(lang==='en'?'ny':'en')} className="ml-2 h-[28px] px-3 rounded-full border border-gray-200 text-[11px] font-bold hover:bg-gray-50">
              {lang==='en'? 'EN | NY' : 'NY | EN'}
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            <a href="/available-trips" className="h-[40px] px-5 rounded-full border border-gray-200 text-[13px] font-bold inline-flex items-center justify-center leading-none hover:bg-gray-50">{t.avail}</a>
            <a href="/apply-driver" className="h-[40px] px-5 rounded-full bg-[#010d19] text-white text-[13px] font-bold inline-flex items-center justify-center leading-none hover:opacity-90">{t.apply}</a>
            <a href="/send-parcels" className="h-[40px] px-6 rounded-full bg-[#0a84ff] text-white text-[13px] font-black inline-flex items-center justify-center leading-none shadow-[0_8px_24px_rgba(10,132,255,0.25)]">{t.send.split('—')[0].trim()}</a>
          </nav>

          <button onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 rounded-full bg-gray-50 inline-flex items-center justify-center">
            <span className="text-[20px]">{menuOpen?'✕':'☰'}</span>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-5 pb-5 pt-2 border-t border-gray-100 bg-white space-y-2">
            <a href="/send-parcels" className="h-[48px] w-full bg-[#0a84ff] text-white rounded-full inline-flex items-center justify-center font-black text-[14px] leading-none">{t.send.split('—')[0].trim()}</a>
            <a href="/available-trips" className="h-[48px] w-full border border-gray-200 rounded-full inline-flex items-center justify-center font-bold text-[14px] leading-none">{t.avail}</a>
            <a href="/apply-driver" className="h-[48px] w-full bg-[#010d19] text-white rounded-full inline-flex items-center justify-center font-bold text-[14px] leading-none">{t.apply}</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="max-w-[1200px] mx-auto px-5 pt-10 md:pt-20 pb-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#0a84ff] mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {t.badge}
          </div>
          <h1 className="text-[38px] md:text-[56px] font-black leading-[0.9] tracking-[-0.03em]">
            {t.hero1}<br/>{t.hero2}<br/><span className="text-[#0a84ff]">{t.hero3}</span>
          </h1>
          <p className="mt-5 text-[16px] leading-[1.6] text-[#010d19]/60 max-w-[440px]">{t.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/send-parcels" className="h-[52px] px-8 rounded-full bg-[#0a84ff] text-white font-black text-[15px] inline-flex items-center justify-center leading-none shadow-[0_12px_32px_rgba(10,132,255,0.3)]">{t.send}</a>
            <a href="/my-parcels" className="h-[52px] px-6 rounded-full border border-gray-200 font-bold text-[14px] inline-flex items-center justify-center leading-none">{t.track}</a>
          </div>
        </div>

        {/* REDESIGNED CARD - COMMUNICATES */}
        <div className="relative">
          <div className="absolute -top-10 -right-10 w-[300px] h-[300px] bg-[#8b5cf6]/10 rounded-full blur-[60px]"></div>
          <div className="relative bg-white border border-gray-100 rounded-[32px] p-5 shadow-[0_32px_80px_rgba(1,13,25,0.08)]">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-[16px] leading-tight">{t.cardTitle}</h3>
                <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-black px-2 py-1 rounded-full whitespace-nowrap">• VERIFIED DRIVER</span>
              </div>
              <p className="text-[12px] text-[#010d19]/50 mt-1 leading-snug">{t.cardDesc}</p>
            </div>

            <div className="bg-[#010d19] text-white p-4 rounded-[20px] flex justify-between items-center">
              <div><div className="text-[10px] opacity-60 tracking-widest">{t.from}</div><div className="font-black text-[18px]">Lilongwe</div></div>
              <div className="flex flex-col items-center"><div className="text-[#0a84ff] text-[18px]">→</div><div className="text-[9px] opacity-40">DIRECT</div></div>
              <div className="text-right"><div className="text-[10px] opacity-60 tracking-widest">{t.to}</div><div className="font-black text-[18px]">Blantyre</div></div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="bg-gray-50 p-3 rounded-[16px] text-center"><div className="text-[10px] opacity-50 tracking-widest">{t.departs}</div><div className="font-black text-[13px] mt-1">{t.today}</div></div>
              <div className="bg-gray-50 p-3 rounded-[16px] text-center"><div className="text-[10px] opacity-50 tracking-widest">{t.seats}</div><div className="font-black text-[13px] mt-1">{t.left}</div></div>
              <div className="bg-[#8b5cf6]/10 p-3 rounded-[16px] text-center"><div className="text-[10px] text-[#8b5cf6] tracking-widest">{t.price}</div><div className="font-black text-[13px] text-[#8b5cf6] mt-1">MK 3,500</div></div>
            </div>

            <div className="bg-amber-50 border border-amber-200/70 p-3 rounded-[16px] flex gap-3 items-center mt-3">
              <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-[18px]">📦</div>
              <div><div className="font-bold text-[13px] text-[#010d19]">{t.parcelId}</div><div className="text-[11px] text-[#010d19]/60">{t.matches} • {t.waiting}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#010d19] text-white py-16 rounded-t-[40px]">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-[32px] font-black leading-[1]">{t.howTitle} <span className="text-[#0a84ff]">in 3 steps.</span></h2>
          <p className="text-white/50 text-[14px] mt-2 mb-8 max-w-[400px]">{t.howSub}</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px]"><div className="w-10 h-10 bg-[#0a84ff] rounded-full flex items-center justify-center font-black mb-4">1</div><h3 className="font-black">{t.step1t}</h3><p className="text-[13px] text-white/50 mt-2">{t.step1d}</p></div>
            <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px]"><div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center font-black mb-4">2</div><h3 className="font-black">{t.step2t}</h3><p className="text-[13px] text-white/50 mt-2">{t.step2d}</p></div>
            <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px]"><div className="w-10 h-10 bg-white text-[#010d19] rounded-full flex items-center justify-center font-black mb-4">3</div><h3 className="font-black">{t.step3t}</h3><p className="text-[13px] text-white/50 mt-2">{t.step3d}</p></div>
          </div>
        </div>
      </section>
    </div>
  )
}