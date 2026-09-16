"use client"
import { useEffect, useState } from "react"

export default function AdminPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [auth, setAuth] = useState(false)
  const [pin, setPin] = useState("")
  const PIN = "2026"

  useEffect(() => {
    if (localStorage.getItem("tumani_admin_auth") === "true") setAuth(true)
    setTrips(JSON.parse(localStorage.getItem("tumani_trips") || "[]"))
  }, [])

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === PIN) { setAuth(true); localStorage.setItem("tumani_admin_auth","true") }
    else alert("Wrong PIN")
  }

  const approve = (id: number) => {
    const u = trips.map(t => t.id===id? {...t, verified:true} : t)
    localStorage.setItem("tumani_trips", JSON.stringify(u)); setTrips(u)
  }
  const reject = (id: number) => {
    if(!confirm("Reject & delete?")) return
    const u = trips.filter(t=>t.id!==id)
    localStorage.setItem("tumani_trips", JSON.stringify(u)); setTrips(u)
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <form onSubmit={login} className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="font-extrabold text-gray-900 text-xl">Tumani Admin</h1>
          <input value={pin} onChange={e=>setPin(e.target.value)} type="password" placeholder="PIN: 2026" className="mt-4 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" />
          <button className="mt-3 w-full bg-blue-600 text-white font-bold py-3 rounded-full">Enter</button>
        </form>
      </div>
    )
  }

  const pending = trips.filter(t=>!t.verified)
  const verified = trips.filter(t=>t.verified)

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[26px] font-extrabold text-gray-900">Admin • Verify Drivers</h1>
            <p className="text-sm text-gray-500 mt-1">{pending.length} pending • {verified.length} verified • {trips.length} total</p>
          </div>
          <button onClick={()=>{localStorage.removeItem("tumani_admin_auth"); setAuth(false)}} className="text-sm font-bold border-2 border-gray-900 bg-white text-gray-900 px-6 py-2 rounded-full hover:bg-gray-900 hover:text-white">
            Logout
          </button>
        </div>

        {pending.length>0 && (
          <>
            <div className="mt-6 inline-flex bg-amber-50 border border-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-bold">⏳ {pending.length} Pending Verification</div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
              {pending.map((t:any)=>(
                <div key={t.id} className="bg-white rounded-[16px] border-[1.5px] border-amber-200 p-5">
                  <div className="flex justify-between">
                    <p className="font-bold text-gray-900 text-[15px]">{t.driverName || "Vic"} • {t.plate?.toUpperCase()}</p>
                    <span className="text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full h-fit">PENDING</span>
                  </div>
                  <p className="text-[13px] text-gray-600 mt-1">{t.from} → {t.to} • {t.vehicle} • {t.seats} seats • MK {t.seatPrice || t.price}</p>
                  <p className="text-[12px] text-gray-500 mt-1">WhatsApp: {t.whatsapp} • {t.date} {t.time}</p>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div><p className="text-[10px] font-bold text-gray-500 mb-2">SELFIE + ID</p>{t.selfieId? <img src={t.selfieId} className="w-full h-[105px] object-cover rounded-xl border border-gray-200" /> : <div className="h-[105px] bg-gray-100 rounded-xl flex items-center justify-center text-[11px] text-gray-400">No image</div>}</div>
                    <div><p className="text-[10px] font-bold text-gray-500 mb-2">DRIVER LICENSE</p>{t.licensePhoto? <img src={t.licensePhoto} className="w-full h-[105px] object-cover rounded-xl border border-gray-200" /> : <div className="h-[105px] bg-gray-100 rounded-xl flex items-center justify-center text-[11px] text-gray-400">No image</div>}</div>
                    <div><p className="text-[10px] font-bold text-gray-500 mb-2">VEHICLE + PLATE</p>{t.vehiclePhoto? <img src={t.vehiclePhoto} className="w-full h-[105px] object-cover rounded-xl border border-gray-200" /> : <div className="h-[105px] bg-gray-100 rounded-xl flex items-center justify-center text-[11px] text-gray-400">No image</div>}</div>
                  </div>

                  <div className="mt-5 flex gap-2.5">
                    <a href={`https://wa.me/${(t.whatsapp||"").replace(/[^0-9]/g,"")}`} target="_blank" className="flex-1 text-center bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-full text-[13px]">Call on WhatsApp</a>
                    <button onClick={()=>reject(t.id)} className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-600 font-bold text-[13px]">Reject</button>
                    <button onClick={()=>approve(t.id)} className="flex-1 bg-[#16a34a] text-white font-bold py-2.5 rounded-full text-[13px]">✓ Approve & Go Live</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {verified.length>0 && (
          <>
            <div className="mt-10 inline-flex bg-green-50 border border-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold">✓ {verified.length} Verified & Live</div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {verified.map((t:any)=>(
                <div key={t.id} className="bg-white rounded-2xl border p-4 flex justify-between">
                  <div><p className="font-bold text-sm text-gray-900">{t.driverName} • {t.plate?.toUpperCase()}</p><p className="text-xs text-gray-500">{t.from} → {t.to}</p></div>
                  <button onClick={()=>reject(t.id)} className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full h-fit">Remove</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}