import "./globals.css"
export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html><body className="bg-[#f6f7f9] text-black">
      <header className="h-[64px] bg-white border-b-2 border-black/10 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-[16px]">T</div><span className="font-black text-[20px] text-black">Tumani</span></div>
        <div className="flex gap-2"><a href="/marketplace" className="font-black text-[14px] text-black px-4 py-2">Marketplace</a><a href="/post" className="bg-blue-600 text-white font-black px-6 py-2.5 rounded-full text-[14px]">+ Post</a></div>
      </header>
      {children}
    </body></html>
  )
}