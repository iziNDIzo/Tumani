"use client"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-black selection:bg-black selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-[64px] md:h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0a84ff] grid place-items-center text-white font-black text-[16px]">T</div>
            <span className="font-black text-[18px] tracking-tight">Tumani</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/marketplace" className="hidden md:grid h-[40px] px-5 place-items-center rounded-full bg-black text-white font-black text-[13px]">Find Trips</Link>
            <Link href="/marketplace" className="md:hidden h-[38px] px-4 grid place-items-center rounded-full bg-black text-white font-black text-[13px]">Find Trips</Link>
            <Link href="/driver/login" className="h-[38px] md:h-[40px] px-4 md:px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[12px] md:text-[13px]">Login as Driver</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 pt-8 md:pt-16 lg:pt-24 pb-12">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Verified Drivers Only • Malawi
            </div>
            <h1 className="mt-4 md:mt-6 font-black text-[38px] md:text-[56px] lg:text-[72px] leading-[0.9] tracking-[-0.04em]">
              Send anything,<br />
              go anywhere<span className="text-[#7c3aed]">.</span>
            </h1>
            <p className="mt-4 md:mt-6 text-[15px] md:text-[17px] leading-[1.5] font-medium text-black/60 max-w-[520px]">
              Malawi&apos;s trusted driver hub. Verified drivers post trips, accept errands & deliver parcels. For businesses that need to move things daily.
            </p>

            {/* Search */}
            <div className="mt-6 md:mt-8 bg-white border border-black/10 rounded-[20px] md:rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
              <div className="flex-1 flex items-center bg-[#f5f3ff] md:bg-[#f5f3ff] rounded-[14px] md:rounded-full px-4 h-[48px]">
                <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Where from? e.g. Salima" className="w-full bg-transparent outline-none font-bold text-[14px] placeholder:text-black/40" />
              </div>
              <div className="flex-1 flex items-center bg-[#f5f3ff] rounded-[14px] md:rounded-full px-4 h-[48px]">
                <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Where to? e.g. Lilongwe" className="w-full bg-transparent outline-none font-bold text-[14px] placeholder:text-black/40" />
              </div>
              <Link href={`/marketplace?from=${from}&to=${to}`} className="h-[48px] md:w-[132px] rounded-[14px] md:rounded-full bg-black text-white grid place-items-center font-black text-[14px]">Search</Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="bg-black/5 px-3 py-1.5 rounded-full">Lilongwe → Blantyre</span>
              <span className="bg-black/5 px-3 py-1.5 rounded-full">Salima → Mangochi</span>
              <span className="bg-black/5 px-3 py-1.5 rounded-full">Mzuzu → Lilongwe</span>
            </div>
          </div>

          {/* Right Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-white rounded-[24px] border border-black/10 p-5 md:p-6">
              <div className="w-10 h-10 rounded-[12px] bg-[#fef3c7] grid place-items-center text-[20px]">📦</div>
              <h3 className="mt-4 font-black text-[16px]">Send Parcel</h3>
              <p className="mt-2 text-[13px] leading-[1.5] text-black/60 font-medium">From documents to packages. Business verified customers get tracking codes.</p>
              <Link href="/parcel/new" className="mt-4 inline-block font-black text-[12px] underline">Post an errand →</Link>
            </div>
            <div className="bg-white rounded-[24px] border border-black/10 p-5 md:p-6">
              <div className="w-10 h-10 rounded-[12px] bg-[#dcfce7] grid place-items-center text-[20px]">🚗</div>
              <h3 className="mt-4 font-black text-[16px]">Book a Ride</h3>
              <p className="mt-2 text-[13px] leading-[1.5] text-black/60 font-medium">Seats with trusted drivers posting trips daily across Malawi.</p>
              <Link href="/marketplace" className="mt-4 inline-block font-black text-[12px] underline">Find rides →</Link>
            </div>
            <div className="xl:col-span-2 bg-black text-white rounded-[24px] p-5 md:p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-60">For Drivers</p>
                  <h3 className="mt-2 font-black text-[18px] leading-[1.1]">Own hub to showcase yourself</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center">→</div>
              </div>
              <p className="mt-4 text-[13px] leading-[1.5] text-white/60 font-medium">Post: &quot;Going to Blantyre, 3 spaces left&quot;. Accept errands like airport pickups. Get paid.</p>
              <Link href="/driver/register" className="mt-5 h-[44px] rounded-full bg-white text-black grid place-items-center font-black text-[13px]">Apply as Driver</Link>
            </div>
          </div>
        </div>

        {/* TRUST SECTION */}
        <div className="mt-6 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-black/10 rounded-[28px] p-6 md:p-8">
            <h2 className="font-black text-[22px] md:text-[28px] tracking-tight">Trust is our product. Not just rides.</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-black text-[13px]">🔍 Driver Verification</p>
                <p className="mt-2 text-[12px] leading-[1.5] text-black/60 font-medium">True identity, proof of vehicle ownership, road traffic documents, licence, criminal record check. No pass = no account.</p>
              </div>
              <div>
                <p className="font-black text-[13px]">🏢 Business Verification</p>
                <p className="mt-2 text-[12px] leading-[1.5] text-black/60 font-medium">Customers posting errands must have a business. We check proof of business because parcels = businesses.</p>
              </div>
              <div>
                <p className="font-black text-[13px]">🛡️ Safe Errands</p>
                <p className="mt-2 text-[12px] leading-[1.5] text-black/60 font-medium">Airport pickup? Document delivery? Only verified drivers can accept. Every trip tracked with WhatsApp support.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#0a84ff] text-white rounded-[28px] p-6 md:p-8">
            <p className="font-black text-[48px] leading-[0.9]">{`8+`}</p>
            <p className="mt-2 font-bold text-[13px]">Verified trips live now</p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-[11px] font-black bg-white/15 rounded-full px-3 py-2"><span>Phalombe → Salima</span><span>MK 200k</span></div>
              <div className="flex justify-between text-[11px] font-black bg-white/15 rounded-full px-3 py-2"><span>Salima → Blantyre</span><span>MK 35k</span></div>
            </div>
            <Link href="/marketplace" className="mt-6 block h-[44px] rounded-full bg-white text-black grid place-items-center font-black text-[13px]">View Marketplace</Link>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-16 md:mt-24 pb-20">
          <h2 className="font-black text-[24px] md:text-[32px] tracking-tight">How Tumani works</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-[20px] bg-white border border-black/10 p-6">
              <span className="font-black text-[11px] bg-black text-white px-2.5 py-1 rounded-full">01</span>
              <h4 className="mt-4 font-black text-[15px]">Drivers post trips</h4>
              <p className="mt-2 text-[13px] text-black/60 font-medium">&quot;Going to Blantyre, I have space for 3 passengers or parcels&quot;</p>
            </div>
            <div className="rounded-[20px] bg-white border border-black/10 p-6">
              <span className="font-black text-[11px] bg-black text-white px-2.5 py-1 rounded-full">02</span>
              <h4 className="mt-4 font-black text-[15px]">Businesses post errands</h4>
              <p className="mt-2 text-[13px] text-black/60 font-medium">&quot;Pick my client at KIA airport, deliver to Area 47&quot;</p>
            </div>
            <div className="rounded-[20px] bg-white border border-black/10 p-6">
              <span className="font-black text-[11px] bg-black text-white px-2.5 py-1 rounded-full">03</span>
              <h4 className="mt-4 font-black text-[15px]">Verified match + WhatsApp</h4>
              <p className="mt-2 text-[13px] text-black/60 font-medium">Instant WhatsApp connection, tracking, payment on delivery</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/10 py-8 text-center text-[11px] font-bold text-black/40">
        © 2026 Tumani • Malawi&apos;s Verified Driver Hub • Built in Lilongwe
      </footer>
    </div>
  )
}