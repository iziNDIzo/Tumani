"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export default function DrivePage(){
  const [user,setUser]=useState<any>(null)
  const [claimed,setClaimed]=useState<any[]>([])
  const [myTrips,setMyTrips]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  // form
  const [fromCity,setFromCity]=useState("Mchinji")
  const [toCity,setToCity]=useState("Lilongwe")
  const [price,setPrice]=useState("15000")
  const [plate,setPlate]=useState("KK 47")
  const [seats,setSeats]=useState("4")
  const [vehicle,setVehicle]=useState("Sedan")
  const [date,setDate]=useState("thatUX")
  const [driverName,setDriverName]=useState("")
  const [whatsapp,setWhatsapp]=useState("")
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    const init = async ()=>{
      const {data:{user:u}} = await supabase.auth.getUser()
      if(!u){ router.push("/auth"); return }
      setUser(u)
      setDriverName(u.user_metadata?.full_name || "")
      // claimed jobs
      const {data: jobs} = await supabase.from('parcels').select('*').eq('claimed_by', u.id).eq('status','claimed').order('claimed_at',{ascending:false})
      if(jobs) setClaimed(jobs)
      // my trips
      const {data: trips} = await supabase.from('trips').select('*').eq('driver_id', u.id).order('created_at',{ascending:false})
      if(trips) setMyTrips(trips)
      setLoading(false)
    }
    init()
  },[])

  const markDelivered = async (id:string)=>{
    if(!confirm("Mark as delivered? Client will be notified.")) return
    await supabase.from('parcels').update({status:'delivered', delivered_at: new Date().toISOString()}).eq('id',id)
    setClaimed(prev=>prev.filter(j=>j.id!==id))
  }

  const postTrip = async (e:any)=>{
    e.preventDefault()
    const payload = {
      driver_id: user.id,
      driver_name: driverName,
      from_city: fromCity,
      to_city: toCity,
      seat_price: Number(price),
      plate,
      seats: Number(seats),
      vehicle,
      date,
      whatsapp,
      verified: false
    }
    const {error} = await supabase.from('trips').insert(payload)
    if(error) alert(error.message)
    else {
      alert("Trip posted! Waiting for verification.")
      const {data} = await supabase.from('trips').select('*').eq('driver_id', user.id).order('created_at',{ascending:false})
      if(data) setMyTrips(data)
    }
  }

  const handleLogout = async ()=>{ await supabase.auth.signOut(); router.push("/auth") }

  if(loading) return <div className="p-8 font-black">Loading...</div>

  return(
    <div className="min-h-screen bg-[#f6f7f9] p-4 md:p-8">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-[28px] font-black tracking-tight">My Drive</h1>
          <button onClick={handleLogout} className="px-5 py-2.5 bg-black text-white rounded-full font-black text-[12px]">Logout</button>
        </div>

        {/* CLAIMED JOBS */}
        <div className="mt-8 bg-white rounded-[24px] p-6 border-2 border-black/5">
          <h2 className="font-black text-[18px]">My Claimed Jobs ({claimed.length})</h2>
          {claimed.length===0? <p className="text-[13px] text-black/40 font-bold mt-3">No jobs yet. Go to Marketplace → Jobs and claim one.</p> : (
            <div className="mt-4 grid gap-4">
              {claimed.map((j:any)=>(
                <div key={j.id} className="border-2 border-black/10 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-mono text-[11px] font-bold text-[#7c3aed] bg-[#f5f3ff] inline-block px-2 py-1 rounded-full">{j.tracking_id}</p>
                    <p className="font-black text-[16px] mt-2">{j.pickup_address || 'Pickup'} → {j.delivery_address}</p>
                    <p className="text-[12px] font-bold text-black/60 mt-1">{j.description} • MK {Number(j.fee).toLocaleString()}</p>
                    <p className="text-[12px] font-bold mt-1">Client: {j.recipient_phone}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={`https://wa.me/${j.recipient_phone?.replace(/[^0-9]/g,'')}`} target="_blank" className="px-5 py-3 bg-[#22c55e] text-white rounded-full font-black text-[12px] text-center">WhatsApp Client</a>
                    <button onClick={()=>markDelivered(j.id)} className="px-5 py-3 bg-black text-white rounded-full font-black text-[12px]">Mark Delivered</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POST TRIP - YOUR EXISTING UI KEPT */}
        <div className="mt-6 bg-white rounded-[24px] p-6 border-2 border-black/5">
          <h2 className="font-black text-[18px]">Post New Trip</h2>
          <p className="text-[13px] text-black/50 font-bold mt-1">TUM-MCH-LW02-091 • Your driver profile has been verified</p>
          <form onSubmit={postTrip} className="mt-6 grid grid-cols-2 gap-4">
            <div className="col-span-2 flex gap-4"><input value={fromCity} onChange={e=>setFromCity(e.target.value)} placeholder="From" className="flex-1 h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/><input value={toCity} onChange={e=>setToCity(e.target.value)} placeholder="To" className="flex-1 h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/></div>
            <select value={vehicle} onChange={e=>setVehicle(e.target.value)} className="h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"><option>Sedan</option><option>Hilux</option><option>Minibus</option><option>Truck</option></select>
            <input value={plate} onChange={e=>setPlate(e.target.value)} placeholder="Plate KK47" className="h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/>
            <input value={seats} onChange={e=>setSeats(e.target.value)} placeholder="Seats 4" className="h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/>
            <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price 15000" className="h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/>
            <input value={date} onChange={e=>setDate(e.target.value)} placeholder="Date thatUX" className="h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/>
            <input value={driverName} onChange={e=>setDriverName(e.target.value)} placeholder="Driver Name" className="col-span-2 h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/>
            <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp 265..." className="col-span-2 h-[48px] border-2 border-black/10 rounded-full px-5 font-bold text-[13px]"/>
            <button type="submit" className="col-span-2 bg-blue-600 text-white font-black py-4 rounded-full mt-2">Post Trip</button>
          </form>

          {/* MY TRIPS */}
          <div className="mt-8">
            <h3 className="font-black text-[14px]">My Trips ({myTrips.length})</h3>
            <div className="mt-3 space-y-2">
              {myTrips.map((t:any)=>(<div key={t.id} className="flex justify-between items-center border border-black/10 rounded-full px-5 py-3"><p className="font-bold text-[13px]">{t.from_city} → {t.to_city} • MK {Number(t.seat_price).toLocaleString()}</p><span className={`text-[10px] font-black px-3 py-1 rounded-full ${t.verified?"bg-green-400 text-black":"bg-amber-400 text-black"}`}>{t.verified?"VERIFIED":"PENDING"}</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}