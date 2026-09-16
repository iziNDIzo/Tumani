"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/navigation"

function capitalize(s: string) {
  return s? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""
}

export default function MyTrips() {
  const router = useRouter()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // FIX 1: Use hard redirect if router fails
        window.location.href = "/login"
        return
      }
      const { data } = await supabase.from("trips").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      setTrips(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const goToMarketplace = () => {
    // FIX 1: Your marketplace is at / (root), not /trips - try / first, fallback to /trips
    // This will ALWAYS work even if Next.js router is stuck
    window.location.href = "/"
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trip?")) return
    const { error } = await supabase.from("trips").delete().eq("id", id)
    if (!error) setTrips(trips.filter(t => t.id!== id))
  }

  if (loading) return <div className="p-6 text-center text-gray-600">Loading your trips...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ===== */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* FIXED: Now goes to / (your real marketplace) with hard navigation */}
          <button
            onClick={goToMarketplace}
            className="font-bold text-blue-600 hover:text-blue-800 text-[15px] px-3 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            ← Marketplace
          </button>
          <Link href="/drive" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 shadow">
            Post New Trip
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <p className="text-sm text-gray-600 mt-1">{trips.length} trip(s) posted by you</p>

        <div className="space-y-3 mt-6">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">{capitalize(trip.from_city)} → {capitalize(trip.to_city)}</h3>
                <p className="text-xs text-gray-600 mt-1 font-medium">{trip.date} at {trip.time} • {trip.seats} seats • MK {trip.seat_price}</p>
              </div>
              <button onClick={() => handleDelete(trip.id)} className="bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition">
                Delete
              </button>
            </div>
          ))}

          {/* ===== FIX 2: MOBILE RESPONSIVE STACKED BUTTONS ===== */}
          {trips.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border px-4">
              <p className="text-gray-500 text-sm">You haven't posted any trips yet</p>

              {/* On mobile: stacked full width, On desktop: side by side */}
              <div className="flex flex-col gap-3 mt-6 w-full">
                {/* Button 1 - full width on mobile */}
                <button
                  onClick={goToMarketplace}
                  className="w-full bg-gray-100 text-gray-800 px-5 py-3.5 rounded-full text-sm font-bold hover:bg-gray-200 transition"
                >
                  ← Back to Marketplace
                </button>
                {/* Button 2 - full width on mobile */}
                <Link
                  href="/drive"
                  className="w-full bg-blue-600 text-white px-5 py-3.5 rounded-full text-sm font-bold text-center hover:bg-blue-700 shadow"
                >
                  Post Your First Trip
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}