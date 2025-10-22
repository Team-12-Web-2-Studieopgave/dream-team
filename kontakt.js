// kontakt.js – håndterer sælg-formularen
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#sell-form");
  const statusEl = document.querySelector("#sell-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sender…";

    const fd = new FormData(form);
    const payload = {
      title: fd.get("name"),
      brand: fd.get("brand"),
      description: fd.get("description"),
      price: fd.get("price"),
      imageFile: form.querySelector('input[name="image"]').files[0] || null
    };

    try {
      // DEMO-call – byt til jeres rigtige API, fx POST /api/products med FormData
      console.log("Opretter annonce:", payload);
      await new Promise((r) => setTimeout(r, 600));
      statusEl.textContent = "✅ Annonce oprettet (demo).";
      form.reset();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "❌ Fejl: " + (err.message || "Uventet fejl");
    }
  });
});
