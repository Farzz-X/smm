import fetch from "node-fetch";

export default async function handler(req, res) {
  const { order_id, amount } = req.query;

  try {
    const r = await fetch(
      `https://app.pakasir.com/api/transactiondetail?project=${process.env.PAKASIR_PROJECT}&amount=${amount}&order_id=${order_id}&api_key=${process.env.PAKASIR_API_KEY}`
    );
    const data = await r.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Gagal cek status" });
  }
}