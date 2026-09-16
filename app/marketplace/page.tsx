"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function Marketplace(){
  const [trips,setTrips]=useState<any[]>([])
  const [search,setSearch]=useState("")

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    const load = async ()=>{
      const {data} = await supabase.from('trips').select('*').eq('verified',true).order('created_at',{ascending:false})
      if(data) setTrips(data)
    }
    load()
  },[])

  const filtered = trips.filter((t:any)=>
    `${t.from_city} ${t.to_city} ${t.driver_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return(
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* HEADER - HIGH CONTRAST */}
      <header className="h-[64px] bg-white border-b-2 border-black/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">T</div><span className="font-black text-[20px] text-black tracking-tight">Tumani</span></div>
        <div className="flex gap-6 items-center"><span className="font-black text-[14px] text-black">Marketplace</span><span className="font-bold text-[14px] text-gray-500">My Trips</span><button className="bg-blue-600 text-white font-black px-6 py-2.5 rounded-full text-[14px]">+ Post</button></div>
      </header>

      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        <h1 className="text-[32px] md:text-[38px] font-black text-black tracking-tight leading-none">Find your ride across Malawi</h1>

        {/* SEARCH - BIG & READABLE */}
        <div className="mt-6 max-w-[420px]">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Lilongwe, Blantyre, Mzuzu..." className="w-full h-[56px] bg-white border-2 border-black/10 rounded-full px-6 text-[16px] font-bold text-black placeholder:text-gray-400 shadow-sm focus:border-black outline-none"/>
        </div>

        {/* CARDS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((t:any)=>(
            <div key={t.id} className="bg-white rounded-[28px] border-2 border-black/10 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-black text-[16px] text-black">{t.driver_name} <span className="text-green-600 text-[13px] bg-green-100 px-2 py-1 rounded-full ml-1">✓ Verified</span></p>
                  <p className="font-black text-[24px] text-black mt-2 leading-none">{t.from_city} → {t.to_city}</p>
                  <p className="font-bold text-[13px] text-black/60 mt-2">{t.date} • {t.time} • {t.vehicle || 'Hilux'} • Plate {t.plate}</p>
                </div>
              </div>

              <p className="font-black text-[26px] text-black mt-4">MK {Number(t.seat_price).toLocaleString()}</p>

              {/* VEHICLE PHOTO - REAL, NOT FAINT */}
              <div className="mt-4 h-[200px] bg-gray-100 rounded-[18px] overflow-hidden border-2 border-black/5">
                {t.vehicle_url?
                  <img src={t.vehicle_url} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center bg-gray-200"><p className="font-black text-gray-500">No Vehicle Photo</p></div>
                }
              </div>

              <a href={`https://wa.me/${t.whatsapp}?text=Hi ${t.driver_name}, I want your trip ${t.from_city} to ${t.to_city}`} target="_blank" className="mt-5 w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-[16px] py-4 rounded-full flex items-center justify-center">
                WhatsApp {t.driver_name.split(' ')[0]}
              </a>
            </div>
          ))}
        </div>

        {filtered.length===0 && (
          <div className="mt-20 text-center"><p className="font-black text-black text-[20px]">No verified trips found</p><p className="font-bold text-gray-500 mt-2">Try searching Salima, Mchinji, Lilongwe</p></div>
        )}
      </div>
    </div>
  )
}