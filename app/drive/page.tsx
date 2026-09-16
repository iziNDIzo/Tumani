"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DrivePage() {
  const router = useRouter()
  const [form, setForm] = useState({ driverName: "", whatsapp: "", from: "", to: "", vehicle: "Sedan", plate: "", seats: "4", seatPrice: "", date: "", time: "" })
  const [photos, setPhotos] = useState({ selfieId: "", licensePhoto: "", vehiclePhoto: "" })
  const [loading, setLoading] = useState(false)

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
    })
  }

  const handlePhoto = async (e: any, key: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await toBase64(file)
    setPhotos(p => ({...p, [key]: base64 }))
  }

  const submit = (e: any) => {
    e.preventDefault()
    if (!photos.selfieId ||!photos.licensePhoto ||!photos.vehiclePhoto) {
      alert("Please upload all 3 photos: Selfie+ID, License, Vehicle")
      return
    }
    setLoading(true)
    const trips = JSON.parse(localStorage.getItem("tumani_trips") || "[]")
    const newTrip = {
      id: Date.now(),
     ...form,
     ...photos,
      price: form.seatPrice,
      verified: false,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem("tumani_trips", JSON.stringify([newTrip,...trips]))
    alert("Trip posted! Waiting for Admin verification.")
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-6">
        <h1 className="text-xl font-extrabold text-gray-900">Post a Trip • Tumani</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Driver Name" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.driverName} onChange={e=>setForm({...form, driverName:e.target.value})} />
            <input required placeholder="WhatsApp e.g 09988..." className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} />
            <input required placeholder="From: Lilongwe" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.from} onChange={e=>setForm({...form, from:e.target.value})} />
            <input required placeholder="To: Mchinji" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.to} onChange={e=>setForm({...form, to:e.target.value})} />
            <input required placeholder="Vehicle: Pickup" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.vehicle} onChange={e=>setForm({...form, vehicle:e.target.value})} />
            <input required placeholder="Plate: e.g. KK4004" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.plate} onChange={e=>setForm({...form, plate:e.target.value})} />
            <input required type="number" placeholder="Seats" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.seats} onChange={e=>setForm({...form, seats:e.target.value})} />
            <input required type="number" placeholder="Price MK: 40000" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.seatPrice} onChange={e=>setForm({...form, seatPrice:e.target.value})} />
            <input required type="date" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
            <input required type="time" className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} />
          </div>

          <p className="font-bold text-sm text-gray-900 mt-2">Verification Photos (Required)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-gray-900">
              <p className="text-[11px] font-bold text-gray-700">SELFIE + ID</p>
              <p className="text-[10px] text-gray-500 mt-1 truncate">{photos.selfieId? "✓ Uploaded" : "Click to upload"}</p>
              <input type="file" accept="image/*" hidden onChange={e=>handlePhoto(e, "selfieId")} />
              {photos.selfieId && <img src={photos.selfieId} className="mt-2 w-full h-20 object-cover rounded-lg" />}
            </label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-gray-900">
              <p className="text-[11px] font-bold text-gray-700">DRIVER LICENSE</p>
              <p className="text-[10px] text-gray-500 mt-1 truncate">{photos.licensePhoto? "✓ Uploaded" : "Click to upload"}</p>
              <input type="file" accept="image/*" hidden onChange={e=>handlePhoto(e, "licensePhoto")} />
              {photos.licensePhoto && <img src={photos.licensePhoto} className="mt-2 w-full h-20 object-cover rounded-lg" />}
            </label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-gray-900">
              <p className="text-[11px] font-bold text-gray-700">VEHICLE + PLATE</p>
              <p className="text-[10px] text-gray-500 mt-1 truncate">{photos.vehiclePhoto? "✓ Uploaded" : "Click to upload"}</p>
              <input type="file" accept="image/*" hidden onChange={e=>handlePhoto(e, "vehiclePhoto")} />
              {photos.vehiclePhoto && <img src={photos.vehiclePhoto} className="mt-2 w-full h-20 object-cover rounded-lg" />}
            </label>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700">
            {loading? "Posting..." : "Post Trip for Verification"}
          </button>
        </form>
      </div>
    </div>
  )
}