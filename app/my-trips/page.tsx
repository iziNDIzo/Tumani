"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

type Trip = any

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    setTrips(JSON.parse(localStorage.getItem("tumani_trips") || "[]"))
  }, [])

  const handleDelete = (id: number) => {
    const updated = trips.filter(t => t.id!== id)
    localStorage.setItem("tumani_trips", JSON.stringify(updated))
    setTrips(updated)
    if (updated.length === 0) {
      localStorage.removeItem("tumani_is_driver")
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/marketplace" className="text-blue-600 font-bold text-sm">← Marketplace</Link>
          <Link href="/drive" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold">Post New Trip</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My Trips</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">{trips.length} trip(s) posted by you</p>

        <div className="mt-6 space-y-4">
          {trips.length === 0? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <p className="font-bold text-gray-900">No trips yet</p>
              <p className="text-sm text-gray-500 mt-1">Post your first trip to start earning</p>
              <Link href="/drive" className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold">Post a Trip</Link>
            </div>
          ) : (
            trips.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-gray-900 text-[16px] capitalize">{t.from} → {t.to}</p>
                  <p className="text-[13px] text-gray-600 mt-1 font-medium">
                    {t.date} at {t.time} • {t.seats} seats • MK {t.seatPrice}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">ID: {String(t.id).slice(0,8)}...</p>
                </div>
                <button onClick={() => handleDelete(t.id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 px-5 py-2.5 rounded-full text-sm font-bold transition">
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}