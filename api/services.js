import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const r = await fetch("https://indosmm.id/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.INDOSMM_API_KEY,
        action: "services"
      })
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Gagal ambil layanan" });
  }
}