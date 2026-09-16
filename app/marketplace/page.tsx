"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function MarketplacePage() {
  const [trips, setTrips] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
       .from('trips')
       .select('*')
       .eq('verified', true)
       .order('created_at', { ascending: false })
      if (data) setTrips(data)
    }
    load()
  }, [])

  const filtered = trips.filter((t: any) =>
    `${t.from_city} ${t.to_city} ${t.driver_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        <h1 className="text-[28px] md:text-[34px] font-black text-white tracking-tight leading-none">
          Find your ride across Malawi
        </h1>

        <div className="mt-6 flex">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Lilongwe, Blantyre, Mzuzu..."
            className="w-full max-w-[420px] h-[48px] bg-white border-0 rounded-full px-6 text-[14px] font-bold text-black placeholder:text-black/40 outline-none"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((t: any) => (
            <div key={t.id} className="bg-white rounded-[20px] p-5 border-0">
              <Link href={`/trip/${t.id}`} className="block">
                <p className="font-black text-[13px] text-black">
                  {t.driver_name}
                  <span className="ml-2 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                </p>
                <p className="font-black text-[22px] text-black mt-2 leading-none">
                  {t.from_city} → {t.to_city}
                </p>
                <p className="font-bold text-[12px] text-black/60 mt-2">
                  {t.date} • {t.time} • {t.vehicle || 'Hilux'} • Plate {t.plate}
                </p>
                <p className="font-black text-[24px] text-black mt-3">
                  MK {Number(t.seat_price).toLocaleString()}
                </p>

                <div className="mt-4 h-[220px] rounded-[14px] overflow-hidden bg-white border border-black/5 flex items-center justify-center">
                  {t.vehicle_url? (
                    <img src={t.vehicle_url} alt="Vehicle" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="font-black text-black/30 text-[12px]">No Photo</span>
                  )}
                </div>
              </Link>

              <a
                href={`https://wa.me/${t.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                className="mt-4 w-full bg-[#22c55e] text-white font-black py-3.5 rounded-full flex justify-center text-[14px]"
              >
                WhatsApp {t.driver_name?.split(' ')[0]}
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-20 text-center">
            <p className="font-black text-white text-[18px]">No verified trips</p>
          </div>
        )}
      </div>
    </div>
  )
}