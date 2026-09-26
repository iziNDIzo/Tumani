"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

const CITIES = ["Lilongwe", "Blantyre", "Mzuzu", "Salima", "Mangochi", "Zomba", "Dedza", "Kasungu"]

const fieldCls = "mt-2 w-full h-[46px] bg-[#f5f3ff] rounded-full px-4 font-bold text-[13px] outline-none placeholder:text-black/30"
const labelCls = "text-[11px] font-black tracking-widest"

export default function PostTripPage() {
  const router = useRouter()
  const [access, setAccess] = useState<"checking" | "loggedOut" | "notApproved" | "ok">("checking")
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    from_city: "Lilongwe",
    to_city: "Blantyre",
    stops: "",
    date: "",
    time: "08:00",
    seats: "3",
    seat_price: "",
    parcel_slots: "0",
    parcel_fee: "",
    notes: "",
  })

  // Only logged-in, approved drivers can post.
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAccess("loggedOut")
        return
      }
      setUserId(user.id)
      const { data: ok } = await supabase.rpc("is_approved_driver", { uid: user.id })
      if (ok !== true) {
        setAccess("notApproved")
        return
      }
      const { data: prof } = await supabase.from("driver_profiles").select("seats").eq("user_id", user.id).maybeSingle()
      if (prof?.seats != null) setForm(f => ({ ...f, seats: String(prof.seats) }))
      setAccess("ok")
    }
    init()
  }, [])

  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v })

  // Number fields: plain text boxes that accept digits only.
  // No up/down arrows, no scroll-wheel changes, no browser suggestion list,
  // and phones show the number keypad.
  const num = (k: "seats" | "seat_price" | "parcel_slots" | "parcel_fee") => ({
    type: "text" as const,
    inputMode: "numeric" as const,
    pattern: "[0-9]*",
    autoComplete: "off",
    value: form[k],
    onChange: (e: any) => set(k, e.target.value.replace(/\D/g, "")),
  })

  async function handlePost(e: any) {
    e.preventDefault()
    if (!userId) return

    const seats = parseInt(form.seats, 10) || 0
    const slots = parseInt(form.parcel_slots, 10) || 0
    if (form.from_city === form.to_city) return alert("From and To must be different")
    if (seats > 30) return alert("Seats can be at most 30")
    if (slots > 20) return alert("Parcel slots can be at most 20")
    if (seats <= 0 && slots <= 0) return alert("Offer at least one seat or one parcel slot")
    if (seats > 0 && !form.seat_price) return alert("Enter the price per seat")
    if (slots > 0 && !form.parcel_fee) return alert("Enter the parcel fee")

    const departAt = new Date(`${form.date}T${form.time}`)
    if (isNaN(departAt.getTime())) return alert("Choose a valid date and time")
    if (departAt.getTime() < Date.now()) return alert("Departure must be in the future")

    const stops = form.stops.split(",").map(s => s.trim()).filter(Boolean)

    setLoading(true)
    const { error } = await supabase.from("trips").insert({
      driver_id: userId,
      from_city: form.from_city,
      to_city: form.to_city,
      stops,
      depart_at: departAt.toISOString(),
      seats_total: seats,
      seats_available: seats,
      parcel_slots_total: slots,
      parcel_slots_available: slots,
      seat_price_mwk: seats > 0 ? Number(form.seat_price) : null,
      parcel_fee_mwk: slots > 0 ? Number(form.parcel_fee) : null,
      notes: form.notes.trim() || null,
    })
    setLoading(false)

    if (error) {
      alert("Error: " + error.message)
      return
    }
    router.push("/marketplace")
  }

  const Shell = ({ children }: { children: any }) => (
    <div className="min-h-screen bg-[#fcfaf8] text-black">
      <header className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[720px] mx-auto px-4 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0a84ff] grid place-items-center text-white font-black">T</div>
            <span className="font-black text-[18px]">Tumani</span>
          </Link>
          <Link href="/marketplace" className="h-[40px] px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[13px]">
            Marketplace
          </Link>
        </div>
      </header>
      <main className="max-w-[720px] mx-auto px-4 py-8">{children}</main>
    </div>
  )

  if (access === "checking") {
    return <Shell><p className="text-[13px] opacity-60">Loading...</p></Shell>
  }

  if (access === "loggedOut") {
    return (
      <Shell>
        <div className="bg-white border border-black/10 rounded-[24px] p-8 text-center shadow-sm">
          <h1 className="font-black text-[24px]">Log in to post a trip</h1>
          <p className="mt-2 text-[13px] text-black/60">Only verified drivers can post trips.</p>
          <Link href="/login?next=/post" className="mt-6 block h-[48px] leading-[48px] rounded-full bg-black text-white font-black text-[14px]">Log in</Link>
        </div>
      </Shell>
    )
  }

  if (access === "notApproved") {
    return (
      <Shell>
        <div className="bg-white border border-black/10 rounded-[24px] p-8 text-center shadow-sm">
          <h1 className="font-black text-[24px]">Verified drivers only</h1>
          <p className="mt-2 text-[13px] text-black/60">
            Your account is not an approved driver yet. Apply, or check your application status.
          </p>
          <Link href="/apply-driver" className="mt-6 block h-[48px] leading-[48px] rounded-full bg-black text-white font-black text-[14px]">
            Apply / check status
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <h1 className="font-black text-[32px] tracking-tight leading-[0.9]">Post a trip</h1>
      <p className="mt-2 text-[13px] font-medium text-black/60">
        Customers request seats in the app. You confirm or decline each request.
      </p>

      <form onSubmit={handlePost} className="mt-8 bg-white border border-black/10 rounded-[24px] p-6 md:p-8 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>FROM</label>
            <select value={form.from_city} onChange={e => set("from_city", e.target.value)} className={fieldCls}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>TO</label>
            <select value={form.to_city} onChange={e => set("to_city", e.target.value)} className={fieldCls}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>STOPS ON THE WAY (OPTIONAL)</label>
          <input
            placeholder="Dedza, Ntcheu, Balaka"
            autoComplete="off"
            value={form.stops}
            onChange={e => set("stops", e.target.value)}
            className={fieldCls}
          />
          <p className="mt-1 text-[11px] text-black/40">Separate towns with commas. People along the route can join.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>DATE</label>
            <input type="date" required min={new Date().toISOString().split("T")[0]} value={form.date} onChange={e => set("date", e.target.value)} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>TIME</label>
            <input type="time" required value={form.time} onChange={e => set("time", e.target.value)} className={fieldCls} />
          </div>
        </div>

        <div className="h-[1px] bg-black/10 my-2"></div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>SEATS OFFERED</label>
            <input {...num("seats")} placeholder="3" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>PRICE PER SEAT (MK)</label>
            <input {...num("seat_price")} placeholder="25000" className={fieldCls} />
            {form.seat_price && <p className="mt-1 text-[11px] text-black/40">MK {Number(form.seat_price).toLocaleString()}</p>}
          </div>
          <div>
            <label className={labelCls}>PARCEL SLOTS</label>
            <input {...num("parcel_slots")} placeholder="0" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>PARCEL FEE (MK)</label>
            <input {...num("parcel_fee")} placeholder="3500" className={fieldCls} />
            {form.parcel_fee && <p className="mt-1 text-[11px] text-black/40">MK {Number(form.parcel_fee).toLocaleString()}</p>}
          </div>
        </div>

        <div>
          <label className={labelCls}>NOTES (OPTIONAL)</label>
          <input
            placeholder="Leaving from Area 3 bus depot, luggage welcome"
            autoComplete="off"
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
            className={fieldCls}
          />
        </div>

        <button disabled={loading} className="w-full h-[52px] rounded-full bg-black text-white font-black text-[14px] mt-4 disabled:opacity-50">
          {loading ? "Posting..." : "Post trip"}
        </button>
      </form>
    </Shell>
  )
}