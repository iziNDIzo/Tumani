"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Marketplace() {
  const [trips, setTrips] = useState<any[]>([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tumani_trips") || "[]")
    setTrips(data)
  }, [])

  const verifiedOnly = trips.filter((t: any) => t.verified === true)

  const filtered = verifiedOnly.filter((t: any) =>
    t.from?.toLowerCase().includes(filter.toLowerCase()) ||
    t.to?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <h1 className="text-[24px] md:text-[28px] font-extrabold text-gray-900 leading-tight break-words">
          Find your ride across Malawi
        </h1>
        <p className="text-sm text-gray-500 mt-1">Only verified drivers. Parcels guaranteed.</p>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search Lilongwe, Blantyre..."
          className="mt-4 w-full max-w-full md:max-w-sm border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-900 bg-white outline-none focus:border-blue-300"
        />

        {filtered.length === 0? (
          <div className="mt-10 bg-white p-8 rounded-2xl border border-gray-100 text-center max-w-xl">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">🔒</div>
            <p className="font-bold text-gray-900">No verified trips yet</p>
            <p className="text-sm text-gray-500 mt-1">
              {trips.length > 0
              ? `You have ${trips.length} trip(s) pending verification. Go to /admin to approve.`
                : "All trips must be verified with ID & license. Be the first to post a verified trip."}
            </p>
            <div className="flex gap-2 justify-center mt-5 flex-wrap">
              <Link href="/admin" className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-bold">
                Go to Admin
              </Link>
              <Link href="/drive" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold">
                Post Trip
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((t: any, i: number) => (
              <div key={t.id || i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full flex flex-col hover:shadow-md transition-shadow">
                <div className="h-1.5 w-full bg-green-500"></div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3 items-start min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {t.driverName?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-gray-900 text-[14px] capitalize truncate">{t.driverName}</p>
                          <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] shrink-0">✓</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full capitalize shrink-0 whitespace-nowrap">
                      {t.vehicle} • {t.seats} SE
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-gray-600 font-medium">
                      Plate: {t.plate?.toUpperCase() || "BQ ••••"}
                    </span>
                    <span className="text-[10px] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-gray-600 font-medium">
                      ★ {t.rating || 5} • {t.tripsCount || 1} trips
                    </span>
                    <span className="text-[10px] bg-green-50 border border-green-100 px-2.5 py-1 rounded-full text-green-700 font-bold">
                      🛡️ Parcel insured MK 100k
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-3 text-right truncate">{t.date} • {t.time}</p>

                  <div className="mt-2 flex gap-4 flex-1">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="w-px h-10 bg-gray-200 my-1"></div>
                      <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-400 font-bold">FROM</p>
                      <p className="font-extrabold text-gray-900 text-lg capitalize leading-tight break-words">{t.from}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-3">TO</p>
                      <p className="font-extrabold text-gray-900 text-lg capitalize leading-tight break-words">{t.to}</p>
                    </div>
                    {t.vehiclePhoto && (
                      <img src={t.vehiclePhoto} className="ml-auto w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl border border-gray-100 shrink-0" alt="car" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-gray-50 p-3 rounded-xl min-w-0">
                      <p className="text-[10px] text-gray-400 font-bold">SEAT PRICE</p>
                      <p className="font-bold text-gray-900 text-sm truncate">MK {t.seatPrice}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl min-w-0">
                      <p className="text-[10px] text-gray-400 font-bold">PARCEL</p>
                      <p className="font-bold text-gray-900 text-sm truncate">MK {t.parcelPrice}</p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${t.whatsapp}?text=Hi ${t.driverName}, I saw your VERIFIED trip ${t.from} to ${t.to} on Tumani. Plate ${t.plate?.toUpperCase()}. Is seat still available?`}
                    target="_blank"
                    className="mt-4 block text-center w-full font-bold py-3 rounded-full text-sm bg-[#22c55e] text-white hover:bg-[#16a34a] transition-colors"
                  >
                    WhatsApp {t.driverName?.split(" ")[0]}
                  </a>
                  <p className="text-[10px] text-gray-400 text-center mt-2">📄 ID & License checked by Tumani</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}