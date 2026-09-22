"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"

const DISTRICTS = ["Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa","Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji","Mulanje","Mwanza","Mzimba","Mzuzu","Neno","Nkhata Bay","Nkhotakota","Nsanje","Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba"].sort()

export default function DriverPage(){
  const router = useRouter()
  const [driver,setDriver]=useState<any>(null)
  const [trips,setTrips]=useState<any[]>([])
  const [from,setFrom]=useState("Lilongwe")
  const [to,setTo]=useState("Blantyre")
  const [date,setDate]=useState("")
  const [time,setTime]=useState("06:00")
  const [price,setPrice]=useState("35000")
  const [seats,setSeats]=useState("4")
  const [showFrom,setShowFrom]=useState(false)
  const [showTo,setShowTo]=useState(false)
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const id = localStorage.getItem('tumani_driver_id')
    if(!id){ router.push('/login'); return }
    ;(async()=>{
      const {data:d}=await supabase.from('drivers').select('*').eq('id',id).single()
      setDriver(d)
      const {data:t}=await supabase.from('trips').select('*').eq('driver_id',id).order('created_at',{ascending:false})
      setTrips(t||[])
    })()
  },[router])

  const filteredFrom = DISTRICTS.filter(x=> x.toLowerCase().includes(from.toLowerCase()))
  const filteredTo = DISTRICTS.filter(x=> x.toLowerCase().includes(to.toLowerCase()))

  const doPost = async()=>{
    if(!date) return alert("Pick date")
    if(from===to) return alert("From and To cannot be same")
    setLoading(true)
    const id = localStorage.getItem('tumani_driver_id')
    const iso = `${date}T${time}:00`
    const {error} = await supabase.from('trips').insert({
      driver_id:id,
      from_city:from,
      to_city:to,
      date:iso,
      price:Number(price),
      seats:Number(seats),
      status:'active'
    })
    setLoading(false)
    if(error){ alert(error.message); return }
    alert(`Posted ${from} → ${to}! Going to homepage`)
    router.push('/')
  }

  if(!driver) return <div className="min-h-screen grid place-items-center">Loading...</div>

  return(
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-[600px] mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-black text-[14px]">← Tumani Home</Link>
          <button onClick={()=>{localStorage.clear(); router.push('/login')}} className="border px-3 py-1 rounded-full text-[12px] font-bold">Logout</button>
        </div>

        <div className="mt-4 flex gap-3 items-center">
          <div className="w-10 h-10 bg-[#0a84ff] text-white rounded-full grid place-items-center font-black">V</div>
          <div><div className="font-black">{driver.full_name}</div><div className="text-[12px] opacity-60">{driver.phone}</div></div>
        </div>

        <div className="mt-6 border-2 border-black rounded-[20px] p-5">
          <div className="font-black text-[18px]">Post new trip</div>
          <div className="text-[12px] opacity-60">Type to search district</div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="relative">
              <input value={from} onChange={e=>{setFrom(e.target.value); setShowFrom(true)}} onFocus={()=>setShowFrom(true)} className="w-full h-[48px] border-2 border-black rounded-[12px] px-3"/>
              {showFrom && <div className="absolute z-20 w-full bg-white border-2 border-black rounded-[12px] mt-1 max-h-[180px] overflow-auto">{filteredFrom.map(d=><div key={d} onClick={()=>{setFrom(d); setShowFrom(false)}} className="px-3 py-2 hover:bg-black hover:text-white cursor-pointer text-[13px]">{d}</div>)}</div>}
            </div>
            <div className="relative">
              <input value={to} onChange={e=>{setTo(e.target.value); setShowTo(true)}} onFocus={()=>setShowTo(true)} className="w-full h-[48px] border-2 border-black rounded-[12px] px-3"/>
              {showTo && <div className="absolute z-20 w-full bg-white border-2 border-black rounded-[12px] mt-1 max-h-[180px] overflow-auto">{filteredTo.map(d=><div key={d} onClick={()=>{setTo(d); setShowTo(false)}} className="px-3 py-2 hover:bg-black hover:text-white cursor-pointer text-[13px]">{d}</div>)}</div>}
            </div>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-[48px] border-2 border-black rounded-[12px] px-3"/>
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="h-[48px] border-2 border-black rounded-[12px] px-3"/>
            <input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="h-[48px] border-2 border-black rounded-[12px] px-3"/>
            <input type="number" value={seats} onChange={e=>setSeats(e.target.value)} className="h-[48px] border-2 border-black rounded-[12px] px-3"/>
          </div>
          <button onClick={doPost} disabled={loading} className="mt-4 w-full h-[52px] bg-[#0a84ff] text-white rounded-full font-black">{loading? "Posting...":"Post Trip → Homepage"}</button>
        </div>

        <div className="mt-8 pb-[100px]">
          <div className="font-black text-[16px]">My Trips ({trips.length}) - SCROLL DOWN</div>
          <div className="mt-3 space-y-3">
            {trips.map(t=>(
              <div key={t.id} className="border-2 border-black rounded-[16px] p-4 bg-yellow-50">
                <div className="font-black">{t.from_city} → {t.to_city}</div>
                <div className="text-[12px] mt-1">Date: {t.date? new Date(t.date).toLocaleString() : 'No date'} | MK{t.price} | {t.seats} seats</div>
                <div className="text-[10px] opacity-50 mt-1">ID: {t.id.slice(0,8)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}