// productlist.js
const grid = document.querySelector(".produkt_grid");
if (!grid) return;

const sortInputs = document.querySelectorAll('input[name="sort"]');
let allProducts = [];

(async function loadProducts() {
  try {
    const res = await fetch("https://dummyjson.com/products/category/fragrances");
    const data = await res.json();
    allProducts = data.products;
    render(allProducts);
  } catch (err) {
    console.error("Fejl ved hentning:", err);
    grid.innerHTML = "<p>Kunne ikke hente produkter.</p>";
  }
})();

function render(list) {
  const bg = ["pink", "beige", "sand", "light"];
  grid.innerHTML = list.map((p, i) => `
    <article class="produkt_kort" data-bg="${bg[i % bg.length]}">
      <div class="img_wrapper">
        <img src="${p.thumbnail}" alt="${p.title}">
      </div>
      <div class="produkt_info">
        <h3>${p.title}</h3>
        <p class="small">${p.brand}</p>
        <p>
          <span class="price">${p.price} DKK</span>
        </p>
      </div>
    </article>
  `).join("");
}

sortInputs.forEach((input) => {
  input.addEventListener("change", () => {
    let sorted = [...allProducts];
    if (input.value === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (input.value === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (input.value === "name-asc") sorted.sort((a, b) => a.title.localeCompare(b.title));
    render(sorted);
  });
});
