"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Search } from "lucide-react"

type Parcel = {
  id: string
  tracking_id: string
  recipient_name: string
  delivery_address: string
  fee: number
  status: string
  driver_id: string | null
  created_at: string
}

// MAP DB STATUS TO UI STEPS
const normalizeStatus = (status: string): string => {
  const s = status.toLowerCase()
  if (s === 'ready_for_pickup' || s === 'pending') return 'pending'
  if (s === 'accepted') return 'accepted'
  if (s === 'in_transit') return 'in_transit'
  if (s === 'delivered') return 'delivered'
  return 'pending'
}

export default function TrackPage() {
  const [parcelId, setParcelId] = useState("")
  const [parcel, setParcel] = useState<Parcel | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!parcelId) return
    setLoading(true)
    setParcel(null)
    
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .ilike("tracking_id", `%${parcelId}%`)
      .single()
    
    setLoading(false)
    if (error) alert("Parcel not found. Check your Tracking ID")
    else setParcel(data)
  }

  return (
    <div className="bg-[#0B1120] min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl text-gray-400 mb-4">Enter your Tracking ID to see live status</h1>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="text"
            value={parcelId}
            onChange={e => setParcelId(e.target.value)}
            placeholder="TUM-XXXXXXX"
            className="w-full p-3 rounded-lg bg-[#1E293B] border border-gray-700 focus:border-[#2563EB] outline-none"
          />
          <button 
            onClick={handleTrack}
            disabled={loading}
            className="bg-[#2563EB] px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <Search size={18}/> {loading ? "Tracking..." : "Track"}
          </button>
        </div>

        {parcel && (
          <div className="bg-[#1E293B] p-6 rounded-xl border-gray-800">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm">Tracking ID</p>
                <p className="font-bold text-lg">{parcel.tracking_id}</p> 
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">To</p>
                <p className="font-bold">{parcel.recipient_name}</p>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <div>
                <p className="text-gray-400 text-sm">Delivery Address</p>
                <p className="font-bold">{parcel.delivery_address}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Fee</p>
                <p className="font-bold text-[#16A34A]">MK {parcel.fee.toLocaleString()}</p>
              </div>
            </div>

            {/* Status Progress Bar - FIXED */}
            {(() => {
              const statusSteps = ["pending", "accepted", "in_transit", "delivered"]
              const currentStatus = normalizeStatus(parcel.status)
              const currentStep = statusSteps.indexOf(currentStatus)
              
              const steps = [
                {label: "Pending", icon: "🕒"},
                {label: "Accepted", icon: "📦"},
                {label: "In Transit", icon: "🚚"},
                {label: "Delivered", icon: "✅"}
              ]

              return (
                <div className="flex justify-between items-center">
                  {steps.map((step, i) => {
                    const isActive = i <= currentStep
                    return (
                      <div key={step.label} className="text-center flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                          isActive ? 'bg-[#16A34A] scale-110' : 'bg-gray-600'
                        }`}>
                          <span className="text-xl">{step.icon}</span>
                        </div>
                        <p className={`text-sm ${isActive ? 'font-bold text-white' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}