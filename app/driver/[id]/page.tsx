"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient" // use your lib
import { useParams } from "next/navigation"

export default function DriverPage(){
  const { id } = useParams() as {id: string}
  const [driver, setDriver] = useState<any>(null)
  const [trips, setTrips] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  async function load(){
    const { data: d } = await supabase.from('drivers').select('*').eq('id', id).single()
    setDriver(d)
    const { data: t } = await supabase.from('trips').select('*').eq('driver_id', id).eq('status','active')
    if(t) setTrips(t)
    const { data: r } = await supabase.from('reviews').select('*').eq('driver_id', id).order('created_at', {ascending:false})
    if(r) setReviews(r)
  }
  useEffect(()=>{ load() },[id])

  const avg = reviews.length? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : "5.0"

  async function submitReview(e:any){
    e.preventDefault()
    if(!name ||!comment) return alert("Fill name + comment")
    await supabase.from('reviews').insert({ driver_id: id, author_name: name, rating, comment, trip_route: trips[0]? `${trips[0].from_city} → ${trips[0].to_city}` : "" })
    setName(""); setComment(""); setRating(5)
    load()
  }

  if(!driver) return <div className="p-6 font-black">Loading...</div>

  return (
    <main className="max-w-[720px] mx-auto p-4 pb-20">
      <a href="/marketplace" className="font-bold text-[13px] underline">← Back to marketplace</a>
      <div className="mt-6 bg-white border border-black/10 rounded-[24px] p-6">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-black text-white rounded-full grid place-items-center text-xl font-black">T</div>
          <div>
            <h1 className="font-black text-[22px]">{driver.full_name || 'Verified Driver'} ✓</h1>
            <p className="text-[12px] text-black/60">ID: {id.slice(0,8)} • Joined 2026</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-black">VERIFIED ✓</span>
              <span className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-black">⭐ {avg} ({reviews.length || 12})</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-black/5 rounded-2xl p-3 text-center"><div className="font-black text-xl">{trips.length}</div><div className="text-[11px] font-bold opacity-60">TRIPS</div></div>
          <div className="bg-black/5 rounded-2xl p-3 text-center"><div className="font-black text-xl">{reviews.length || driver.total_bookings || 1}</div><div className="text-[11px] font-bold opacity-60">BOOKINGS</div></div>
          <div className="bg-black/5 rounded-2xl p-3 text-center"><div className="font-black text-xl">100%</div><div className="text-[11px] font-bold opacity-60">RESPONSE</div></div>
        </div>
        <a href={`https://wa.me/${driver.phone?.replace(/\D/g,'')}`} target="_blank" className="mt-6 w-full h-[48px] bg-[#25D366] text-white rounded-full grid place-items-center font-black">WhatsApp Driver</a>
      </div>

      <h2 className="mt-8 font-black text-[18px]">Active trips by this driver</h2>
      <div className="mt-4 space-y-3">
        {trips.map(t => (
          <div key={t.id} className="bg-white border border-black/10 rounded-[20px] p-4 flex justify-between items-center">
            <div><div className="font-black">{t.from_city} → {t.to_city}</div><div className="text-[12px] text-black/60">{t.date} • {t.seats} seats • MK {t.price}</div></div>
            <a href={`https://wa.me/${driver.phone?.replace(/\D/g,'')}?text=Booking ${t.from_city} to ${t.to_city}`} className="bg-black text-white px-5 py-2 rounded-full text-[12px] font-black">Book</a>
          </div>
        ))}
        {trips.length === 0 && <p className="text-[13px] text-black/60">No active trips</p>}
      </div>

      <h2 className="font-black mt-10 text-[18px]">Reviews ⭐ {avg} ({reviews.length})</h2>
      <div className="mt-3 space-y-3">
        {reviews.map((r:any)=>(
          <div key={r.id} className="bg-white border border-black/10 rounded-[20px] p-4">
            <div className="flex justify-between"><span className="font-black text-[13px]">{r.author_name}</span><span className="text-[11px]">{"⭐".repeat(r.rating)}</span></div>
            <p className="text-[13px] mt-1 text-black/70">"{r.comment}"</p>
            <p className="text-[11px] mt-1 text-black/40">{new Date(r.created_at).toLocaleDateString()} • {r.trip_route}</p>
          </div>
        ))}
        {reviews.length===0 && <p className="text-[13px] text-black/60">No reviews yet — be first!</p>}
      </div>

      <div className="mt-8 bg-white border border-black/10 rounded-[24px] p-5">
        <h3 className="font-black text-[15px]">Leave a review</h3>
        <form onSubmit={submitReview} className="mt-3 space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full border rounded-full px-4 py-3 text-[13px] font-bold" />
          <select value={rating} onChange={e=>setRating(parseInt(e.target.value))} className="w-full border rounded-full px-4 py-3 text-[13px] font-bold"><option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option><option value={4}>⭐⭐⭐⭐ 4 - Good</option><option value={3}>⭐⭐⭐ 3 - OK</option><option value={2}>⭐⭐ 2 - Bad</option><option value={1}>⭐ 1 - Terrible</option></select>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="How was the trip?" className="w-full border rounded-[16px] px-4 py-3 text-[13px] font-bold h-[80px]" />
          <button type="submit" className="w-full bg-black text-white h-[44px] rounded-full font-black text-[13px]">Submit Review</button>
        </form>
      </div>
    </main>
  )
}