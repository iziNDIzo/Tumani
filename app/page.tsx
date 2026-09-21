"use client"
import { useState } from "react"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-[#010d19] font-sans antialiased">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 h-[68px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#0a84ff] rounded-[12px] flex items-center justify-center font-black text-white text-[18px]">T</div>
            <span className="font-black text-[20px] tracking-tight">tumani</span>
            <span className="ml-1 bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-black px-2 py-1 rounded-full">BETA</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            <a href="/available-trips" className="h-[40px] px-5 rounded-full border border-gray-200 text-[13px] font-bold hover:bg-gray-50 transition">View Available Trips</a>
            <a href="/apply-driver" className="h-[40px] px-5 rounded-full bg-[#010d19] text-white text-[13px] font-bold hover:opacity-90 transition">Apply as Driver</a>
            <a href="/send-parcels" className="h-[40px] px-6 rounded-full bg-[#0a84ff] text-white text-[13px] font-black hover:bg-[#0870d9] transition shadow-[0_8px_24px_rgba(10,132,255,0.25)]">Send Parcel</a>
          </nav>

          {/* Mobile Hamburger */}
          <button onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 rounded-full bg-gray-50 flex flex-col items-center justify-center gap-1">
            <div className={`w-4 h-[2px] bg-[#010d19] transition ${menuOpen? 'rotate-45 translate-y-[3px]' : ''}`}></div>
            <div className={`w-4 h-[2px] bg-[#010d19] transition ${menuOpen? '-rotate-45 -translate-y-[3px]' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-5 pb-5 pt-2 border-t border-gray-100 bg-white space-y-2">
            <a href="/send-parcels" className="h-[48px] w-full bg-[#0a84ff] text-white rounded-full flex items-center justify-center font-black text-[14px]">Send Parcel</a>
            <a href="/available-trips" className="h-[48px] w-full bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-[14px]">View Available Trips</a>
            <a href="/apply-driver" className="h-[48px] w-full bg-[#010d19] text-white rounded-full flex items-center justify-center font-bold text-[14px]">Apply as Driver</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="max-w-[1200px] mx-auto px-5 pt-12 md:pt-20 pb-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#0a84ff]/10 border border-[#0a84ff]/20 px-3 py-1 rounded-full text-[11px] font-black text-[#0a84ff] mb-4">
            <span className="w-2 h-2 bg-[#0a84ff] rounded-full animate-pulse"></span> LIVE BETWEEN LILONGWE - BLANTYRE - MZUZU
          </div>
          <h1 className="text-[38px] md:text-[56px] font-black leading-[0.9] tracking-[-0.03em]">
            Send anything,<br />
            with drivers<br />
            <span className="text-[#0a84ff]">already going.</span>
          </h1>
          <p className="mt-5 text-[16px] leading-[1.6] text-[#010d19]/60 max-w-[440px]">
            Tumani connects you to verified minibus & taxi drivers heading your way. Cheaper, faster, trusted by Malawians.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/send-parcels" className="h-[52px] px-8 rounded-full bg-[#0a84ff] text-white font-black text-[15px] flex items-center justify-center shadow-[0_12px_32px_rgba(10,132,255,0.3)] hover:bg-[#0870d9] transition">Send Parcel — MK 3,500</a>
            <a href="/my-parcels" className="h-[52px] px-6 rounded-full border border-gray-200 font-bold text-[14px] flex items-center justify-center hover:bg-gray-50 transition">Track My Parcel</a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-[12px]">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-[#8b5cf6] border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-[#0a84ff] border-2 border-white"></div>
            </div>
            <span className="text-[#010d19]/50 font-medium"><b className="text-[#010d19]">1,200+</b> parcels delivered</span>
          </div>
        </div>

        {/* Hero Card Visual */}
        <div className="relative">
          <div className="absolute -top-10 -right-10 w-[300px] h-[300px] bg-[#8b5cf6]/10 rounded-full blur-[60px]"></div>
          <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-[#0a84ff]/10 rounded-full blur-[60px]"></div>
          <div className="relative bg-white border border-gray-100 rounded-[32px] p-5 shadow-[0_32px_80px_rgba(1,13,25,0.08)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-black opacity-40">LIVE TRIP</span>
              <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-black px-2 py-1 rounded-full">• VERIFIED DRIVER</span>
            </div>
            <div className="space-y-3">
              <div className="bg-[#010d19] text-white p-4 rounded-[20px] flex justify-between items-center">
                <div><div className="text-[11px] opacity-60">FROM</div><div className="font-black text-[18px]">Lilongwe</div></div>
                <div className="text-[#0a84ff]">→</div>
                <div className="text-right"><div className="text-[11px] opacity-60">TO</div><div className="font-black text-[18px]">Blantyre</div></div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-[16px]"><div className="text-[10px] opacity-50">DEPARTS</div><div className="font-black text-[13px]">Today 2PM</div></div>
                <div className="bg-gray-50 p-3 rounded-[16px]"><div className="text-[10px] opacity-50">SEATS</div><div className="font-black text-[13px]">3 left</div></div>
                <div className="bg-[#8b5cf6]/10 p-3 rounded-[16px]"><div className="text-[10px] text-[#8b5cf6]">PRICE</div><div className="font-black text-[13px] text-[#8b5cf6]">MK 3,500</div></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-[16px] flex gap-3 items-center">
                <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center font-black">📦</div>
                <div><div className="font-bold text-[13px]">TUM-4RF9-983 pending</div><div className="text-[11px] opacity-60">Matches this trip • Waiting for driver</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#010d19] text-white py-16 md:py-20 rounded-t-[40px]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
            <h2 className="text-[32px] font-black leading-[1]">How Tumani works<br/><span className="text-[#0a84ff]">in 3 steps.</span></h2>
            <p className="text-white/50 max-w-[320px] text-[14px]">No warehouses. No boda boda. Just drivers already traveling.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px]"><div className="w-10 h-10 bg-[#0a84ff] rounded-full flex items-center justify-center font-black mb-4">1</div><h3 className="font-black text-[16px]">Post your parcel</h3><p className="text-[13px] text-white/50 mt-2">From where → to where, phone numbers, done in 30 seconds.</p></div>
            <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px]"><div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center font-black mb-4">2</div><h3 className="font-black text-[16px]">Driver picks it</h3><p className="text-[13px] text-white/50 mt-2">Verified driver on that route claims it. You track live.</p></div>
            <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[24px]"><div className="w-10 h-10 bg-white text-[#010d19] rounded-full flex items-center justify-center font-black mb-4">3</div><h3 className="font-black text-[16px]">Delivered same day</h3><p className="text-[13px] text-white/50 mt-2">Receiver gets SMS, pays driver? Or you pay. Simple.</p></div>
          </div>
        </div>
      </section>
    </div>
  )
}