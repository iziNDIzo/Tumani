"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Marketplace() {
  const [trips, setTrips] = useState<any[]>([])
  const [filter, setFilter] = useState("")
  useEffect(() => {
    const fetchTrips = async () => {
      const { data } = await supabase.from('trips').select('*').order('created_at', {ascending:false})
      if (data) setTrips(data)
    }
    fetchTrips()
  }, [])

  const verifiedOnly = trips.filter((t: any) => t.verified === true)
  const filtered = verifiedOnly.filter((t: any) => t.from_city?.toLowerCase().includes(filter.toLowerCase()) || t.to_city?.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold">Find your ride across Malawi</h1>
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search Lilongwe, Blantyre..." className="mt-4 w-full max-w-sm border rounded-full px-5 py-3 text-sm bg-white"/>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t:any)=>(
            <div key={t.id} className="bg-white rounded-2xl border p-5">
              <p className="font-bold">{t.driver_name} ✓ Verified</p>
              <p className="font-extrabold text-lg mt-2">{t.from_city} → {t.to_city}</p>
              <p className="text-sm text-gray-500">{t.date} • {t.time} • {t.vehicle} • Plate {t.plate}</p>
              <p className="font-bold mt-3">MK {t.seat_price}</p>
              {t.vehicle_url && <img src={t.vehicle_url} className="mt-3 w-full h-32 object-cover rounded-xl"/>}
              <a href={`https://wa.me/${t.whatsapp}?text=Hi ${t.driver_name}, Tumani trip ${t.from_city} to ${t.to_city}`} target="_blank" className="mt-4 block text-center w-full font-bold py-3 rounded-full bg-[#22c55e] text-white">WhatsApp {t.driver_name?.split(" ")[0]}</a>
            </div>
          ))}
        </div>
        {filtered.length===0 && <p className="mt-10 text-center text-gray-500">No verified trips yet. Go to /admin to approve.</p>}
      </div>
    </div>
  )
}