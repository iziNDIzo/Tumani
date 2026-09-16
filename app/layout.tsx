import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f7f9] text-black antialiased">
        {/* SINGLE HEADER - WHITE */}
        <header className="h-[68px] bg-white border-b-2 border-black/10 flex items-center justify-between px-5 md:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-[16px]">T</div>
            <span className="font-black text-[21px] text-black tracking-tight">Tumani</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/marketplace" className="font-black text-[14px] text-black px-4 py-2">Marketplace</a>
            <a href="/post" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2.5 rounded-full text-[14px]">+ Post</a>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}