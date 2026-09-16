"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function AdminPage(){
  const [trips,setTrips]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const load = async ()=>{
    setLoading(true)
    const {data} = await supabase.from('trips').select('*').order('created_at',{ascending:false})
    if(data) setTrips(data)
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const approve = async (id:string)=>{
    await supabase.from('trips').update({verified:true}).eq('id',id)
    load()
  }
  const del = async (id:string)=>{
    if(!confirm("Delete this trip?")) return
    await supabase.from('trips').delete().eq('id',id)
    load()
  }

  if(loading) return <div className="min-h-screen flex items-center justify-center font-black">Loading trips...</div>

  return(
    <div className="min-h-screen bg-[#f7f8fa] p-3 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-black">Admin - Verify Drivers</h1>
            <p className="text-[14px] font-bold text-gray-500 mt-1">{trips.length} total trips • {trips.filter((t:any)=>!t.verified).length} pending</p>
          </div>
          <button onClick={load} className="bg-white border-2 border-gray-200 px-5 py-2.5 rounded-full font-black text-[13px]">Refresh</button>
        </div>

        <div className="mt-8 space-y-6">
          {trips.length===0 && <div className="bg-white p-10 rounded-[20px] text-center font-bold text-gray-400">No trips yet. Post one from /post</div>}

          {trips.map((t:any)=>(
            <div key={t.id} className={`bg-white rounded-[24px] border-2 p-5 md:p-6 shadow-sm ${t.verified?'border-green-300':'border-amber-300'}`}>
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[21px] font-black text-black leading-tight">{t.driver_name} - {t.from_city} → {t.to_city}</p>
                  <p className="mt-1 text-[14px] font-bold text-gray-800">MK {Number(t.seat_price).toLocaleString()} • {t.vehicle || 'Hilux'} • Plate {t.plate} • {t.whatsapp}</p>
                  <p className="mt-1 text-[12px] font-medium text-gray-500">{t.date} • {t.time} • ID: {t.id.slice(0,8)}</p>

                  {t.verified? (
                    <span className="mt-3 inline-flex bg-green-100 text-green-700 border border-green-200 px-4 py-1.5 rounded-full text-[12px] font-black">✓ VERIFIED - Live in Marketplace</span>
                  ) : (
                    <span className="mt-3 inline-flex bg-amber-100 text-amber-800 border border-amber-200 px-4 py-1.5 rounded-full text-[12px] font-black">● PENDING - Not visible yet. Click Approve.</span>
                  )}
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  {!t.verified && <button onClick={()=>approve(t.id)} className="flex-1 md:flex-none bg-[#16a34a] hover:bg-[#15803d] text-white font-black px-8 py-3 rounded-full text-[15px] shadow-sm">Approve</button>}
                  <button onClick={()=>del(t.id)} className="flex-1 md:flex-none bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-black px-8 py-3 rounded-full text-[15px]">Delete</button>
                </div>
              </div>

              {/* PHOTOS - INTUITIVE */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Selfie + ID', url: t.selfie_id_url || t.selfie_url },
                  { label: 'Driver License', url: t.license_url },
                  { label: 'Vehicle Photo', url: t.vehicle_url },
                ].map((doc, i)=>(
                  <div key={i} className="rounded-[18px] overflow-hidden border border-gray-200 bg-[#fcfcfc]">
                    <div className="h-[200px] w-full bg-white flex items-center justify-center overflow-hidden">
                      {doc.url? (
                        <img src={doc.url} alt={doc.label} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-[13px] font-black text-gray-400">No photo</p>
                          <p className="text-[11px] font-bold text-gray-300 mt-1">was not uploaded</p>
                        </div>
                      )}
                    </div>
                    <div className="bg-white border-t border-gray-100 px-3 py-2.5 flex justify-between items-center">
                      <span className="text-[12px] font-black text-gray-800">{doc.label}</span>
                      {doc.url && <a href={doc.url} target="_blank" className="text-[12px] font-black text-blue-600 underline">View Full</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}