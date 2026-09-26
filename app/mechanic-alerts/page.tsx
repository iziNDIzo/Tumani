"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../../lib/supabaseClient"

const timeAgo = (x: string) => {
  const diffMs = Date.now() - new Date(x).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return new Date(x).toLocaleDateString([], { day: "numeric", month: "short" })
}

export default function MechanicAlerts() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [msg, setMsg] = useState("")

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(""), 4000)
  }

  const fetchAlerts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("breakdown_alerts")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
    if (error) flash("❌ " + error.message)
    setAlerts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const claimAlert = async (id: string) => {
    setClaimingId(id)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      flash("❌ You must be logged in")
      setClaimingId(null)
      return
    }
    const { error } = await supabase
      .from("breakdown_alerts")
      .update({ status: "claimed", claimed_by: user.id })
      .eq("id", id)

    setClaimingId(null)
    if (error) {
      flash("❌ " + error.message)
      return
    }
    flash("✅ Job claimed — driver has been notified")
    fetchAlerts()
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-black">
      <header className="sticky top-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[720px] mx-auto px-4 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0a84ff] grid place-items-center text-white font-black">T</div>
            <span className="font-black text-[18px]">Tumani</span>
          </Link>
          <span className="h-[40px] px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[13px]">
            Mechanic
          </span>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-black text-[32px] tracking-tight leading-[0.9]">Breakdown alerts</h1>
          <button
            onClick={fetchAlerts}
            className="h-[40px] px-5 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[13px]"
          >
            Refresh
          </button>
        </div>
        <p className="mt-2 text-[13px] text-black/60">
          {loading
            ? "Loading..."
            : alerts.length > 0
            ? `${alerts.length} driver${alerts.length > 1 ? "s" : ""} ${alerts.length > 1 ? "need" : "needs"} help nearby`
            : "No open alerts right now"}
        </p>

        {msg && <div className="mt-4 bg-black text-white text-[13px] font-black text-center py-2 rounded-full">{msg}</div>}

        <div className="mt-6 space-y-3">
          {!loading && alerts.length === 0 && (
            <div className="bg-white border border-black/10 rounded-[20px] p-8 text-center">
              <p className="text-[14px] font-black">All clear 🎉</p>
              <p className="mt-1 text-[13px] text-black/60">You'll see a card here the moment a driver reports a breakdown.</p>
            </div>
          )}

          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white border-l-4 border-red-600 border-t border-r border-b border-black/10 rounded-[20px] p-4"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="font-black text-[15px]">{alert.driver_name}</div>
                  <div className="text-[12px] opacity-60">{timeAgo(alert.created_at)}</div>
                </div>
                <span className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-[10px] font-black uppercase">
                  Breakdown
                </span>
              </div>

              <p className="mt-3 text-[14px] leading-snug">
                <span className="font-black">Issue: </span>
                {alert.transcript}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-[36px] px-4 grid place-items-center rounded-full border-[1.5px] border-black font-black text-[12px]"
                >
                  📍 View on map
                </a>
                <button
                  disabled={claimingId === alert.id}
                  onClick={() => claimAlert(alert.id)}
                  className="h-[36px] px-4 rounded-full bg-black text-white text-[12px] font-black disabled:opacity-50"
                >
                  {claimingId === alert.id ? "Claiming..." : "Claim this job"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}