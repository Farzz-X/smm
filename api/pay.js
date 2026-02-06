import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount, order_id } = req.body;

  try {
    const r = await fetch("https://app.pakasir.com/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: process.env.PAKASIR_PROJECT,
        api_key: process.env.PAKASIR_API_KEY,
        order_id,
        amount
      })
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "QR gagal dibuat" });
  }
}