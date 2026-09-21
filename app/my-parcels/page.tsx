"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function MyParcels(){
  const [parcels,setParcels]=useState<any[]>([])
  const [phone,setPhone]=useState("")

  useEffect(()=>{
    const p = new URLSearchParams(window.location.search).get("phone") || localStorage.getItem("tumani_last_phone") || ""
    setPhone(p)
    if(p){
      supabase.from('parcels').select('*').or(`sender_phone.eq.${p},recipient_phone.eq.${p}`).order('created_at',{ascending:false}).then(({data})=>setParcels(data||[]))
    }
  },[])
const getStatusStyle = (s: string) => {
  if (s === 'claimed') return { card: 'bg-green-50 border-green-400', badge: 'bg-green-600 text-white' }
  if (s === 'cancelled') return { card: 'bg-gray-50 border-gray-300 border-dashed opacity-70', badge: 'bg-gray-200 text-gray-500' }
  if (s === 'delivered') return { card: 'bg-emerald-50 border-emerald-400', badge: 'bg-emerald-700 text-white' }
  // pending = default yellowish
  return { card: 'bg-amber-50 border-amber-300', badge: 'bg-amber-400 text-black' }
}
  return(
    <div className="max-w-[600px] mx-auto p-4">
      <a href="/" className="text-[13px] font-black opacity-60">← Home</a>
      <h1 className="text-[24px] font-black mt-3">My Parcels 📦</h1>
      <p className="text-[13px] text-gray-500">Tracking for {phone}</p>

      <div className="mt-4 space-y-3">
        {parcels.length===0 && <div className="bg-white p-6 rounded-[20px] border text-center text-[14px]">No parcels found for {phone}</div>}
        {parcels.map(p=>(
    <div key={p.id} className={`${getStatusStyle(p.status).card} p-4 rounded-[20px] border`}>
  <div className="flex justify-between items-center"><span className="font-black text-[14px]">{p.tracking_id}</span><span className={`${getStatusStyle(p.status).badge} px-3 py-1 rounded-full text-[11px] font-black`}>{p.status}</span></div>
  <div className="mt-2 text-[13px]">{p.from_city || p.from_district} → {p.to_city || p.to_district}</div>
  <div className="text-[12px] text-gray-500">Receiver: {p.recipient_name} {p.recipient_phone}</div>
  <div className="text-[12px] font-bold mt-1">MK {p.price || p.fee}</div>
</div>
        ))}
      </div>
      <a href="/send-parcels" className="mt-6 block w-full h-[50px] bg-[#0a84ff] text-white rounded-full flex items-center justify-center font-black">Send Another Parcel</a>
    </div>
  )
}