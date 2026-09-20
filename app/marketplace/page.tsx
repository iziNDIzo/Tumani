"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import Link from "next/link"

export default function Marketplace(){
  const [trips, setTrips] = useState<any[]>([])

  useEffect(()=>{
    (async()=>{
      const { data, error } = await supabase.from('driver_trips').select('*')
      console.log("TRIPS:", data, "ERR:", error)
      if(data) setTrips(data)
    })()
  },[])

  return (
    <main className="max-w-[720px] mx-auto p-4 pb-20">
      <h1 className="font-black text-[24px]">Tumani Marketplace</h1>
      <p className="text-[13px] opacity-60 mt-1">{trips.length} trips • Blue is primary 🔵</p>

      <div className="mt-6 space-y-3">
        {trips.map(t=>(
          <div key={t.id} className="bg-white border border-black/10 rounded-[20px] p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full grid place-items-center font-black text-[12px]">{t.from_city?.[0] || 'T'}</div>
                <span className="font-black text-[14px]">Verified Driver ✓</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">⭐ 5.0</span>
              </div>
              <div className="mt-2 font-black text-[15px]">{t.from_city} → {t.to_city}</div>
              <div className="text-[12px] opacity-60">{String(t.date || t.departure_date || '').slice(0,10)} • MK {t.price} • {t.seats_available || t.seats || 4} seats</div>
            </div>
            <Link href={`/driver/${t.driver_id}`} className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-[12px] font-black">View</Link>
          </div>
        ))}
        {trips.length===0 && <p className="text-center mt-20 font-black opacity-40">Loading trips...</p>}
      </div>
    </main>
  )
}