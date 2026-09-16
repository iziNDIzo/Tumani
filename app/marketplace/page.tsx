"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function MarketplacePage() {
  const [trips, setTrips] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('trips').select('*').eq('verified', true).order('created_at', { ascending: false })
      if (data) setTrips(data)
    }
    load()
  }, [])

  const filtered = trips.filter((t: any) =>
    `${t.from_city} ${t.to_city} ${t.driver_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#f6f7f9] min-h-screen">
      <div className="max-w-[1200px] mx-auto p-5 md:p-8">
        <h1 className="text-[34px] font-black text-black tracking-tight leading-none">Find your ride across Malawi</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Lilongwe, Blantyre, Mzuzu..."
          className="mt-6 w-full max-w-[440px] h-[56px] bg-white border-2 border-black/20 rounded-full px-6 text-[16px] font-black text-black placeholder:text-black/40 outline-none focus:border-black"
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((t: any) => (
            <div key={t.id} className="bg-white rounded-[24px] border-2 border-black/15 p-5 shadow-sm">
              <p className="font-black text-[15px] text-black">{t.driver_name} <span className="ml-2 bg-green-100 text-green-700 text-[12px] font-black px-3 py-1 rounded-full border border-green-200">✓ Verified</span></p>
              <p className="font-black text-[26px] text-black mt-3 leading-none">{t.from_city} → {t.to_city}</p>
              <p className="font-bold text-[13px] text-black mt-2">{t.date} • {t.time} • {t.vehicle || 'Hilux'} • {t.plate}</p>
              <p className="font-black text-[28px] text-black mt-4">MK {Number(t.seat_price).toLocaleString()}</p>

              <div className="mt-4 h-[210px] rounded-[16px] overflow-hidden bg-gray-100 border-2 border-black/10 flex items-center justify-center">
                {t.vehicle_url? (
                  <img src={t.vehicle_url} alt="Vehicle" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-[13px] text-black/40">No Vehicle Photo</span>
                )}
              </div>

              <a href={`https://wa.me/${t.whatsapp?.replace(/[^0-9]/g,'')}`} target="_blank" className="mt-4 w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-4 rounded-full flex justify-center text-[15px]">
                WhatsApp {t.driver_name?.split(' ')[0]}
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-20 text-center bg-white border-2 border-black/10 rounded-[20px] p-10 max-w-[500px] mx-auto">
            <p className="font-black text-black text-[20px]">No verified trips yet</p>
            <p className="font-bold text-black/50 mt-2 text-[14px]">Run this in Supabase to clean fake data: delete from trips where plate in ('RU2469','RU2649'); <br/>Then post a real trip at /post with real Hilux photo</p>
          </div>
        )}
      </div>
    </div>
  )
}