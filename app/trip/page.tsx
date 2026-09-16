"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function TripDetail(){
  const { id } = useParams()
  const [trip, setTrip] = useState<any>(null)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    const load = async ()=>{
      const {data} = await supabase.from('trips').select('*').eq('id', id).single()
      if(data) setTrip(data)
    }
    if(id) load()
  },[id])

  if(!trip) return <div className="p-10 font-black text-black">Loading trip...</div>

  return(
    <div className="bg-[#f6f7f9] min-h-screen">
      <div className="max-w-[900px] mx-auto p-4 md:p-8">
        <Link href="/" className="font-black text-[14px] text-black/60">← Back to Marketplace</Link>

        <div className="mt-6 bg-white rounded-[24px] border-2 border-black/15 p-6 md:p-8">
          <p className="font-black text-[15px] text-black">{trip.driver_name} <span className="ml-2 bg-green-100 text-green-700 text-[12px] font-black px-3 py-1 rounded-full">✓ Verified Driver</span></p>
          <h1 className="font-black text-[36px] text-black mt-3 leading-none">{trip.from_city} → {trip.to_city}</h1>
          <p className="font-bold text-[14px] text-black mt-3">{trip.date} • {trip.time} • {trip.vehicle} • Plate {trip.plate}</p>
          <p className="font-black text-[38px] text-black mt-4">MK {Number(trip.seat_price).toLocaleString()} <span className="text-[14px] font-bold text-black/50">per seat</span></p>

          <div className="mt-6 h-[340px] rounded-[20px] overflow-hidden bg-gray-100 border-2 border-black/10">
            <img src={trip.vehicle_url} className="w-full h-full object-cover"/>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-[#f6f7f9] rounded-[16px] p-4 border-2 border-black/10">
              <p className="font-bold text-[12px] text-black/50">FROM</p><p className="font-black text-[16px] text-black mt-1">{trip.from_city}</p>
            </div>
            <div className="bg-[#f6f7f9] rounded-[16px] p-4 border-2 border-black/10">
              <p className="font-bold text-[12px] text-black/50">TO</p><p className="font-black text-[16px] text-black mt-1">{trip.to_city}</p>
            </div>
          </div>

          <a href={`https://wa.me/${trip.whatsapp?.replace(/[^0-9]/g,'')}?text=Hi ${trip.driver_name}, I want your trip ${trip.from_city} to ${trip.to_city} on ${trip.date}`} target="_blank" className="mt-8 w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-5 rounded-full flex justify-center text-[18px] shadow-lg">
            WhatsApp {trip.driver_name} to Book
          </a>

          <p className="mt-4 text-center font-bold text-[12px] text-black/40">Tumani verifies driver license before listing. Pay driver directly.</p>
        </div>
      </div>
    </div>
  )
}