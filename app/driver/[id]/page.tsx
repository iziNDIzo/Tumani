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
      const { data: trips } = await supabase.from('trips').select('*')
      const t = trips?.find((x:any)=> x.driver_id === id) || trips?.[0]
      if(t) setTrip(t)

      let d = null
      for(const tbl of ['drivers','profiles','driver_profiles']){
        const { data } = await supabase.from(tbl).select('*').eq('id', id).maybeSingle()
        if(data){ d = data; break }
      }
      if(d) setDriver(d)

      const { data: revs } = await supabase.from('reviews').select('*').eq('driver_id', id)
      if(revs) setReviews(revs)
    })()
  },[id])

  if(!trip) return <main className="p-4">Loading...</main>

  const name = driver?.full_name || driver?.name || "jh"
  const phone = driver?.phone || driver?.phone_number || "0998838866"
  const avg = reviews.length? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "5.0"

  return (
    <main className="max-w-[720px] mx-auto p-4 pb-20">
      <a href="/marketplace" className="inline-block mb-4 text-[13px] font-bold opacity-60">← Back to Marketplace</a>
      <div className="bg-white border border-black/10 rounded-[24px] p-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-full grid place-items-center font-black text-[20px]">j</div>
          <div>
            <div className="font-black text-[18px] flex items-center gap-2">{name} <span>✓</span> <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[11px]">⭐ {avg} ({reviews.length})</span></div>
            <div className="text-[13px] opacity-60">{phone}</div>
          </div>
        </div>

        <div className="mt-6 bg-black/[0.04] rounded-[16px] p-4">
          <div className="font-black text-[16px]">{trip.from_city} → {trip.to_city}</div>
          <div className="text-[13px] opacity-70 mt-1">{String(trip.date||'').slice(0,10)} • MK {trip.price} • {trip.seats_available||trip.seats||4} seats</div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href={`tel:${phone}`} className="bg-black text-white rounded-full py-3 text-center font-black text-[14px]">Call Driver</a>
          {/* THIS IS GREEN NOW */}
          <a href={`https://wa.me/${String(phone).replace(/\D/g,'')}`} target="_blank" className="bg-[#25D366] text-white rounded-full py-3 text-center font-black text-[14px]">WhatsApp</a>
        </div>

        <div className="mt-8">
          <div className="font-black">Reviews</div>
          <div className="mt-3 space-y-2">
            {reviews.map((r,i)=><div key={i} className="bg-black/[0.04] rounded-[12px] p-3 text-[13px]"><span className="font-black">⭐ {r.rating}</span> — {r.comment||"Great trip!"}</div>)}
            {reviews.length===0 && <div className="text-[13px] opacity-50">No reviews yet — be first to review!</div>}

            {/* PASTE LOCATION - REVIEW FORM */}
            <form onSubmit={async(e)=>{
              e.preventDefault()
              const form = e.currentTarget
const { error } = await supabase.from('reviews').insert({
    driver_id: id,
    rating: Number(form.rating.value),
    comment: form.comment.value,
    author_name: 'Guest Rider'
  })
  if(error){ alert('Error: '+error.message); return }
  form.reset()
  const { data } = await supabase.from('reviews').select('*').eq('driver_id', id)
  if(data) setReviews(data)
}} className="mt-4 flex gap-2 w-full">
  <select name="rating" className="border rounded-full px-3 py-2 text-[13px] shrink-0">
    <option value="5">⭐ 5</option>
    <option value="4">⭐ 4</option>
    <option value="3">⭐ 3</option>
    <option value="2">⭐ 2</option>
    <option value="1">⭐ 1</option>
  </select>
  <input name="comment" placeholder="Write a review..." className="flex-1 min-w-0 border rounded-full px-4 py-2 text-[13px]" required />
  <button className="bg-black text-white rounded-full px-5 text-[13px] font-black shrink-0">Post</button>
</form>

          </div>
        </div>
      </div>
    </main>
  )
}