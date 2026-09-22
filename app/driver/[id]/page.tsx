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
  const name = driver?.full_name || driver?.name || "Driver"
  const phone = driver?.phone || driver?.phone_number || "0998838866"
  const avg = reviews.length? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "5.0"

  return (
    <main className="max-w-[720px] mx-auto p-4 pb-20">
      <a href="/marketplace" className="inline-block mb-4 text-[13px] font-bold opacity-60">← Back to Marketplace</a>
      <div className="bg-white border border-black/10 rounded-[24px] p-5">
        <div className="flex items-center gap-3">
         <div className="w-14 h-14 bg-[#0a84ff] text-white rounded-full grid place-items-center">{name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="font-black text-[18px] flex items-center gap-2">{name} <span>✓</span> <span className="bg-[#0a84ff] text-white px-2 py-0.5 rounded-full text-[11px]">⭐ {avg} ({reviews.length})</span></div>
            <div className="text-[13px] opacity-60">{phone}</div>
          </div>
        </div>
        <div className="mt-6 bg-black/[0.04] rounded-[16px] p-4">
          <div className="font-black text-[16px]">{trip.from_city} → {trip.to_city}</div>
          <div className="text-[13px] opacity-70 mt-1">{String(trip.date||'').slice(0,10)} • MK {trip.price} • {trip.seats_available||trip.seats||4} seats</div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href={`tel:${phone}`} className="bg-black text-white rounded-full py-3 text-center font-black text-[14px]">Call Driver</a>
          <a href={`https://wa.me/265${String(phone).replace(/^0/,'').replace(/\D/g,'')}`} target="_blank" className="bg-[#25D366] text-white rounded-full py-3 text-center font-black text-[14px]">WhatsApp</a>
        </div>
        <div className="mt-4 p-4 rounded-xl border bg-white">
          <p className="text-[14px] font-black mb-2">Book this trip</p>
          <input id="cust_name" placeholder="Your name" className="w-full p-3 rounded-lg border text-[14px] mb-2" />
          <input id="cust_phone" placeholder="Your WhatsApp number" className="w-full p-3 rounded-lg border text-[14px] mb-2" />
          <button onClick={async(e)=>{
            const btn = e.currentTarget as HTMLButtonElement
            const name = (document.getElementById('cust_name') as HTMLInputElement).value
            const phone = (document.getElementById('cust_phone') as HTMLInputElement).value
            if(!name ||!phone) return alert('Add name & phone')
            btn.disabled = true; btn.innerText = "Booking..."
            const { error } = await supabase.from('bookings').insert({ trip_id: trip.id, driver_id: driver.id, customer_name: name, customer_phone: phone, status: 'pending' })
            if(error){ alert(error.message); btn.disabled=false; btn.innerText="Book This Trip"; return }
            localStorage.setItem("tumani_last_phone", phone)
            alert('Booked! Driver will contact you.')
            window.location.href = `/my-bookings?phone=${phone}`
          }} className="w-full p-3 rounded-xl bg-[#0a84ff] text-white font-bold text-[14px]">Book This Trip</button>
        </div>
      </div>
    </main>
  )
}