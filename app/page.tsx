import Link from "next/link"

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 py-8 md:py-10">
        {/* HERO */}
        <div className="max-w-[720px] mt-2">
          <h1 className="font-black text-[42px] md:text-[68px] leading-[0.95] tracking-[-0.05em] text-black">
            Send anything,<br/>
            go <span className="relative inline-block">anywhere<span className="absolute -bottom-1 left-0 w-full h-[8px] bg-[#f3e8ff] -z-10"></span><span className="text-[#7c3aed]">.</span></span>
          </h1>
          <p className="font-medium text-[15px] md:text-[16px] text-black/60 mt-5 leading-[1.5] max-w-[520px]">
            Malawi's trusted network of reliable drivers. Connecting customers who want to send parcels, book rides, run errands — with verified drivers posting trips daily.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-8 bg-white border border-black/10 rounded-[20px] p-2 flex flex-col md:flex-row gap-2 max-w-[720px] shadow-[0_8px_32px_rgba(124,58,237,0.06)]">
          <input placeholder="Where from? e.g. Salima" className="flex-1 bg-[#f8f7ff] rounded-[12px] px-4 py-3.5 font-semibold text-[14px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/20 transition-all" />
          <input placeholder="Where to? e.g. Lilongwe" className="flex-1 bg-[#f8f7ff] rounded-[12px] px-4 py-3.5 font-semibold text-[14px] text-black outline-none placeholder:text-black/40 focus:bg-white focus:ring-2 focus:ring-[#7c3aed]/20 transition-all" />
          <Link href="/marketplace" className="bg-black text-white font-black px-8 py-3.5 rounded-[12px] text-[14px] text-center hover:bg-[#7c3aed] transition-colors">Search</Link>
        </div>

        {/* 4 CARDS - PERFECTED */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px]">

          <Link href="/send" className="group bg-white border border-black/[0.08] rounded-[20px] p-6 hover:border-[#7c3aed]/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.08)] transition-all">
            <div className="w-12 h-12 bg-[#f5f3ff] group-hover:bg-[#ede9fe] rounded-[12px] flex items-center justify-center text-[22px] transition-colors">📦</div>
            <h3 className="font-black text-[18px] text-black mt-5 group-hover:text-[#7c3aed] transition-colors">Send Parcel</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1.5 leading-[1.4]">From documents to packages. Get instant tracking code TUM-XXXXX</p>
            <p className="font-black text-[13px] text-black mt-4 flex items-center gap-1">From MK 5,000 <span className="group-hover:translate-x-1 transition-transform">→</span></p>
          </Link>

          <Link href="/marketplace" className="group bg-white border border-black/[0.08] rounded-[20px] p-6 hover:border-[#7c3aed]/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.08)] transition-all">
            <div className="w-12 h-12 bg-[#f0fdf4] group-hover:bg-[#dcfce7] rounded-[12px] flex items-center justify-center text-[22px] transition-colors">🚗</div>
            <h3 className="font-black text-[18px] text-black mt-5 group-hover:text-[#7c3aed] transition-colors">Book a Ride</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1.5 leading-[1.4]">Seats with trusted drivers leaving today across Malawi</p>
            <p className="font-black text-[13px] text-black mt-4 flex items-center gap-1">See trips <span className="group-hover:translate-x-1 transition-transform">→</span></p>
          </Link>

          <Link href="/errands" className="group bg-white border border-black/[0.08] rounded-[20px] p-6 hover:border-[#7c3aed]/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.08)] transition-all">
            <div className="w-12 h-12 bg-[#fffbeb] group-hover:bg-[#fef3c7] rounded-[12px] flex items-center justify-center text-[22px] transition-colors">🏃</div>
            <h3 className="font-black text-[18px] text-black mt-5 group-hover:text-[#7c3aed] transition-colors">Send Errand</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1.5 leading-[1.4]">Let an online driver buy, collect, or queue for you</p>
            <p className="font-black text-[13px] text-black mt-4 flex items-center gap-1">Post errand <span className="group-hover:translate-x-1 transition-transform">→</span></p>
          </Link>

          <Link href="/track" className="group bg-[#faf5ff] border border-[#7c3aed]/15 rounded-[20px] p-6 hover:border-[#7c3aed]/40 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)] transition-all">
            <div className="w-12 h-12 bg-white border border-[#7c3aed]/10 rounded-[12px] flex items-center justify-center text-[22px]">📍</div>
            <h3 className="font-black text-[18px] text-black mt-5">Track Parcel</h3>
            <p className="font-medium text-[13px] text-black/60 mt-1.5 leading-[1.4]">Enter TUM-XXXXX to see live status updates</p>
            <p className="font-black text-[13px] text-[#7c3aed] mt-4 flex items-center gap-1">Track now <span className="group-hover:translate-x-1 transition-transform">→</span></p>
          </Link>

        </div>

        {/* FOOTER TRUST */}
        <div className="mt-12 flex flex-wrap gap-6 font-semibold text-[12px] text-black/40">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full"></span> Verified drivers</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full"></span> Plate checked</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full"></span> Real-time tracking</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full"></span> Malawi-wide</span>
        </div>
      </main>
    </div>
  )
}