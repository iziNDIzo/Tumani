"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function TripDetail() {
  const { id } = useParams()
  const [trip, setTrip] = useState<any>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('trips').select('*').eq('id', id).single()
      if (data) setTrip(data)
    }
    if (id) load()
  }, [id])

  if (!trip) return <div className="bg-white min-h-screen p-10 font-black text-black">Loading trip...</div>

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[900px] mx-auto p-4 md:p-8 bg-white">
        <Link href="/marketplace" className="font-black text-[14px] text-black/60 hover:text-black">
          ← Back to Marketplace
        </Link>

        <div className="mt-6 bg-white rounded-[24px] border-2 border-black/10 p-6 md:p-8 shadow-sm">
          <p className="font-black text-[15px] text-black">
            {trip.driver_name}
            <span className="ml-2 bg-green-500 text-white text-[11px] px-3 py-1 rounded-full">
              ✓ Verified
            </span>
          </p>

          <h1 className="font-black text-[36px] text-black mt-3 leading-none">
            {trip.from_city} → {trip.to_city}
          </h1>

          <p className="font-bold text-[14px] text-black/60 mt-3">
            {trip.date} • {trip.time} • {trip.vehicle || 'Hilux'} • Plate {trip.plate}
          </p>

          <p className="font-black text-[32px] text-black mt-4">
            MK {Number(trip.seat_price).toLocaleString()}
          </p>
          <p className="font-bold text-[12px] text-black/40 -mt-1">per seat</p>

          <div className="mt-6 h-[340px] md:h-[460px] rounded-[16px] overflow-hidden bg-gray-50 border border-black/5">
            <img src={trip.vehicle_url} alt="Vehicle" className="w-full h-full object-cover" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 bg-[#f6f7f9] rounded-[14px] p-4 border border-black/5">
            <div>
              <p className="font-bold text-[11px] text-black/40 uppercase">Driver</p>
              <p className="font-black text-[14px] text-black mt-1">{trip.driver_name}</p>
            </div>
            <div>
              <p className="font-bold text-[11px] text-black/40 uppercase">WhatsApp</p>
              <p className="font-black text-[14px] text-black mt-1">{trip.whatsapp}</p>
            </div>
            <div>
              <p className="font-bold text-[11px] text-black/40 uppercase">Vehicle</p>
              <p className="font-black text-[14px] text-black mt-1">{trip.vehicle || 'Toyota Hilux'}</p>
            </div>
            <div>
              <p className="font-bold text-[11px] text-black/40 uppercase">Plate</p>
              <p className="font-black text-[14px] text-black mt-1">{trip.plate}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${trip.whatsapp?.replace(/[^0-9]/g, '')}?text=Hi ${trip.driver_name}, I'm interested in your ${trip.from_city} to ${trip.to_city} trip on ${trip.date} - found on Tumani`}
            target="_blank"
            className="mt-6 w-full bg-[#22c55e] text-white font-black py-4 rounded-full flex justify-center text-[16px]"
          >
            WhatsApp {trip.driver_name?.split(' ')[0]}
          </a>

          <p className="font-bold text-[11px] text-black/30 text-center mt-3">Verified driver • Tumani Malawi</p>
        </div>
      </div>
    </div>
  )
}