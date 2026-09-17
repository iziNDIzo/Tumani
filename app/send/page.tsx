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

    if (jobType === 'taxi' &&!form.pickup_address) {
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
      status: 'ready_for_pickup',
      sender_phone: form.recipient_phone
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
      <div className="bg-white min-h-screen p-6 flex items-center justify-center">
        <div className="bg-white border border-black/10 rounded-[24px] p-8 max-w-md w-full text-center shadow-[0_8px_40px_rgba(124,58,237,0.08)]">
          <div className="w-16 h-16 bg-[#ede9fe] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#7c3aed]"/>
          </div>
          <h2 className="text-[24px] font-black text-black">Job Posted!</h2>
          <p className="text-black/60 font-medium mt-1 text-[14px]">Drivers nearby will see it now</p>
          <div className="bg-[#f8f7ff] border border-[#7c3aed]/10 p-4 rounded-[16px] mt-5">
            <p className="text-[11px] font-bold tracking-widest text-black/40 uppercase">Tracking ID</p>
            <p className="font-mono text-[18px] font-black text-[#7c3aed] mt-1">{success.tracking_id}</p>
          </div>
          <p className="text-[12px] text-black/40 mt-4 font-medium">Share to track: tumani.com/track?id={success.tracking_id}</p>
          <button onClick={() => { setSuccess(null); setForm({ recipient_name:'', recipient_phone:'', pickup_address:'', delivery_address:'', description:'', fee:''}) }} className="bg-black hover:bg-[#7c3aed] text-white w-full mt-6 py-3.5 rounded-[12px] font-black text-[14px] transition-colors">Post Another Job</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen text-black p-4 md:p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-[32px] font-black tracking-tight text-black">Send Anything</h1>
        <p className="text-black/60 font-medium mt-1 text-[14px]">Parcels, Errands, or Taxi - Tumani handles it</p>

        {/* TYPE SELECTOR - WHITE + BLUE/PURPLE */}
        <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
          <button onClick={() => setJobType('parcel')} className={`p-4 rounded-[16px] border-2 flex flex-col items-center gap-1 transition-all ${jobType==='parcel'? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] shadow-[0_4px_16px_rgba(26,115,232,0.12)]':'bg-white border-black/10 text-black/60 hover:border-black/20'}`}>
            <Package className="w-6 h-6"/> <span className="font-black text-[13px]">Parcel</span>
          </button>
          <button onClick={() => setJobType('errand')} className={`p-4 rounded-[16px] border-2 flex flex-col items-center gap-1 transition-all ${jobType==='errand'? 'bg-[#f5f3ff] border-[#7c3aed] text-[#7c3aed] shadow-[0_4px_16px_rgba(124,58,237,0.12)]':'bg-white border-black/10 text-black/60 hover:border-black/20'}`}>
            <ShoppingCart className="w-6 h-6"/> <span className="font-black text-[13px]">Errand</span>
          </button>
          <button onClick={() => setJobType('taxi')} className={`p-4 rounded-[16px] border-2 flex flex-col items-center gap-1 transition-all ${jobType==='taxi'? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] shadow-[0_4px_16px_rgba(26,115,232,0.12)]':'bg-white border-black/10 text-black/60 hover:border-black/20'}`}>
            <Car className="w-6 h-6"/> <span className="font-black text-[13px]">Taxi</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-black/10 rounded-[20px] p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">

          <div>
            <label className="text-[11px] font-black tracking-widest uppercase text-black/40">{jobType==='taxi'? 'Passenger Name' : jobType==='errand'? 'Request For' : 'Recipient Name'}</label>
            <input value={form.recipient_name} onChange={e=>setForm({...form, recipient_name:e.target.value})} required placeholder={jobType==='taxi'? 'John going to airport' : 'Who receives it?'} className="w-full mt-2 bg-[#f8f7ff] border border-black/10 rounded-[12px] p-3.5 font-semibold text-[14px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:border-[#7c3aed]/30 focus:ring-2 focus:ring-[#7c3aed]/15 transition-all"/>
          </div>

          <div>
            <label className="text-[11px] font-black tracking-widest uppercase text-black/40 flex items-center"><Phone className="w-3 h-3 mr-1"/> Phone</label>
            <input value={form.recipient_phone} onChange={e=>setForm({...form, recipient_phone:e.target.value})} required placeholder="265..." className="w-full mt-2 bg-[#f8f7ff] border border-black/10 rounded-[12px] p-3.5 font-semibold text-[14px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:border-[#7c3aed]/30 focus:ring-2 focus:ring-[#7c3aed]/15 transition-all"/>
          </div>

          <div>
            <label className="text-[11px] font-black tracking-widest uppercase text-black/40 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {jobType==='parcel'? 'Pickup Address (Optional)' : 'Pickup Location'}</label>
            <input value={form.pickup_address} onChange={e=>setForm({...form, pickup_address:e.target.value})} required={jobType!=='parcel'} placeholder={jobType==='taxi'? 'Area 47 Sector 3' : 'Where to buy/collect?'} className="w-full mt-2 bg-[#f8f7ff] border border-black/10 rounded-[12px] p-3.5 font-semibold text-[14px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:border-[#7c3aed]/30 focus:ring-2 focus:ring-[#7c3aed]/15 transition-all"/>
          </div>

          <div>
            <label className="text-[11px] font-black tracking-widest uppercase text-black/40 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {jobType==='taxi'? 'Dropoff Location' : 'Delivery Address'}</label>
            <input value={form.delivery_address} onChange={e=>setForm({...form, delivery_address:e.target.value})} required placeholder={jobType==='taxi'? 'Kamuzu Airport' : 'Where to deliver?'} className="w-full mt-2 bg-[#f8f7ff] border border-black/10 rounded-[12px] p-3.5 font-semibold text-[14px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:border-[#7c3aed]/30 focus:ring-2 focus:ring-[#7c3aed]/15 transition-all"/>
          </div>

          <div>
            <label className="text-[11px] font-black tracking-widest uppercase text-black/40">{jobType==='errand'? 'Errand Details' : jobType==='taxi'? 'Notes (Passengers, Luggage)' : 'What is it? (Description)'}</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder={jobType==='errand'? 'Buy 5kg sugar, bread from Shoprite...' : jobType==='taxi'? '2 passengers, 1 suitcase' : 'Documents, Shoes...'} className="w-full mt-2 bg-[#f8f7ff] border border-black/10 rounded-[12px] p-3.5 h-20 font-semibold text-[14px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:border-[#7c3aed]/30 focus:ring-2 focus:ring-[#7c3aed]/15 transition-all"/>
          </div>

          <div>
            <label className="text-[11px] font-black tracking-widest uppercase text-black/40 flex items-center"><DollarSign className="w-3 h-3 mr-1"/> Fee You Pay (MK)</label>
            <input type="number" value={form.fee} onChange={e=>setForm({...form, fee:e.target.value})} required placeholder="5000" className="w-full mt-2 bg-[#f8f7ff] border border-black/10 rounded-[12px] p-3.5 font-black text-[16px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:border-[#1a73e8]/30 focus:ring-2 focus:ring-[#1a73e8]/15 transition-all"/>
          </div>

          <button disabled={loading} className="bg-[#1a73e8] hover:bg-black w-full py-4 rounded-[12px] font-black text-[15px] text-white mt-2 disabled:opacity-50 transition-colors shadow-[0_4px_16px_rgba(26,115,232,0.24)]">
            {loading? 'Posting...' : `Post ${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Job - MK ${form.fee || '0'}`}
          </button>
        </form>

        <p className="text-center text-[11px] font-bold text-black/30 mt-5 tracking-wide">Job will appear instantly on driver app • <span className="text-[#7c3aed]">Powered by Tumani</span></p>
      </div>
    </div>
  )
}