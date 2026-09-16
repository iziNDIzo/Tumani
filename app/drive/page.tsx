"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DrivePage() {
  const router = useRouter()
  const [form, setForm] = useState({ driverName: "", whatsapp: "", from: "", to: "", vehicle: "Sedan", plate: "", seats: "4", seatPrice: "", date: "", time: "" })
  const [photos, setPhotos] = useState({ selfieId: null as File|null, licensePhoto: null as File|null, vehiclePhoto: null as File|null })
  const [loading, setLoading] = useState(false)

  const upload = async (file: File) => {
    const name = Date.now()+"_"+file.name
    const { error } = await supabase.storage.from('driver-docs').upload(name, file)
    if (error) throw error
    const { data } = supabase.storage.from('driver-docs').getPublicUrl(name)
    return data.publicUrl
  }

  const submit = async (e: any) => {
    e.preventDefault()
    if (!photos.selfieId ||!photos.licensePhoto ||!photos.vehiclePhoto) {
      alert("Upload all 3 photos")
      return
    }
    setLoading(true)
    try {
      const [selfieUrl, licenseUrl, vehicleUrl] = await Promise.all([
        upload(photos.selfieId),
        upload(photos.licensePhoto),
        upload(photos.vehiclePhoto),
      ])

      const { error } = await supabase.from('trips').insert([{
        driver_name: form.driverName,
        whatsapp: form.whatsapp,
        from_city: form.from,
        to_city: form.to,
        vehicle: form.vehicle,
        plate: form.plate,
        seats: parseInt(form.seats),
        seat_price: parseInt(form.seatPrice),
        date: form.date,
        time: form.time,
        selfie_id_url: selfieUrl,
        license_url: licenseUrl,
        vehicle_url: vehicleUrl,
        verified: false,
      }])
      if (error) throw error

      alert("Trip posted! Waiting for Admin verification.")
      router.push("/marketplace")
    } catch (err:any) {
      alert("Error: "+err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border p-6">
        <h1 className="text-xl font-extrabold">Post a Trip • Tumani</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input required placeholder="Driver Name" className="border rounded-xl px-4 py-3 text-sm" value={form.driverName} onChange={e=>setForm({...form, driverName:e.target.value})} />
            <input required placeholder="WhatsApp e.g 09988..." className="border rounded-xl px-4 py-3 text-sm" value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} />
            <input required placeholder="From: Lilongwe" className="border rounded-xl px-4 py-3 text-sm" value={form.from} onChange={e=>setForm({...form, from:e.target.value})} />
            <input required placeholder="To: Mchinji" className="border rounded-xl px-4 py-3 text-sm" value={form.to} onChange={e=>setForm({...form, to:e.target.value})} />
            <input required placeholder="Vehicle: Pickup" className="border rounded-xl px-4 py-3 text-sm" value={form.vehicle} onChange={e=>setForm({...form, vehicle:e.target.value})} />
            <input required placeholder="Plate: KK4004" className="border rounded-xl px-4 py-3 text-sm" value={form.plate} onChange={e=>setForm({...form, plate:e.target.value})} />
            <input required type="number" placeholder="Seats" className="border rounded-xl px-4 py-3 text-sm" value={form.seats} onChange={e=>setForm({...form, seats:e.target.value})} />
            <input required type="number" placeholder="Price MK: 40000" className="border rounded-xl px-4 py-3 text-sm" value={form.seatPrice} onChange={e=>setForm({...form, seatPrice:e.target.value})} />
            <input required type="date" className="border rounded-xl px-4 py-3 text-sm" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
            <input required type="time" className="border rounded-xl px-4 py-3 text-sm" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer"><p className="text-[11px] font-bold">SELFIE + ID</p><p className="text-[10px]">{photos.selfieId? "✓":"Click"}</p><input type="file" hidden onChange={e=>setPhotos(p=>({...p, selfieId:e.target.files![0]}))}/></label>
            <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer"><p className="text-[11px] font-bold">LICENSE</p><p className="text-[10px]">{photos.licensePhoto? "✓":"Click"}</p><input type="file" hidden onChange={e=>setPhotos(p=>({...p, licensePhoto:e.target.files![0]}))}/></label>
            <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer"><p className="text-[11px] font-bold">VEHICLE</p><p className="text-[10px]">{photos.vehiclePhoto? "✓":"Click"}</p><input type="file" hidden onChange={e=>setPhotos(p=>({...p, vehiclePhoto:e.target.files![0]}))}/></label>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full">{loading? "Posting..." : "Post Trip for Verification"}</button>
        </form>
      </div>
    </div>
  )
}