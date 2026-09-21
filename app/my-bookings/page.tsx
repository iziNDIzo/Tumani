"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useSearchParams } from "next/navigation"

export default function MyBookings(){
  const params = useSearchParams()
  const phone = params.get('phone') || ""
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(()=>{
    if(!phone) return
    supabase.from('bookings').select('*').eq('customer_phone', phone).order('created_at',{ascending:false}).then(({data})=> setBookings(data||[]))
  },[phone])

  return (
    <div className="max-w-[600px] mx-auto p-4">
      <a href="/" className="text-[14px]">← Back to Marketplace</a>
      <h1 className="text-[20px] font-black mt-4">My Bookings for {phone}</h1>
      <div className="mt-4 space-y-3">
        {bookings.length===0 && <p className="text-[14px] text-gray-500">No bookings yet.</p>}
        {bookings.map(b=>(
          <div key={b.id} className="p-4 rounded-xl border bg-white">
            <p className="text-[13px]">Trip ID: {b.trip_id?.slice(0,8)}</p>
            <p className="text-[14px] font-bold">Status: <span className="text-[#0a84ff]">{b.status}</span></p>
            <p className="text-[12px] text-gray-500">{new Date(b.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}