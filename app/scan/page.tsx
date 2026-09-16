'use client';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [message, setMessage] = useState('Scan a parcel QR code');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader', // ID of div
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    const onScanSuccess = async (decodedText: string) => {
      scanner.clear(); // Stop scanning
      setScanResult(decodedText);
      setMessage(`Scanned: ${decodedText}. Updating...`);
      await updateParcelStatus(decodedText);
    };

    const onScanError = (errorMessage: string) => {
      // This fires constantly while scanning. We ignore it
    };

    scanner.render(onScanSuccess, onScanError); // <-- 2 ARGS NOW

    return () => { 
      scanner.clear().catch(error => console.error("Failed to clear scanner", error)); 
    };
  }, []);

  const updateParcelStatus = async (trackingId: string) => {
    try {
      // 1. Find the parcel by trackingId
      const q = query(collection(db, "parcels"), where("trackingId", "==", trackingId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage("Error: Parcel not found");
        return;
      }

      const parcelDoc = querySnapshot.docs[0];
      const parcelData = parcelDoc.data();
      const currentStatus = parcelData.status;
      
      // 2. Logic: Booked -> Accepted -> On Bus -> Delivered
      let nextStatus = '';
      if (currentStatus === 'Booked') nextStatus = 'Accepted';
      else if (currentStatus === 'Accepted') nextStatus = 'On Bus';
      else if (currentStatus === 'On Bus') nextStatus = 'Delivered';
      else {
        setMessage(`Parcel already ${currentStatus}`);
        return;
      }

      // 3. Update only status. This is allowed by our rules
      await updateDoc(doc(db, "parcels", parcelDoc.id), {
        status: nextStatus
      });

      setMessage(`Success! Status updated to: ${nextStatus}`);

    } catch (error) {
      console.error("Error updating status: ", error);
      setMessage("Error: Could not update. Check rules.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">Tumani Parcels</Link>
          <Link href="/driver" className="text-gray-700 hover:text-blue-600">Driver Dashboard</Link>
        </div>
      </nav>
      
      <div className="max-w-md mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver QR Scanner</h1>
        <p className="text-gray-600 mb-4 font-semibold">{message}</p>
        
        <div id="reader" className="rounded-lg overflow-hidden shadow-lg border-4 border-blue-500"></div>

        {scanResult && (
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700"
          >
            Scan Next Parcel
          </button>
        )}
      </div>
    </main>
  );
}