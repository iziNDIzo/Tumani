"use client"
import { useEffect, useState, Suspense } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useSearchParams } from "next/navigation"

function BookingsList(){
  const params = useSearchParams()
  const phoneFromUrl = params.get('phone') || ""
  const [phone, setPhone] = useState(phoneFromUrl)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(()=>{
    // if URL has no phone, try localStorage
    if(!phoneFromUrl){
      const saved = localStorage.getItem("tumani_last_phone")
      if(saved) setPhone(saved)
    } else {
      setPhone(phoneFromUrl)
    }
  },[phoneFromUrl])

  useEffect(()=>{
    if(!phone) return
    supabase.from('bookings').select('*').eq('customer_phone', phone).order('created_at',{ascending:false}).then(({data})=> setBookings(data||[]))
  },[phone])

  return (
    <div className="max-w-[600px] mx-auto p-4">
      <a href="/" className="text-[14px]">← Back to Marketplace</a>
      <h1 className="text-[20px] font-black mt-4">My Bookings for {phone || "—"}</h1>
      <div className="mt-4 space-y-3">
        {bookings.length===0 && <p className="text-[14px] text-gray-500">No bookings yet. Book a trip first. {phone? `No bookings for ${phone}` : "Phone not found"}</p>}
        {bookings.map(b=>(
          <div key={b.id} className="p-4 rounded-xl border bg-white">
            <p className="text-[13px]">Trip: {b.trip_id?.slice(0,8)} • Driver: {b.driver_id?.slice(0,8)}</p>
            <p className="text-[14px] font-bold">Status: <span className="text-[#0a84ff]">{b.status}</span></p>
            <p className="text-[14px]">{b.customer_name} - {b.customer_phone}</p>
            <p className="text-[12px] text-gray-500">{new Date(b.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default function MyBookingsPage(){
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <BookingsList />
    </Suspense>
  )
}