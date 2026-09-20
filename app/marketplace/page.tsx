"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const [error,setError]=useState("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(()=>{
    const load = async () => {
      const { data, error } = await supabase.from('trips').select('*').order('created_at',{ascending:false})
      console.log("TRIPS DATA:", data, "ERROR:", error)
      if(error) setError(error.message)
      if(data) setTrips(data)
    }
    load()
  },[])

  return(
    <div className="p-6">
      <h1 className="font-black text-[24px]">Find your ride across Malawi — {trips.length} rides</h1>
      {error && <p className="bg-red-100 p-3 mt-4 text-red-700 font-bold">Error: {error}</p>}
      <div className="mt-6 grid gap-4">
        {trips.map(t=>(
          <div key={t.id} className="border p-4 rounded-xl">
            <p className="font-black">{t.from_city} → {t.to_city} — MK {t.price}</p>
            <p className="text-sm">{t.date} • {t.seats} seats • status: {t.status}</p>
          </div>
        ))}
        {trips.length===0 &&!error && <p className="mt-10 opacity-60">No data returned from Supabase. RLS still blocking.</p>}
      </div>
    </div>
  )
}