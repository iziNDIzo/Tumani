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
      alert("Trip posted! Waiting for verification.")
      router.push("/marketplace")
    } catch (err:any) {
      alert("Error: "+err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  const uploadClass = "border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50/50 bg-white"

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-[24px] border border-gray-200 p-6 md:p-8 shadow-sm">
        <h1 className="text-[22px] font-extrabold text-gray-900">Post a Trip • Tumani</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">All fields required for verification</p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Driver Name" className={inputClass} value={form.driverName} onChange={e=>setForm({...form, driverName:e.target.value})} />
            <input required placeholder="WhatsApp e.g 09988..." className={inputClass} value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} />
            <input required placeholder="From: Lilongwe" className={inputClass} value={form.from} onChange={e=>setForm({...form, from:e.target.value})} />
            <input required placeholder="To: Mchinji" className={inputClass} value={form.to} onChange={e=>setForm({...form, to:e.target.value})} />
            <input required placeholder="Vehicle: Sedan / Pickup" className={inputClass} value={form.vehicle} onChange={e=>setForm({...form, vehicle:e.target.value})} />
            <input required placeholder="Plate: e.g. KK4004" className={inputClass} value={form.plate} onChange={e=>setForm({...form, plate:e.target.value})} />
            <input required type="number" placeholder="Seats e.g 4" className={inputClass} value={form.seats} onChange={e=>setForm({...form, seats:e.target.value})} />
            <input required type="number" placeholder="Price MK: 40000" className={inputClass} value={form.seatPrice} onChange={e=>setForm({...form, seatPrice:e.target.value})} />
            <input required type="date" className={inputClass} value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
            <input required type="time" className={inputClass} value={form.time} onChange={e=>setForm({...form, time:e.target.value})} />
          </div>

          <p className="font-extrabold text-[12px] text-gray-900 mt-2 tracking-wide">VERIFICATION PHOTOS (REQUIRED)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className={uploadClass}>
              <p className="text-[11px] font-extrabold text-gray-900">SELFIE + ID</p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">{photos.selfieId? "✓ "+photos.selfieId.name : "Click to upload"}</p>
              <input type="file" accept="image/*" hidden onChange={e=>setPhotos(p=>({...p, selfieId:e.target.files![0]}))} />
            </label>
            <label className={uploadClass}>
              <p className="text-[11px] font-extrabold text-gray-900">DRIVER LICENSE</p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">{photos.licensePhoto? "✓ "+photos.licensePhoto.name : "Click to upload"}</p>
              <input type="file" accept="image/*" hidden onChange={e=>setPhotos(p=>({...p, licensePhoto:e.target.files![0]}))} />
            </label>
            <label className={uploadClass}>
              <p className="text-[11px] font-extrabold text-gray-900">VEHICLE + PLATE</p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">{photos.vehiclePhoto? "✓ "+photos.vehiclePhoto.name : "Click to upload"}</p>
              <input type="file" accept="image/*" hidden onChange={e=>setPhotos(p=>({...p, vehiclePhoto:e.target.files![0]}))} />
            </label>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-full hover:bg-blue-700 text-[15px] shadow-md">
            {loading? "Posting..." : "Post Trip for Verification"}
          </button>
        </form>
      </div>
    </div>
  )
}