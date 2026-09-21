"use client"
import { useEffect, useState, Suspense } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useSearchParams } from "next/navigation"

function BookingsList(){
  const params = useSearchParams()
  const phoneFromUrl = params.get('phone') || ""
  const [phone, setPhone] = useState(phoneFromUrl)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(!phoneFromUrl){
      const saved = localStorage.getItem("tumani_last_phone")
      if(saved) setPhone(saved)
    } else {
      setPhone(phoneFromUrl)
    }
  },[phoneFromUrl])

  useEffect(()=>{
    if(!phone) { setLoading(false); return }
    (async()=>{
      setLoading(true)
      // fetch bookings WITH trip details
        const { data: bookingsData } = await supabase
       .from('bookings')
       .select('*')
       .eq('customer_phone', phone)
       .order('created_at',{ascending:false})
      
      // try to get trip city names separately
      let enriched = bookingsData || []
      if(enriched.length>0){
        const tripIds = [...new Set(enriched.map((b:any)=>b.trip_id))]
        const { data: tripsData } = await supabase.from('trips').select('*').in('id', tripIds)
        const tripMap = Object.fromEntries((tripsData||[]).map((t:any)=>[t.id, t]))
        enriched = enriched.map((b:any)=> ({...b, trips: tripMap[b.trip_id] || null}))
      }
      setBookings(enriched)
    })()
  },[phone])

  const cancelBooking = async(id:string)=>{
    if(!confirm("Cancel this booking?")) return
    await supabase.from('bookings').update({status:'cancelled'}).eq('id', id)
    setBookings(prev=> prev.map(b=> b.id===id? {...b, status:'cancelled'}: b))
  }

  const getBadge = (status:string)=>{
    if(status==='pending') return "bg-yellow-100 text-yellow-700 border-yellow-200"
    if(status==='confirmed') return "bg-green-100 text-green-700 border-green-200"
    if(status==='cancelled') return "bg-red-100 text-red-600 border-red-200"
    return "bg-blue-100 text-blue-600 border-blue-200"
  }

  return (
    <div className="max-w-[600px] mx-auto p-4 pb-20">
      <a href="/" className="text-[14px] font-bold opacity-60">← Back to Marketplace</a>
      <h1 className="text-[22px] font-black mt-4">My Bookings for {phone || "—"}</h1>
      <p className="text-[13px] text-gray-500 mt-1">{bookings.length} trip{bookings.length!==1?'s':''} found</p>

   <div className="mt-5 space-y-3">
  {loading && bookings.length===0 && <p className="text-[14px] text-gray-500">Loading your trips...</p>}
  {!loading && bookings.length===0 && <p className="text-[14px] text-gray-500">No bookings yet. Book a trip first.</p>}
        {bookings.map(b=>(
          <div key={b.id} className="p-4 rounded-[16px] border bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="font-black text-[16px]">
                {b.trips?.from_city || "Trip"} → {b.trips?.to_city || b.trip_id?.slice(0,8)}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadge(b.status)}`}>
                {b.status}
              </span>
            </div>
            <div className="text-[13px] mt-1 opacity-70">
              {b.trips?.date? String(b.trips.date).slice(0,10) : ""} {b.trips?.price? `• MK ${b.trips.price}`: ""} • Driver: {b.driver_id?.slice(0,8)}
            </div>
            <div className="text-[14px] mt-2 font-medium">{b.customer_name} - {b.customer_phone}</div>
            <div className="text-[12px] text-gray-400 mt-1">{new Date(b.created_at).toLocaleString()}</div>

            {b.status!== 'cancelled' && (
              <button onClick={()=>cancelBooking(b.id)} className="mt-3 w-full py-2.5 rounded-full border border-red-200 text-red-600 font-bold text-[13px] hover:bg-red-50">
                Cancel Booking
              </button>
            )}
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