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

  return(
    <div className="max-w-[600px] mx-auto p-4">
      <a href="/" className="text-[13px] font-black opacity-60">← Home</a>
      <h1 className="text-[24px] font-black mt-3">My Parcels 📦</h1>
      <p className="text-[13px] text-gray-500">Tracking for {phone}</p>

      <div className="mt-4 space-y-3">
        {parcels.length===0 && <div className="bg-white p-6 rounded-[20px] border text-center text-[14px]">No parcels found for {phone}</div>}
        {parcels.map(p=>(
          <div key={p.id} className="bg-white p-4 rounded-[20px] border">
            <div className="flex justify-between"><span className="font-black text-[14px]">{p.tracking_id}</span><span className="bg-[#0a84ff] text-white px-3 py-1 rounded-full text-[11px] font-bold">{p.status}</span></div>
            <div className="mt-2 text-[13px]">{p.from_city || p.from_district} → {p.to_city || p.to_district}</div>
            <div className="text-[12px] text-gray-500">Receiver: {p.recipient_name} {p.recipient_phone}</div>
            <div className="text-[12px] font-bold mt-1">MK {p.price || p.fee}</div>
          </div>
        ))}
      </div>
      <a href="/send-parcel" className="mt-6 block w-full h-[50px] bg-[#0a84ff] text-white rounded-full flex items-center justify-center font-black">Send Another Parcel</a>
    </div>
  )
}