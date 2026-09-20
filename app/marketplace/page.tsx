"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function MarketplacePage(){
  const [trips, setTrips] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fromFilter, setFromFilter] = useState("")
  const [toFilter, setToFilter] = useState("")

  const searchParams = useSearchParams()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    const from = searchParams.get('from') || ""
    const to = searchParams.get('to') || ""
    setFromFilter(from)
    setToFilter(to)
  },[searchParams])

  useEffect(()=>{
    async function load(){
      const { data } = await supabase.from('trips').select('*, drivers(full_name, phone)').order('created_at',{ascending:false})
      if(data){
        setTrips(data)
        setFiltered(data)
      }
      setLoading(false)
    }
    load()
  },[])

  useEffect(()=>{
    let f = trips
    if(fromFilter) f = f.filter(t => t.from_city.toLowerCase().includes(fromFilter.toLowerCase()))
    if(toFilter) f = f.filter(t => t.to_city.toLowerCase().includes(toFilter.toLowerCase()))
    setFiltered(f)
  },[fromFilter, toFilter, trips])

  return(
    <div className="min-h-screen bg-[#fcfaf8] text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0a84ff] grid place-items-center text-white font-black">T</div>
            <span className="font-black text-[18px] tracking-tight">Tumani</span>
          </Link>
          <Link href="/" className="h-[40px] px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[13px]">Home</Link>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-black text-[28px] md:text-[36px] tracking-tight leading-[0.9]">Verified trips across Malawi</h1>
            <p className="mt-2 text-[13px] font-medium text-black/60">{filtered.length} rides available • Trusted drivers only</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-white border border-black/10 px-3 py-1.5 rounded-full text-[11px] font-black">LIVE NOW</span>
            <span className="bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-black">{trips.length} TOTAL</span>
          </div>
        </div>

        {/* Search Bar - Responsive */}
        <div className="mt-6 bg-white border border-black/10 rounded-[20px] md:rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-sm">
          <div className="flex-1 flex items-center bg-[#f5f3ff] rounded-[14px] md:rounded-full px-4 h-[46px]">
            <input value={fromFilter} onChange={e=>setFromFilter(e.target.value)} placeholder="From? e.g. Salima" className="w-full bg-transparent outline-none font-bold text-[13px] placeholder:text-black/40" />
          </div>
          <div className="flex-1 flex items-center bg-[#f5f3ff] rounded-[14px] md:rounded-full px-4 h-[46px]">
            <input value={toFilter} onChange={e=>setToFilter(e.target.value)} placeholder="To? e.g. Lilongwe" className="w-full bg-transparent outline-none font-bold text-[13px] placeholder:text-black/40" />
          </div>
          <button onClick={()=>{}} className="h-[46px] md:w-[120px] rounded-[14px] md:rounded-full bg-black text-white grid place-items-center font-black text-[13px]">Filter</button>
        </div>

        {/* Quick filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            {label:"All", from:"", to:""},
            {label:"Lilongwe → Blantyre", from:"Lilongwe", to:"Blantyre"},
            {label:"Salima → Mangochi", from:"Salima", to:"Mangochi"},
            {label:"Mzuzu → Lilongwe", from:"Mzuzu", to:"Lilongwe"},
          ].map(chip=>(
            <button key={chip.label} onClick={()=>{setFromFilter(chip.from); setToFilter(chip.to)}} className={`px-3 py-1.5 rounded-full text-[11px] font-black border ${fromFilter===chip.from && toFilter===chip.to? 'bg-black text-white border-black' : 'bg-white border-black/10'}`}>
              {chip.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i=><div key={i} className="h-[200px] bg-white border border-black/10 rounded-[24px] animate-pulse"></div>)}
          </div>
        ) : filtered.length===0? (
          <div className="mt-16 text-center bg-white border border-black/10 rounded-[28px] p-10">
            <p className="font-black text-[18px]">No rides found for {fromFilter} → {toFilter}</p>
            <p className="mt-2 text-[13px] text-black/60 font-medium">Try clearing filters</p>
            <button onClick={()=>{setFromFilter(""); setToFilter("")}} className="mt-4 h-[40px] px-6 rounded-full bg-black text-white font-black text-[12px]">Show all rides</button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map(t=>(
              <div key={t.id} className="bg-white border border-black/10 rounded-[24px] p-5 flex flex-col justify-between hover:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)] hover:border-black/20 transition-all">
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-black text-white grid place-items-center font-black text-[11px]">{(t.drivers?.full_name?.[0]||'T')}</div>
                      <p className="font-black text-[12px]">{t.drivers?.full_name || 'Verified Driver'}</p>
                      <span className="text-[10px]">✓</span>
                    </div>
                    <span className="text-[9px] font-black tracking-widest bg-[#dcfce7] text-[#166534] px-2.5 py-1 rounded-full">VERIFIED</span>
                  </div>

                  <p className="mt-4 font-black text-[18px] leading-[1.1] tracking-tight">{t.from_city} → {t.to_city}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-[#f5f3ff] text-[11px] font-bold px-2.5 py-1 rounded-full">{t.date || 'Today'}</span>
                    <span className="bg-[#f5f3ff] text-[11px] font-bold px-2.5 py-1 rounded-full">{t.time || 'Anytime'}</span>
                    <span className="bg-[#f5f3ff] text-[11px] font-bold px-2.5 py-1 rounded-full">{t.seats || 4} seats</span>
                  </div>

                  {t.description && <p className="mt-3 text-[12px] text-black/60 font-medium line-clamp-2">{t.description}</p>}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="font-black text-[20px] tracking-tight">MK {Number(t.price).toLocaleString()}</p>
                  <a href={`https://wa.me/${(t.drivers?.phone||'').replace(/[^0-9]/g,'')}?text=Hi! I want to book Tumani ride: ${t.from_city} to ${t.to_city} on ${t.date}. Still available?`} target="_blank" className="h-[40px] px-5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-[12px] grid place-items-center transition-colors">
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}