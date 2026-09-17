"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function TripPage() {
  const { id } = useParams()
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('trips').select('*').eq('id', id).single()
      if (data) setTrip(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="bg-white min-h-screen p-8"><p className="font-black text-black">Loading...</p></div>
  if (!trip) return <div className="bg-white min-h-screen p-8"><p className="font-black text-black">Trip not found</p><Link href="/marketplace" className="text-blue-600 font-black">Back to Marketplace</Link></div>

  return (
    <div className="bg-[#f6f7f9] min-h-screen">
      <div className="max-w-[800px] mx-auto p-4 md:p-8 bg-[#f6f7f9]">
        <Link href="/marketplace" className="font-black text-[14px] text-black mb-6 inline-block">← Back to Marketplace</Link>

        <div className="bg-white rounded-[20px] p-6 md:p-8 border-2 border-black/10 shadow-sm">
          <p className="font-black text-[14px] text-black">
            {trip.driver_name}
            <span className="ml-2 bg-green-500 text-white text-[11px] px-3 py-1 rounded-full">✓ Verified</span>
          </p>

          <h1 className="font-black text-[28px] md:text-[34px] text-black mt-3 leading-none">
            {trip.from_city} → {trip.to_city}
          </h1>

          <p className="font-bold text-[13px] text-black/60 mt-3">
            {trip.date} • {trip.time} • Hilux • Plate {trip.plate}
          </p>

          <p className="font-black text-[30px] text-black mt-4">
            MK {Number(trip.seat_price).toLocaleString()}
          </p>
          <p className="font-bold text-[12px] text-black/50">per seat</p>

          <div className="mt-6 h-[320px] md:h-[420px] rounded-[16px] overflow-hidden bg-gray-50 border border-black/5">
            <img src={trip.vehicle_url} alt="Vehicle" className="w-full h-full object-cover" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 bg-[#f6f7f9] rounded-[14px] p-4">
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
              <p className="font-bold text-[11px] text-black/40 uppercase">Seats Left</p>
              <p className="font-black text-[14px] text-black mt-1">{trip.seats || '4'}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${trip.whatsapp?.replace(/[^0-9]/g, '')}?text=Hi ${trip.driver_name}, I'm interested in your ${trip.from_city} to ${trip.to_city} trip on ${trip.date} - found on Tumani`}
            target="_blank"
            className="mt-6 w-full bg-[#22c55e] text-white font-black py-4 rounded-full flex justify-center text-[16px]"
          >
            WhatsApp {trip.driver_name?.split(' ')[0]} on WhatsApp
          </a>

          <p className="font-bold text-[11px] text-black/40 text-center mt-3">
            Verified driver • Plate {trip.plate} • Tumani
          </p>
        </div>
      </div>
    </div>
  )
}