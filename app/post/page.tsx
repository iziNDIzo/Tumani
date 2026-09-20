"use client"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export default function PostTripPage(){
  const [form, setForm] = useState({ from_city:"Lilongwe", to_city:"Blantyre", date:"", time:"08:00", price:"", seats:"4", full_name:"", phone:"", description:"" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  async function handlePost(e:any){
    e.preventDefault()
    setLoading(true)

    // 1. Find or create driver
    let driverId
    const { data: existing } = await supabase.from('drivers').select('id').eq('phone', form.phone).single()

    if(existing){
      driverId = existing.id
    } else {
      const { data: newDriver, error } = await supabase.from('drivers').insert({ full_name: form.full_name, phone: form.phone }).select('id').single()
      if(error){ alert("Error: "+error.message); setLoading(false); return }
      driverId = newDriver.id
    }

    // 2. Insert trip
    const { error: tripError } = await supabase.from('trips').insert({
      driver_id: driverId,
      from_city: form.from_city,
      to_city: form.to_city,
      date: form.date || new Date().toISOString().split('T')[0],
      price: Number(form.price),
      seats: Number(form.seats),
    })

    if(tripError){ alert(tripError.message) }
    else {
      alert("Boom! Trip posted 🔥")
      router.push('/marketplace')
    }
    setLoading(false)
  }

  return(
    <div className="min-h-screen bg-[#fcfaf8] text-black">
      <header className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[720px] mx-auto px-4 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0a84ff] grid place-items-center text-white font-black">T</div>
            <span className="font-black text-[18px]">Tumani</span>
          </Link>
          <Link href="/marketplace" className="h-[40px] px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[13px]">Marketplace</Link>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-4 py-8">
        <h1 className="font-black text-[32px] tracking-tight leading-[0.9]">Post a trip</h1>
        <p className="mt-2 text-[13px] font-medium text-black/60">Get bookings on WhatsApp instantly • Verified only</p>

        <form onSubmit={handlePost} className="mt-8 bg-white border border-black/10 rounded-[24px] p-6 md:p-8 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black tracking-widest">FROM</label>
              <select value={form.from_city} onChange={e=>setForm({...form, from_city:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none">
                <option>Lilongwe</option><option>Blantyre</option><option>Mzuzu</option><option>Salima</option><option>Mangochi</option><option>Zomba</option><option>Dedza</option><option>Kasungu</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black tracking-widest">TO</label>
              <select value={form.to_city} onChange={e=>setForm({...form, to_city:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none">
                <option>Blantyre</option><option>Lilongwe</option><option>Mzuzu</option><option>Salima</option><option>Mangochi</option><option>Zomba</option><option>Dedza</option><option>Kasungu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black tracking-widest">DATE</label>
              <input type="date" required value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none" />
            </div>
            <div>
              <label className="text-[11px] font-black tracking-widest">TIME</label>
              <input type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black tracking-widest">PRICE (MK)</label>
              <input required placeholder="25000" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none placeholder:text-black/30" />
            </div>
            <div>
              <label className="text-[11px] font-black tracking-widest">SEATS</label>
              <select value={form.seats} onChange={e=>setForm({...form, seats:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none">
                <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option>
              </select>
            </div>
          </div>

          <div className="h-[1px] bg-black/10 my-6"></div>

          <div>
            <label className="text-[11px] font-black tracking-widest">YOUR NAME</label>
            <input required placeholder="John Banda" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none placeholder:text-black/30" />
          </div>
          <div>
            <label className="text-[11px] font-black tracking-widest">WHATSAPP NUMBER</label>
            <input required placeholder="265 888 123 456" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none placeholder:text-black/30" />
          </div>

          <button disabled={loading} className="w-full h-[52px] rounded-full bg-black text-white font-black text-[14px] mt-4 disabled:opacity-50">
            {loading? "Posting..." : "Post trip → Get bookings"}
          </button>

          <p className="text-center text-[11px] font-medium text-black/40">Takes 30 seconds • Bookings come via WhatsApp</p>
        </form>
      </main>
    </div>
  )
}