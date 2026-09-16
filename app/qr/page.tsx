export default function QRConfirm() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* NAV WITH BACK */}
      <nav className="bg-white shadow-sm sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <a href="/" className="text-gray-600 hover:text-blue-600 font-semibold">← Back</a>
          <h1 className="text-2xl font-bold text-blue-600">Tumani Parcels</h1>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-700 mb-6">Show this QR at Lilongwe Bus Depot</p>

          {/* QR CODE BOX - FIXED COLORS */}
          <div className="bg-gray-100 border-2 border-dashed border-gray-400 rounded-xl w-48 h-48 mx-auto mb-6 flex items-center justify-center">
            <p className="text-gray-800 font-extrabold text-lg">QR: TUM123XYZ</p>
          </div>

          {/* DETAILS BOX - FIXED COLORS */}
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-gray-800 mb-1"><span className="font-bold text-gray-900">Trip:</span> Lilongwe → Salima</p>
            <p className="text-sm text-gray-800 mb-1"><span className="font-bold text-gray-900">Bus:</span> KM 123 @ 08:30 AM</p>
            <p className="text-sm text-gray-800"><span className="font-bold text-gray-900">Tracking:</span> #TUM123XYZ</p>
          </div>

          <a href="/track" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mb-3">
            Track Parcel
          </a>
          <a href="/" className="block text-gray-700 font-semibold hover:text-blue-600">Done</a>
        </div>
      </div>
    </main>
  );
}