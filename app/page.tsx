"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Home(){
  const [trips,setTrips]=useState<any[]>([])
  useEffect(()=>{ supabase.from('trips').select('*').eq('status','active').then(r=>{ if(r.data) setTrips(r.data) }) },[])

  return (
    <div className="min-h-screen bg-white p-5">
      <div className="max-w-[600px] mx-auto">
        <h1 className="text-[32px] font-black">tumani — {trips.length} LIVE trips</h1>
        <div className="mt-6 space-y-3">
          {trips.map(t=>(
            <div key={t.id} className="border-2 border-black rounded-[20px] p-4">
              <div className="font-black text-[18px]">{t.from_city} → {t.to_city}</div>
              <div className="text-[14px] mt-1">MK{t.price} • {t.seats} seats • {t.date}</div>
              <div className="mt-2 text-[12px] bg-green-100 inline-block px-2 py-1 rounded-full">VERIFIED LIVE</div>
            </div>
          ))}
        </div>
        <a href="/driver" className="mt-8 block h-[50px] bg-black text-white rounded-full grid place-items-center font-black">Go to Driver Dashboard</a>
      </div>
    </div>
  )
}