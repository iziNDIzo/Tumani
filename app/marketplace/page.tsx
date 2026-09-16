"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const [search,setSearch]=useState("")

  useEffect(()=>{
    const load = async ()=>{
      const {data} = await supabase.from('trips').select('*').eq('verified',true).order('created_at',{ascending:false})
      if(data) setTrips(data)
    }
    load()
  },[])

  const filtered = trips.filter(t =>
    `${t.from_city} ${t.to_city}`.toLowerCase().includes(search.toLowerCase())
  )

  return(
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-[24px] font-extrabold text-gray-900 tracking-tight">Find your ride across Malawi</h1>
        <div className="mt-4">
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search Lilongwe, Blantyre..."
            className="w-full md:w-[380px] bg-white border border-gray-300 rounded-full px-5 py-3 text-[14px] font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
        </div>

        {filtered.length===0 && <p className="mt-12 text-center text-gray-500 font-medium">No verified trips yet. Go to /admin to approve.</p>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t=>(
            <div key={t.id} className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-extrabold text-gray-900">{t.driver_name} <span className="text-green-600">✓ Verified</span></p>
              </div>
              <p className="mt-3 text-[18px] font-extrabold text-gray-900">{t.from_city} → {t.to_city}</p>
              <p className="mt-1 text-[13px] font-medium text-gray-600">{t.date} • {t.time} • {t.vehicle} • Plate {t.plate}</p>
              <p className="mt-3 text-[18px] font-extrabold text-gray-900">MK {t.seat_price}</p>

              <div className="mt-3 w-full h-[120px] bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.vehicle_url} alt="vehicle" className="w-full h-full object-cover" />
              </div>

              <a
                href={`https://wa.me/${t.whatsapp.replace(/[^0-9]/g,'')}`}
                target="_blank"
                className="mt-4 block w-full bg-[#22c55e] text-white font-extrabold text-center py-3 rounded-full hover:bg-[#16a34a] text-[14px]"
              >
                WhatsApp {t.driver_name.split(' ')[0]}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}