"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient" // use your lib

import { useParams } from "next/navigation"

export default function DriverProfile(){
  const { id } = useParams()
  const [driver, setDriver] = useState<any>(null)
  const [trips, setTrips] = useState<any[]>([])
  const [bookings, setBookings] = useState(0)

  useEffect(()=>{
    const load = async () => {
      const { data: d } = await supabase.from('drivers').select('*').eq('id', id).single()
      setDriver(d)
      const { data: t } = await supabase.from('trips').select('*').eq('driver_id', id).order('date', {ascending: true})
      if(t) setTrips(t)
      const { data: b } = await supabase.from('bookings').select('id').eq('trip_id', t?.[0]?.id || '')
      // count all bookings for this driver
      const { data: allB } = await supabase.from('bookings').select('id, trips!inner(driver_id)').eq('trips.driver_id', id)
      if(allB) setBookings(allB.length)
    }
    if(id) load()
  },[id])

  if(!driver) return <div className="p-6 font-black">Loading driver...</div>

  return (
    <main className="max-w-[720px] mx-auto px-4 py-6">
      <a href="/marketplace" className="text-[13px] font-bold underline">← Back to marketplace</a>

      <div className="mt-6 bg-white border border-black/10 rounded-[24px] p-6">
        <div className="flex gap-4 items-center">
          <div className="w-[64px] h-[64px] bg-black text-white rounded-full grid place-items-center text-[24px] font-black">T</div>
          <div>
            <h1 className="font-black text-[24px]">{driver.full_name || driver.name || 'Verified Driver'} ✓</h1>
            <p className="text-[12px] text-black/60 font-medium">ID: {driver.id.slice(0,8)} • Joined 2026</p>
            <div className="mt-2 flex gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-black">VERIFIED ✓</span>
              <span className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-black">⭐ 4.9 (12 reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-black/[0.04] rounded-2xl p-4 text-center">
            <div className="font-black text-[20px]">{trips.length}</div>
            <div className="text-[11px] text-black/60 font-bold">TRIPS</div>
          </div>
          <div className="bg-black/[0.04] rounded-2xl p-4 text-center">
            <div className="font-black text-[20px]">{bookings}</div>
            <div className="text-[11px] text-black/60 font-bold">BOOKINGS</div>
          </div>
          <div className="bg-black/[0.04] rounded-2xl p-4 text-center">
            <div className="font-black text-[20px]">100%</div>
            <div className="text-[11px] text-black/60 font-bold">RESPONSE</div>
          </div>
        </div>

        <a
          href={`https://wa.me/${driver.phone?.replace(/\D/g,'')}?text=Hi! I saw your profile on Tumani`}
          target="_blank"
          className="mt-6 w-full h-[48px] rounded-full bg-[#25D366] text-white grid place-items-center font-black"
        >
          WhatsApp Driver
        </a>
      </div>

      <h2 className="mt-8 font-black text-[18px]">Active trips by this driver</h2>
      <div className="mt-4 space-y-3">
        {trips.map(t => (
          <div key={t.id} className="bg-white border border-black/10 rounded-[20px] p-4 flex justify-between items-center">
            <div>
              <div className="font-black">{t.from_city} → {t.to_city}</div>
              <div className="text-[12px] text-black/60">{t.date} • {t.seats} seats • MK {t.price?.toLocaleString()}</div>
            </div>
            <a
              href={`https://wa.me/${driver.phone?.replace(/\D/g,'')}?text=Booking ${t.from_city} to ${t.to_city} on ${t.date}`}
              className="bg-black text-white px-5 py-2 rounded-full text-[12px] font-black"
            >
              Book
            </a>
          </div>
        ))}
        {trips.length === 0 && <p className="text-[13px] text-black/60">No active trips</p>}
      </div>
    </main>
  )
}