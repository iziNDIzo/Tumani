"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

type Trip = any

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Get driver record to find real driver.id
      const { data: driver } = await supabase
       .from('drivers')
       .select('id, user_id')
       .eq('user_id', user.id)
       .single()

      console.log("AUTH USER:", user.id, "DRIVER RECORD:", driver)

      let query = supabase.from('trips').select('*').order('created_at', { ascending: false })

      // Search for trips by BOTH possible ids
      if (driver) {
        const { data } = await supabase
         .from('trips')
         .select('*')
         .or(`driver_id.eq.${user.id},driver_id.eq.${driver.id}`)
         .order('created_at', { ascending: false })
        if (data) setTrips(data)
      } else {
        // fallback if not a driver
        const { data } = await supabase.from('trips').select('*').eq('driver_id', user.id).order('created_at', { ascending: false })
        if (data) setTrips(data)
      }
      setLoading(false)
    })()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trip?")) return
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (!error) setTrips(trips.filter(t => t.id!== id))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black">Loading...</div>

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/marketplace" className="text-blue-600 font-bold text-sm">← Marketplace</Link>
          <Link href="/drive" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold">Post New Trip</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-black text-[28px]">My Trips</h1>
        <p className="text-black/50 font-medium text-[13px] mt-1">{trips.length} trips posted</p>

        {trips.length === 0? (
          <div className="mt-12 text-center">
            <p className="font-bold text-black/40">No trips yet</p>
            <Link href="/drive" className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-full font-black">Post Your First Trip</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {trips.map((t) => (
              <div key={t.id} className="bg-white rounded-[24px] border border-black/10 p-6 flex justify-between items-center">
                <div>
                  <div className="font-black text-[18px]">{t.from_city || t.from_location} → {t.to_city || t.to_location}</div>
                  <div className="text-[13px] text-black/60 font-medium mt-1">
                    {t.date} • {t.time} • {t.seats || 4} seats • MK {t.price}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">{t.id.slice(0,8)} • driver_id: {t.driver_id?.slice(0,8)}</div>
                </div>
                <button onClick={() => handleDelete(t.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold text-[12px]">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}