console.log("ScentSpace loaded…");

// Container hvor produkterne skal vises
const containers = document.querySelectorAll(".product_list_container");

// Hent produkter fra DummyJSON API
fetch("https://dummyjson.com/products/category/fragrances")
  .then((res) => res.json())
  .then((data) => {
    console.log("Produkter hentet:", data.products);
    showProducts(data.products);
  })
  .catch((err) => console.error("Fejl ved hentning:", err));

// Funktion til at vise produkter
function showProducts(products) {
  containers.forEach((container) => {
    container.innerHTML = products
      .map((product) => {
        const discount = product.discountPercentage;
        const oldPrice = Math.round(product.price / (1 - discount / 100));
        const bgColors = ["pink", "beige", "sand", "light"];
        const bg = bgColors[Math.floor(Math.random() * bgColors.length)];

        return `
        <article class="produkt_kort" data-bg="${bg}">
          <div class="img_wrapper">
            <img src="${product.thumbnail}" alt="${product.title}">
          </div>
          <div class="produkt_info">
            <h3>${product.title}</h3>
            <p class="small">${product.brand || "Ukendt brand"}</p>
            ${discount > 0 ? `<p><span class="old_price">${oldPrice} DKK</span> <span class="price">${product.price} DKK</span></p>` : `<p class="price">${product.price} DKK</p>`}
          </div>
        </article>
      `;
      })
      .join("");

    //  Klik-event på kortene
    const productCards = container.querySelectorAll(".produkt_kort");
    productCards.forEach((card, index) => {
      const produkt = products[index];
      card.addEventListener("click", () => {
        window.location.href = `singleview.html?id=${produkt.id}`;
      });
    });
  });
}
