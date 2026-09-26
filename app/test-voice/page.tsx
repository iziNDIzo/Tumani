"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TestVoicePage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setSent(false);
    setError("");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = handleStop;

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setRecording(false);
  };

  const handleStop = async () => {
    setLoading(true);
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setTranscript(data.text || data.error || "No transcript returned");
    setLoading(false);
  };

  const sendAlert = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Location not supported on this device");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("You must be logged in to send an alert");
          return;
        }

        const { error: insertError } = await supabase
          .from("breakdown_alerts")
          .insert({
            driver_id: user.id,
            driver_name: user.email, // swap for a real name field if you have one
            latitude,
            longitude,
            transcript,
            status: "open",
          });

        if (insertError) {
          setError(insertError.message);
        } else {
          setSent(true);
        }
      },
      (err) => {
        setError("Could not get location: " + err.message);
      }
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Voice Test</h1>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {loading && <p>Transcribing...</p>}

      {transcript && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Transcript:</strong>
          <p>{transcript}</p>
          <button onClick={sendAlert} disabled={sent}>
            {sent ? "Alert Sent ✅" : "Send Alert"}
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}