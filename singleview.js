console.log("Singleview loaded...");

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Hent ét produkt direkte fra API
  fetch(`https://dummyjson.com/products/${id}`)
    .then((res) => res.json())
    .then(showProduct);
});

function showProduct(produkt) {
  console.log("Viser produkt:", produkt);

  // Sæt data ind i HTML
  document.querySelector(".product_image img").src = produkt.thumbnail;
  document.querySelector(".product_image img").alt = produkt.title;
  document.querySelector(".product_info h1").textContent = produkt.title;
  document.querySelector(".product_info h2").textContent = produkt.description;

  // Pris og evt. discount
  const priceEl = document.querySelector(".price");
  const oldPriceEl = document.querySelector(".old_price");

  if (produkt.discountPercentage > 0) {
    const oldPrice = Math.round(produkt.price / (1 - produkt.discountPercentage / 100));
    oldPriceEl.textContent = oldPrice + " DKK";
    priceEl.textContent = produkt.price + " DKK";
  } else {
    oldPriceEl.textContent = "";
    priceEl.textContent = produkt.price + " DKK";
  }

  document.querySelector(".small").textContent = produkt.brand + " - " + produkt.stock + " stk på lager";
  document.querySelector(".product_reviews p").textContent = `★ ${produkt.rating} / 5`;
}
