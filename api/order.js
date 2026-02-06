import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { service, link, quantity } = req.body;

  try {
    const r = await fetch("https://indosmm.id/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.INDOSMM_API_KEY,
        action: "add",
        service,
        link,
        quantity
      })
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Order gagal" });
  }
}
