"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabaseClient"

export default function DriverPage(){
  const { id } = useParams()
  const [trip, setTrip] = useState<any>(null)
  const [driver, setDriver] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(()=>{
    (async()=>{
      // 1. Get all trips, find this driver_id
      const { data: trips } = await supabase.from('trips').select('*')
      const t = trips?.find((x:any)=> x.driver_id === id) || trips?.[0]
      if(t) setTrip(t)

      // 2. Try to find driver in 3 possible tables
      let d = null
      const tables = ['drivers', 'profiles', 'driver_profiles']
      for(const tbl of tables){
        const { data } = await supabase.from(tbl).select('*').eq('id', id).maybeSingle()
        if(data){ d = data; break }
      }
      if(d) setDriver(d)

      // 3. Reviews
      const { data: revs } = await supabase.from('reviews').select('*').eq('driver_id', id)
      if(revs) setReviews(revs)
    })()
  },[id])

  if(!trip) return <main className="p-4">Loading...</main>

  const name = driver?.full_name || driver?.name || driver?.display_name || "Verified Driver"
  const phone = driver?.phone || driver?.phone_number || driver?.whatsapp || "No phone yet"
  const avg = reviews.length? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "5.0"

  return (
    <main className="max-w-[720px] mx-auto p-4 pb-20">
      <div className="bg-white border border-black/10 rounded-[24px] p-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-full grid place-items-center font-black text-[20px]">{name[0]}</div>
          <div>
            <div className="font-black text-[18px] flex items-center gap-2">{name} <span className="text-[12px]">✓</span> <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[11px]">⭐ {avg} ({reviews.length})</span></div>
            <div className="text-[13px] opacity-60">{phone}</div>
          </div>
        </div>

        <div className="mt-6 bg-black/[0.04] rounded-[16px] p-4">
          <div className="font-black text-[16px]">{trip.from_city} → {trip.to_city}</div>
          <div className="text-[13px] opacity-70 mt-1">{String(trip.date||'').slice(0,10)} • MK {trip.price} • {trip.seats_available||trip.seats||4} seats</div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href={`tel:${phone}`} className="bg-black text-white rounded-full py-3 text-center font-black text-[14px]">Call Driver</a>
          <a href={`https://wa.me/${String(phone).replace(/\D/g,'')}`} target="_blank" className="bg-blue-600 text-white rounded-full py-3 text-center font-black text-[14px]">WhatsApp</a>
        </div>

        <div className="mt-8">
          <div className="font-black">Reviews</div>
          <div className="mt-3 space-y-2">
            {reviews.map((r,i)=><div key={i} className="bg-black/[0.04] rounded-[12px] p-3 text-[13px]"><span className="font-black">⭐ {r.rating}</span> — {r.comment||"Great trip!"}</div>)}
            {reviews.length===0 && <div className="text-[13px] opacity-50">No reviews yet — be first to review!</div>}
          </div>
        </div>
      </div>
    </main>
  )
}