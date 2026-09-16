"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function AdminPage(){
  const [trips,setTrips]=useState<any[]>([])

  const load = async ()=>{
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const {data} = await supabase.from('trips').select('*').order('created_at',{ascending:false})
    if(data) setTrips(data)
  }
  useEffect(()=>{ load() },[])

  const approve = async (id:string)=>{
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.from('trips').update({verified:true}).eq('id',id)
    load()
  }
  const del = async (id:string)=>{
    if(!confirm("Delete this trip?")) return
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.from('trips').delete().eq('id',id)
    load()
  }

  return(
    <div className="min-h-screen bg-[#f6f7f9] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[28px] font-black text-gray-900">Admin - Verify Drivers</h1>
        <p className="text-[14px] text-gray-500 font-medium mt-1">{trips.length} total trips from Supabase</p>

        <div className="mt-6 space-y-4">
          {trips.map((t)=>(
            <div key={t.id} className={`bg-white border-2 rounded-[20px] p-5 shadow-sm ${t.verified? 'border-green-200' : 'border-orange-200'}`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-[18px] font-black text-gray-900">{t.driver_name} - {t.from_city} → {t.to_city}</p>
                  <p className="text-[14px] font-bold text-gray-700 mt-1">MK {t.seat_price} • {t.plate} • {t.whatsapp}</p>
                  {t.verified?
                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[12px] font-black">✓ VERIFIED - Shows in Marketplace</span> :
                    <span className="inline-block mt-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[12px] font-black">● PENDING - Not visible yet</span>
                  }
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {!t.verified && <button onClick={()=>approve(t.id)} className="bg-[#16a34a] hover:bg-[#15803d] text-white font-black px-6 py-2.5 rounded-full text-[14px]">Approve</button>}
                  <button onClick={()=>del(t.id)} className="bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-black px-6 py-2.5 rounded-full text-[14px]">Delete</button>
                </div>
              </div>

              {/* PHOTO PREVIEWS - THIS WAS INVISIBLE BEFORE */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <a href={t.selfie_url} target="_blank" className="block">
                  <div className="bg-gray-100 rounded-xl h-[100px] overflow-hidden border border-gray-200">
                    {t.selfie_url? <img src={t.selfie_url} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-[11px] font-bold text-gray-400">No Selfie</div>}
                  </div>
                  <p className="text-[11px] font-black text-center mt-1 text-gray-700">Selfie + ID</p>
                </a>
                <a href={t.license_url} target="_blank" className="block">
                  <div className="bg-gray-100 rounded-xl h-[100px] overflow-hidden border border-gray-200">
                    {t.license_url? <img src={t.license_url} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-[11px] font-bold text-gray-400">No License</div>}
                  </div>
                  <p className="text-[11px] font-black text-center mt-1 text-gray-700">License</p>
                </a>
                <a href={t.vehicle_url} target="_blank" className="block">
                  <div className="bg-gray-100 rounded-xl h-[100px] overflow-hidden border border-gray-200">
                    {t.vehicle_url? <img src={t.vehicle_url} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-[11px] font-bold text-gray-400">No Vehicle</div>}
                  </div>
                  <p className="text-[11px] font-black text-center mt-1 text-gray-700">Vehicle</p>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}