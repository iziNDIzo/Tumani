"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import Link from "next/link"

export default function Marketplace(){
  const [trips, setTrips] = useState<any[]>([])
  useEffect(()=>{
    (async()=>{
      const { data: a } = await supabase.from('driver_trips').select('*')
      const { data: b } = await supabase.from('trips').select('*')
      const merged = [...(a||[]),...(b||[])]
      console.log("driver_trips:", a?.length, "trips:", b?.length, "merged:", merged.length)
      setTrips(merged)
    })()
  },[])
return (
  <main className="max-w-[720px] mx-auto p-4 pb-20">
    <a href="/" className="inline-block mb-4 text-[13px] font-bold opacity-60">← Back to Home</a>
    <div>
      <h1 className="text-[24px] font-black">Tumani Marketplace</h1>
    </div>
    <p className="text-[13px] opacity-60">{trips.length} trips • Kasungu ↔ Zomba • Verified drivers only</p>
      <div className="mt-6 space-y-3">
        {trips.map(t=>(
          <div key={t.id} className="bg-white border border-black/10 rounded-[20px] p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full grid place-items-center font-black text-[12px]">{t.from_city?.[0]}</div>
                <span className="font-black text-[14px]">Verified Driver ✓</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">⭐ 5.0</span>
              </div>
              <div className="mt-2 font-black">{t.from_city} → {t.to_city}</div>
              <div className="text-[12px] opacity-60">{String(t.date||'').slice(0,10)} • MK {t.price}</div>
            </div>
            <Link href={`/driver/${t.driver_id}`} className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-[12px] font-black">View</Link>
          </div>
        ))}
      </div>
    </main>
  )
}