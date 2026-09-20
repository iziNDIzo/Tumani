"use client"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

function MarketplaceContent(){
  const [trips, setTrips] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fromFilter, setFromFilter] = useState("")
  const [toFilter, setToFilter] = useState("")
  const searchParams = useSearchParams()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    setFromFilter(searchParams.get('from') || "")
    setToFilter(searchParams.get('to') || "")
  },[searchParams])

  useEffect(()=>{
    async function load(){
      // Try with drivers join first
      const { data, error } = await supabase.from('trips').select('*, drivers(full_name, phone)').order('created_at',{ascending:false})

      if(error ||!data || data.length===0){
        console.log("Join failed, trying trips only:", error)
        // Fallback: trips only (this gave you 8 rides before)
        const { data: tripsOnly } = await supabase.from('trips').select('*').order('created_at',{ascending:false})
        if(tripsOnly){
          setTrips(tripsOnly)
          setFiltered(tripsOnly)
        }
      } else {
        setTrips(data)
        setFiltered(data)
      }
      setLoading(false)
    }
    load()
  },[])

  useEffect(()=>{
    let f = trips
    if(fromFilter) f = f.filter(t => t.from_city?.toLowerCase().includes(fromFilter.toLowerCase()))
    if(toFilter) f = f.filter(t => t.to_city?.toLowerCase().includes(toFilter.toLowerCase()))
    setFiltered(f)
  },[fromFilter, toFilter, trips])

  return(
    <div className="min-h-screen bg-[#fcfaf8] text-black">
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

        <div className="mt-6 bg-white border border-black/10 rounded-[20px] md:rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-sm">
          <div className="flex-1 flex items-center bg-[#f5f3ff] rounded-[14px] md:rounded-full px-4 h-[46px]">
            <input value={fromFilter} onChange={e=>setFromFilter(e.target.value)} placeholder="From? e.g. Salima" className="w-full bg-transparent outline-none font-bold text-[13px] placeholder:text-black/40" />
          </div>
          <div className="flex-1 flex items-center bg-[#f5f3ff] rounded-[14px] md:rounded-full px-4 h-[46px]">
            <input value={toFilter} onChange={e=>setToFilter(e.target.value)} placeholder="To? e.g. Lilongwe" className="w-full bg-transparent outline-none font-bold text-[13px] placeholder:text-black/40" />
          </div>
          <div className="h-[46px] md:w-[120px] rounded-[14px] md:rounded-full bg-black text-white grid place-items-center font-black text-[13px]">Filter</div>
        </div>

        {loading? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i=><div key={i} className="h-[200px] bg-white border border-black/10 rounded-[24px] animate-pulse"></div>)}
          </div>
        ) : filtered.length===0? (
          <div className="mt-16 text-center bg-white border border-black/10 rounded-[28px] p-10">
            <p className="font-black text-[18px]">No rides found</p>
            <p className="mt-2 text-[13px] text-black/60 font-medium">RLS is blocking data. Run SQL fix in Supabase.</p>
            <button onClick={()=>{setFromFilter(""); setToFilter("")}} className="mt-4 h-[40px] px-6 rounded-full bg-black text-white font-black text-[12px]">Show all</button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
{filtered.sort((a:any,b:any)=> new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((t:any, index:number)=>{
  const isNew = index === 0 // only the newest trip gets the badge
  return (
  <div key={t.id} className=" bg-white border border-black/10 rounded-[24px] p-5 relative">
    {isNew && <span className="absolute -top-2 -right-2 bg-[#0a84ff] text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse z-10">NEW 🔥</span>}
    <div>
      <div className="flex flex-col justify-between">
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
                    <span className="bg-[#f5f3ff] text-[11px] font-bold px-2.5 py-1 rounded-full">{t.seats || 4} seats</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <p className="font-black text-[20px] tracking-tight">MK {Number(t.price).toLocaleString()}</p>
                  <a href={`https://wa.me/${(t.drivers?.phone||'265').replace(/[^0-9]/g,'')}?text=Hi! Tumani ride ${t.from_city} to ${t.to_city}`} target="_blank" className="h-[40px] px-5 rounded-full bg-[#22c55e] text-white font-black text-[12px] grid place-items-center">WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
          )
          })}
          </div>
        )}
      </main>
    </div>
  )
}

export default function MarketplacePage(){
  return <Suspense fallback={<div className="p-10 font-black">Loading Tumani...</div>}><MarketplaceContent /></Suspense>
}