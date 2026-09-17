"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function DrivePage(){
  const [user,setUser]=useState<any>(null)
  const [driver,setDriver]=useState<any>(null)
  const [claimed,setClaimed]=useState<any[]>([])
  const [myTrips,setMyTrips]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [msg,setMsg]=useState("")
  const [fromCity,setFromCity]=useState("Mchinji")
  const [toCity,setToCity]=useState("Lilongwe")
  const [price,setPrice]=useState("15000")
  const [plate,setPlate]=useState("KK 47")
  const [seats,setSeats]=useState("4")
  const [vehicle,setVehicle]=useState("Sedan")
  const [date,setDate]=useState("")
  const [driverName,setDriverName]=useState("")
  const [whatsapp,setWhatsapp]=useState("")
  const router = useRouter()

  useEffect(()=>{
    const init = async ()=>{
      const {data:{user:u}} = await supabase.auth.getUser()
      if(!u){ router.push("/auth"); return }
      setUser(u)
      setDriverName(u.user_metadata?.full_name || "")

      // CHECK DRIVER VERIFICATION - THIS IS THE KEY
      const {data: d} = await supabase.from('drivers').select('*').eq('id', u.id).single()
      if(d){
        setDriver(d)
        if(!d.verified){ router.push("/drive/pending"); return }
      }

      const {data: jobs} = await supabase.from('parcels').select('*').eq('claimed_by', u.id).eq('status','claimed').order('claimed_at',{ascending:false})
      if(jobs) setClaimed(jobs)
      const {data: trips} = await supabase.from('trips').select('*').eq('driver_id', u.id).order('created_at',{ascending:false})
      if(trips) setMyTrips(trips)
      setLoading(false)
    }
    init()
  },[])

  const markDelivered = async (id:string)=>{
    await supabase.from('parcels').update({status:'delivered', delivered_at: new Date().toISOString()}).eq('id',id)
    setClaimed(prev=>prev.filter(j=>j.id!==id))
    setMsg("✅ Marked delivered!")
    setTimeout(()=>setMsg(""),3000)
  }

  const postTrip = async (e:any)=>{
    e.preventDefault()
    setMsg("")
    const payload = { driver_id: user.id, driver_name: driverName, from_city: fromCity, to_city: toCity, seat_price: Number(price), plate, seats: Number(seats), vehicle, date, whatsapp, verified: false }
    const {error} = await supabase.from('trips').insert(payload)
    if(error) setMsg("❌ "+error.message)
    else {
      setMsg("✅ Trip posted! Waiting for admin verification.")
      const {data} = await supabase.from('trips').select('*').eq('driver_id', user.id).order('created_at',{ascending:false})
      if(data) setMyTrips(data)
    }
  }

  if(loading) return <div className="p-8 font-black">Loading...</div>

  return(
    <div className="min-h-screen bg-[#f6f7f9] p-4 md:p-8">
      <div className="max-w-[900px] mx-auto">
        {msg && <div className="bg-black text-white font-bold text-center py-3 rounded-full mb-4 text-[13px]">{msg}</div>}
        {/*... keep rest of your UI same... */}
        <div className="flex justify-between items-center"><h1 className="text-[28px] font-black">My Drive — {driver?.verified? "✅ Verified" : ""}</h1><button onClick={async()=>{await supabase.auth.signOut(); router.push("/auth")}} className="px-5 py-2.5 bg-black text-white rounded-full font-black text-[12px]">Logout</button></div>
        <div className="mt-8 bg-white rounded-[24px] p-6 border">
          <h2 className="font-black text-[18px]">Post New Trip</h2>
          <form onSubmit={postTrip} className="mt-6 grid grid-cols-2 gap-4">
            <input value={fromCity} onChange={e=>setFromCity(e.target.value)} placeholder="From" className="flex-1 h-[48px] border-2 rounded-full px-5 font-bold text-[13px]"/><input value={toCity} onChange={e=>setToCity(e.target.value)} placeholder="To" className="flex-1 h-[48px] border-2 rounded-full px-5 font-bold text-[13px]"/>
            <select value={vehicle} onChange={e=>setVehicle(e.target.value)} className="h-[48px] border-2 rounded-full px-5 font-bold"><option>Sedan</option><option>Hilux</option><option>Minibus</option><option>Truck</option></select>
            <input value={plate} onChange={e=>setPlate(e.target.value)} placeholder="Plate" className="h-[48px] border-2 rounded-full px-5 font-bold text-[13px]"/>
            <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" className="h-[48px] border-2 rounded-full px-5 font-bold text-[13px]"/><input value={seats} onChange={e=>setSeats(e.target.value)} placeholder="Seats" className="h-[48px] border-2 rounded-full px-5 font-bold text-[13px]"/>
            <input value={driverName} onChange={e=>setDriverName(e.target.value)} placeholder="Driver Name" className="col-span-2 h-[48px] border-2 rounded-full px-5 font-bold text-[13px]"/>
            <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp" className="col-span-2 h-[48px] border-2 rounded-full px-5 font-bold text-[13px]"/>
            <button type="submit" className="col-span-2 bg-blue-600 text-white font-black py-4 rounded-full mt-2">Post Trip</button>
          </form>
        </div>
      </div>
    </div>
  )
}