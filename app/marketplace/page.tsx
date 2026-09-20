"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import Link from "next/link"

export default function Marketplace(){
  const [trips, setTrips] = useState<any[]>([])
  const [ratings, setRatings] = useState<Record<string, {avg: string, count: number}>>({})

  useEffect(()=>{
    async function load(){
      // FIX: removed status filter so we see ALL trips
      const { data: tripsData, error } = await supabase
      .from('trips')
      .select('*, drivers(*)')
      .order('created_at', {ascending:false})

      console.log("TRIPS:", tripsData, "ERROR:", error)
      if(tripsData) setTrips(tripsData)

      const { data: reviews } = await supabase.from('reviews').select('driver_id, rating')
      if(reviews){
        const map: any = {}
        reviews.forEach((r:any)=>{
          if(!map[r.driver_id]) map[r.driver_id] = []
          map[r.driver_id].push(r.rating)
        })
        const calculated: any = {}
        Object.keys(map).forEach(driverId=>{
          const arr = map[driverId]
          const avg = (arr.reduce((a:number,b:number)=>a+b,0)/arr.length).toFixed(1)
          calculated[driverId] = { avg, count: arr.length }
        })
        setRatings(calculated)
      }
    }
    load()
  },[])

  return (
    <main className="max-w-[720px] mx-auto p-4 pb-20">
      <h1 className="font-black text-[24px]">Tumani Marketplace</h1>
      <p className="text-[13px] opacity-60 mt-1">Kasungu ↔ Zomba • Verified drivers only</p>

      <div className="mt-6 space-y-4">
        {trips.map(t=>{
          const r = ratings[t.driver_id]
          const avg = r?.avg || "5.0"
          const count = r?.count || 0
          return (
            <div key={t.id} className="bg-white border border-black/10 rounded-[20px] p-4 flex justify-between items-center hover:border-blue-600 transition">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full grid place-items-center font-black text-[12px]">
                    {t.drivers?.full_name?.[0] || "T"}
                  </div>
                  <Link href={`/driver/${t.driver_id}`} className="font-black text-[14px] hover:text-blue-600">
                    {t.drivers?.full_name || "Verified Driver"} ✓
                  </Link>
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                    ⭐ {avg} {count>0? `(${count})` : ""}
                  </span>
                </div>
                <div className="mt-2 font-black text-[16px]">{t.from_city} → {t.to_city}</div>
                <div className="text-[12px] opacity-60 mt-1">{t.date} • {t.seats} seats • MK {t.price?.toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/driver/${t.driver_id}`} className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-[12px] font-black text-center">View</Link>
                <a href={`https://wa.me/${t.drivers?.phone?.replace(/\D/g,'')}?text=Hi, booking ${t.from_city} to ${t.to_city} on ${t.date}`} target="_blank" className="bg-blue-600 text-white px-5 py-2 rounded-full text-[12px] font-black text-center">Book</a>
              </div>
            </div>
          )
        })}
        {trips.length===0 && <p className="text-center mt-10 opacity-60 font-bold">No active trips right now — check console (F12)</p>}
      </div>
    </main>
  )
}