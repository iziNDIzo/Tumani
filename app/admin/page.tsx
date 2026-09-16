"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function AdminPage(){
  const [trips,setTrips]=useState<any[]>([])
  const load = async ()=>{
    const {data}=await supabase.from('trips').select('*').order('created_at',{ascending:false})
    if(data) setTrips(data)
  }
  useEffect(()=>{load()},[])

  const approve = async (id:number)=>{
    await supabase.from('trips').update({verified:true}).eq('id',id)
    load()
  }
  const reject = async (id:number)=>{
    await supabase.from('trips').delete().eq('id',id)
    load()
  }

  return(
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900">Admin - Verify Drivers</h1>
        <p className="text-sm text-gray-500 mt-1">{trips.length} total trips from Supabase</p>
        <div className="mt-6 grid gap-4">
          {trips.map(t=>(
            <div key={t.id} className="bg-white border rounded-2xl p-5 flex gap-4">
              <div className="flex-1">
                <p className="font-bold text-gray-900">{t.driver_name} - {t.from_city} → {t.to_city}</p>
                <p className="text-sm text-gray-600">MK {t.seat_price} • {t.plate} • {t.whatsapp}</p>
                <p className="text-xs mt-1"><span className={t.verified ? "text-green-600 font-bold" : "text-orange-600 font-bold"}>{t.verified ? "✓ VERIFIED" : "PENDING"}</span></p>
                <div className="flex gap-2 mt-3">
                  <a href={t.selfie_id_url} target="_blank" className="text-xs bg-gray-100 px-3 py-1 rounded-full">Selfie+ID</a>
                  <a href={t.license_url} target="_blank" className="text-xs bg-gray-100 px-3 py-1 rounded-full">License</a>
                  <a href={t.vehicle_url} target="_blank" className="text-xs bg-gray-100 px-3 py-1 rounded-full">Vehicle</a>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {!t.verified && <button onClick={()=>approve(t.id)} className="bg-green-600 text-white px-5 py-2 rounded-full font-bold text-sm">Approve</button>}
                <button onClick={()=>reject(t.id)} className="bg-white border border-gray-300 px-5 py-2 rounded-full font-bold text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}