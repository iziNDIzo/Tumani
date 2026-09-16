"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Package, Car, ShoppingCart, MapPin, Phone, DollarSign, CheckCircle } from "lucide-react"

type JobType = 'parcel' | 'errand' | 'taxi'

export default function SendPage() {
  const [jobType, setJobType] = useState<JobType>('parcel')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{id: string, tracking_id: string} | null>(null)
  
  const [form, setForm] = useState({
    recipient_name: '',
    recipient_phone: '',
    pickup_address: '',
    delivery_address: '',
    description: '',
    fee: ''
  })

  const generateTrackingId = () => {
    return `TUM-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-3)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const tracking_id = generateTrackingId()

    // Validation based on type
    if (jobType === 'taxi' && !form.pickup_address) {
      alert("Enter pickup location for taxi")
      setLoading(false)
      return
    }

    const payload: any = {
      tracking_id,
      job_type: jobType,
      recipient_name: form.recipient_name,
      recipient_phone: form.recipient_phone,
      delivery_address: form.delivery_address,
      pickup_address: form.pickup_address || null,
      description: form.description || null,
      fee: parseInt(form.fee),
      status: 'ready_for_pickup', // goes straight to driver dashboard
      sender_phone: form.recipient_phone // temp, until auth for senders
    }

    const { data, error } = await supabase.from("parcels").insert(payload).select().single()

    setLoading(false)

    if (error) {
      alert("Error: " + error.message)
      return
    }

    setSuccess({ id: data.id, tracking_id: data.tracking_id })
  }

  if (success) {
    return (
      <div className="bg-[#0B1120] min-h-screen text-white p-6 flex items-center justify-center">
        <div className="bg-[#1E293B] rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
          <h2 className="text-2xl font-bold">Job Posted!</h2>
          <p className="text-gray-400 mt-2">Drivers nearby will see it now</p>
          <div className="bg-[#111827] p-4 rounded-lg mt-4">
            <p className="text-sm text-gray-400">Tracking ID</p>
            <p className="font-mono text-lg font-bold text-green-400">{success.tracking_id}</p>
          </div>
          <p className="text-sm text-gray-400 mt-4">Share this with customer to track: tumani.com/track?id={success.tracking_id}</p>
          <button onClick={() => { setSuccess(null); setForm({ recipient_name:'', recipient_phone:'', pickup_address:'', delivery_address:'', description:'', fee:''}) }} className="bg-[#16A34A] w-full mt-6 py-3 rounded-lg font-bold">Post Another Job</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0B1120] min-h-screen text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Send Anything</h1>
        <p className="text-gray-400 mb-6">Parcels, Errands, or Taxi - Tumani handles it</p>

        {/* TYPE SELECTOR */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button onClick={() => setJobType('parcel')} className={`p-4 rounded-xl border flex flex-col items-center ${jobType==='parcel'? 'bg-[#16A34A]/20 border-[#16A34A] text-[#16A34A]':'bg-[#1E293B] border-gray-700'}`}>
            <Package className="w-6 h-6 mb-1"/> <span className="font-bold text-sm">Parcel</span>
          </button>
          <button onClick={() => setJobType('errand')} className={`p-4 rounded-xl border flex flex-col items-center ${jobType==='errand'? 'bg-[#16A34A]/20 border-[#16A34A] text-[#16A34A]':'bg-[#1E293B] border-gray-700'}`}>
            <ShoppingCart className="w-6 h-6 mb-1"/> <span className="font-bold text-sm">Errand</span>
          </button>
          <button onClick={() => setJobType('taxi')} className={`p-4 rounded-xl border flex flex-col items-center ${jobType==='taxi'? 'bg-[#16A34A]/20 border-[#16A34A] text-[#16A34A]':'bg-[#1E293B] border-gray-700'}`}>
            <Car className="w-6 h-6 mb-1"/> <span className="font-bold text-sm">Taxi</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1E293B] rounded-xl p-6 space-y-4">
          
          {/* DYNAMIC LABELS */}
          <div>
            <label className="text-sm text-gray-400">{jobType==='taxi' ? 'Passenger Name' : jobType==='errand' ? 'Request For' : 'Recipient Name'}</label>
            <input value={form.recipient_name} onChange={e=>setForm({...form, recipient_name:e.target.value})} required placeholder={jobType==='taxi'? 'John going to airport' : 'Who receives it?'} className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-lg p-3"/>
          </div>

          <div>
            <label className="text-sm text-gray-400 flex items-center"><Phone className="w-3 h-3 mr-1"/> Phone</label>
            <input value={form.recipient_phone} onChange={e=>setForm({...form, recipient_phone:e.target.value})} required placeholder="265..." className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-lg p-3"/>
          </div>

          <div>
            <label className="text-sm text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {jobType==='parcel' ? 'Pickup Address (Optional)' : 'Pickup Location'}</label>
            <input value={form.pickup_address} onChange={e=>setForm({...form, pickup_address:e.target.value})} required={jobType!=='parcel'} placeholder={jobType==='taxi'? 'Area 47 Sector 3' : 'Where to buy/collect?'} className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-lg p-3"/>
          </div>

          <div>
            <label className="text-sm text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {jobType==='taxi' ? 'Dropoff Location' : 'Delivery Address'}</label>
            <input value={form.delivery_address} onChange={e=>setForm({...form, delivery_address:e.target.value})} required placeholder={jobType==='taxi'? 'Kamuzu Airport' : 'Where to deliver?'} className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-lg p-3"/>
          </div>

          <div>
            <label className="text-sm text-gray-400">{jobType==='errand' ? 'Errand Details' : jobType==='taxi' ? 'Notes (Passengers, Luggage)' : 'What is it? (Description)'}</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder={jobType==='errand'? 'Buy 5kg sugar, bread from Shoprite...' : jobType==='taxi'? '2 passengers, 1 suitcase' : 'Documents, Shoes...'} className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-lg p-3 h-20"/>
          </div>

          <div>
            <label className="text-sm text-gray-400 flex items-center"><DollarSign className="w-3 h-3 mr-1"/> Fee You Pay (MK)</label>
            <input type="number" value={form.fee} onChange={e=>setForm({...form, fee:e.target.value})} required placeholder="5000" className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-lg p-3"/>
          </div>

          <button disabled={loading} className="bg-[#16A34A] hover:bg-green-600 w-full py-3 rounded-lg font-bold text-lg mt-2 disabled:opacity-50">
            {loading ? 'Posting...' : `Post ${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Job - MK ${form.fee || '0'}`}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">Job will appear instantly on driver app</p>
      </div>
    </div>
  )
}