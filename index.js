console.log("ScentSpace loaded...");

// Brug DummyJSON som fælles API
const API_URL = "https://dummyjson.com/products/category/fragrances";

// Elementer
const catalogGrid = document.querySelector(".produkt_grid");               // Katalogside
const homeLists   = document.querySelectorAll(".product_list_container");  // Forside
const sortInputs  = document.querySelectorAll('input[name="sort"]');

let allProducts = [];

// --- HENT PRODUKTER ---
(async function init() {
  try {
    const r = await fetch(API_URL, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const data = await r.json();
    allProducts = Array.isArray(data.products) ? data.products : [];

    // Katalog-side
    if (catalogGrid) {
      renderCatalog(allProducts);
      const initial = document.querySelector('input[name="sort"]:checked')?.value || "price-asc";
      applySort(initial);
    }

    // Forside
    if (homeLists.length) {
      hydrateHomeCards(allProducts);
    }

  } catch (err) {
    console.error("Fejl ved hentning:", err);
    if (catalogGrid) catalogGrid.innerHTML = "<p style='padding:1rem;'>Kunne ikke hente produkter.</p>";
  }
})();

/* ========= KATALOG ========= */
function renderCatalog(list) {
  const bg = ["pink", "beige", "sand", "light"];
  catalogGrid.innerHTML = list.map((p, i) => {
    const img = p.thumbnail || (p.images?.[0]) || "";
    const discount = p.discountPercentage || 0;
    const oldPrice = discount ? Math.round(p.price / (1 - discount / 100)) : null;

    return `
      <article class="produkt_kort" data-bg="${bg[i % bg.length]}" data-id="${p.id}">
        <div class="img_wrapper">
          <img src="${img}" alt="${escapeHtml(p.title)}"
               loading="lazy" referrerpolicy="no-referrer"
               onerror="this.onerror=null;this.src='img/produktbillede.jpg'">
        </div>
        <div class="produkt_info">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="small">${escapeHtml(p.brand || "Ukendt")}</p>
          <p>
            ${oldPrice ? `<span class="old_price">${formatPrice(oldPrice)} DKK</span>` : ""}
            <span class="price">${formatPrice(p.price)} DKK</span>
          </p>
        </div>
      </article>
    `;
  }).join("");
}

// Klik til singleview på kataloget
if (catalogGrid) {
  catalogGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".produkt_kort");
    if (!card) return;
    const id = card.dataset.id;
    if (id) window.location.href = `singleview.html?id=${encodeURIComponent(id)}`;
  });

  // Sortering
  sortInputs.forEach((input) =>
    input.addEventListener("change", () => applySort(input.value))
  );
}

function applySort(mode) {
  const sorted = [...allProducts];
  if (mode === "price-asc")  sorted.sort((a, b) => a.price - b.price);
  if (mode === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (mode === "name-asc")   sorted.sort((a, b) => a.title.localeCompare(b.title, "da", { sensitivity: "base" }));
  renderCatalog(sorted);
}

/* ========= FORSIDE ========= */
function hydrateHomeCards(products) {
  if (!products.length) return;

  let i = 0;
  homeLists.forEach(list => {
    list.querySelectorAll(".produkt_kort").forEach(card => {
      const p = products[i % products.length];
      i++;

      // Gem ID til klik
      card.dataset.id = p.id;

      // Billede
      const imgEl = card.querySelector(".img_wrapper img");
      if (imgEl) {
        imgEl.src = p.thumbnail || (p.images?.[0]) || imgEl.src || "img/produktbillede.jpg";
        imgEl.alt = p.title || imgEl.alt || "Produkt";
        imgEl.loading = "lazy";
        imgEl.referrerPolicy = "no-referrer";
        imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = "img/produktbillede.jpg"; };
      }

      // Tekst / pris
      const h3 = card.querySelector(".produkt_info h3");
      if (h3) h3.textContent = p.title;
      const small = card.querySelector(".produkt_info .small");
      if (small) small.textContent = p.brand || "Ukendt";
      const price = card.querySelector(".produkt_info .price");
      if (price) price.textContent = `${formatPrice(p.price)} DKK`;
      const old = card.querySelector(".produkt_info .old_price");
      if (old) {
        const discount = p.discountPercentage || 0;
        const oldPrice = discount ? Math.round(p.price / (1 - discount / 100)) : null;
        old.textContent = oldPrice ? `${formatPrice(oldPrice)} DKK` : "";
      }
    });
  });
}

// Klik på kort → singleview (forside)
if (homeLists.length) {
  homeLists.forEach(list => {
    list.addEventListener("click", (e) => {
      const card = e.target.closest(".produkt_kort");
      if (!card) return;
      const id = card.dataset.id;
      if (id) window.location.href = `singleview.html?id=${encodeURIComponent(id)}`;
    });
  });
}

/* ========= HELPERS ========= */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function formatPrice(n) {
  return (Number(n) || 0).toLocaleString("da-DK");
}
