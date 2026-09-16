"use client"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100">
          🚐 Malawi's #1 Parcel & Ride Share
        </div>

        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
          Send Parcels & Share<br />
          Rides Across <span className="text-blue-600">Malawi</span>
        </h1>

        <p className="mt-4 text-[15px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Tumani connects drivers going empty with people needing to send parcels or find affordable rides. Fast, cheap, trusted.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/drive" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 shadow-md transition">
            Post a Trip & Earn
          </Link>
          <Link href="/marketplace" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black shadow-md transition">
            Find a Trip
          </Link>
        </div>

        {/* How it Works - Accent + Cool Numbers */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden group hover:shadow-lg hover:shadow-blue-100/50 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl flex items-center justify-center font-extrabold text-[16px] shadow-lg shadow-blue-200 ring-4 ring-blue-50">1</div>
            <h3 className="font-extrabold mt-4 text-gray-900 text-[16px]">Post Your Route</h3>
            <p className="text-[13.5px] text-gray-600 mt-2 leading-relaxed">Driver shares where he&apos;s going, seats & parcel space available.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden group hover:shadow-lg hover:shadow-violet-100/50 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-400"></div>
            <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white rounded-xl flex items-center justify-center font-extrabold text-[16px] shadow-lg shadow-violet-200 ring-4 ring-violet-50">2</div>
            <h3 className="font-extrabold mt-4 text-gray-900 text-[16px]">Connect on WhatsApp</h3>
            <p className="text-[13.5px] text-gray-600 mt-2 leading-relaxed">Users find your trip and book directly via WhatsApp. No middleman.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-100/50 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-amber-400"></div>
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-amber-400 text-white rounded-xl flex items-center justify-center font-extrabold text-[16px] shadow-lg shadow-emerald-200 ring-4 ring-emerald-50">3</div>
            <h3 className="font-extrabold mt-4 text-gray-900 text-[16px]">Earn on Every Trip</h3>
            <p className="text-[13.5px] text-gray-600 mt-2 leading-relaxed">Fill empty seats, deliver parcels, make extra MK 40k-100k per trip.</p>
          </div>
          <p className="mt-4 text-xs text-gray-400">Driver? <button onClick={()=>{localStorage.setItem("tumani_is_driver","true"); window.location.href="/drive"}} className="text-blue-600 font-bold underline">Click here to sign in as driver</button></p>
        </div>
      </div>
    </div>
  )
}