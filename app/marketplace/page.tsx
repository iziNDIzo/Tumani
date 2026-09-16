"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const [search,setSearch]=useState("")
  const [error,setError]=useState("")

  useEffect(()=>{
    const load = async ()=>{
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if(!url ||!key){ setError("Missing Supabase env vars"); return; }
        const supabase = createClient(url, key)
        const {data, error} = await supabase.from('trips').select('*').eq('verified',true).order('created_at',{ascending:false})
        if(error) setError(error.message)
        if(data) setTrips(data)
      } catch(e:any){ setError(e.message) }
    }
    load()
  },[])

  const filtered = trips.filter(t =>
    `${t.from_city||''} ${t.to_city||''}`.toLowerCase().includes(search.toLowerCase())
  )

  if(error) return <div className="p-10 text-center"><p className="text-red-600 font-bold">{error}</p></div>

  return(
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Find your ride across Malawi</h1>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Lilongwe, Blantyre..." className="mt-4 w-full md:w-[380px] bg-white border border-gray-300 rounded-full px-5 py-3 text-[14px] font-bold text-gray-900 placeholder:text-gray-400 outline-none shadow-sm" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t:any)=>(
            <div key={t.id} className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm hover:shadow-md transition">
              <p className="text-[13px] font-extrabold text-gray-900">{t.driver_name} <span className="text-green-600">✓ Verified</span></p>
              <p className="mt-2 text-[19px] font-extrabold text-gray-900 leading-tight">{t.from_city} → {t.to_city}</p>
              <p className="mt-1 text-[13px] font-medium text-gray-600">{t.date} • {t.time} • {t.vehicle} • Plate {t.plate}</p>
              <p className="mt-2 text-[18px] font-extrabold text-gray-900">MK {Number(t.seat_price).toLocaleString()}</p>

              {t.vehicle_url && (
                <div className="mt-3 w-full h-[150px] bg-gray-100 rounded-[16px] overflow-hidden border border-gray-100">
                  <img src={t.vehicle_url} alt="vehicle" className="w-full h-full object-cover" onError={(e:any)=>e.target.style.display='none'} />
                </div>
              )}

              <a href={`https://wa.me/${(t.whatsapp||'').replace(/[^0-9]/g,'')}`} target="_blank" className="mt-4 block w-full bg-[#22c55e] text-white font-extrabold text-center py-3.5 rounded-full text-[14px] hover:bg-[#16a34a]">WhatsApp {t.driver_name?.split(' ')[0]}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}