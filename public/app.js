const servicesEl = document.getElementById("services");
const qrImg = document.getElementById("qr");
const payRes = document.getElementById("payRes");
const statusEl = document.getElementById("status");
const priceEl = document.getElementById("price");

let currentOrderId = null;
let currentAmount = null;
let currentMeta = null;

async function loadServices() {
  const r = await fetch("/api/services");
  const data = await r.json();
  servicesEl.innerHTML = data.map(s =>
    `<option value="${s.service}" data-rate="${s.rate}">
      ${s.category} - ${s.name} | min ${s.min} max ${s.max}
    </option>`
  ).join("");
}
loadServices();

document.getElementById("payBtn").onclick = async () => {
  const service = servicesEl.value;
  const rate = Number(servicesEl.selectedOptions[0].dataset.rate);
  const qty = Number(document.getElementById("qty").value);
  const link = document.getElementById("link").value;

  if (!service || !qty || !link) return alert("Lengkapi data");

  const price = Math.ceil((rate * qty) / 1000);
  const fee = 317; // contoh fee
  const total = price + fee;

  priceEl.textContent = `Harga: Rp${price} + Fee Rp${fee} = Total Rp${total}`;

  const order_id = "ORD" + Date.now();
  currentOrderId = order_id;
  currentAmount = total;
  currentMeta = { service, link, quantity: qty };

  const r = await fetch("/api/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: total, order_id })
  });
  const data = await r.json();
  payRes.textContent = JSON.stringify(data, null, 2);

  if (data?.data?.qr_string) {
    qrImg.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
      encodeURIComponent(data.data.qr_string);
  } else {
    alert("QR tidak tersedia, cek response");
  }
};

document.getElementById("checkBtn").onclick = async () => {
  if (!currentOrderId) return alert("Belum ada order");

  const r = await fetch(`/api/pay-status?order_id=${currentOrderId}&amount=${currentAmount}`);
  const data = await r.json();
  statusEl.textContent = JSON.stringify(data);

  if (data?.status === "PAID") {
    const or = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentMeta)
    });
    const od = await or.json();
    alert("Order terkirim: " + JSON.stringify(od));
  } else {
    alert("Belum PAID");
  }
};
