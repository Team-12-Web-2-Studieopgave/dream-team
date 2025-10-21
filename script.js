fetch('produkter.json')
  .then(response => response.json())
  .then(data => {
    const products = data.products;
    const grid = document.querySelector('.produkt_grid');

    // Clear any existing content
    grid.innerHTML = '';

    // Loop through each product
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('produkt_info');

      productDiv.innerHTML = `
        <div class="produkt">
          <img src="${product.thumbnail}" alt="${product.title}">
        </div>
        <h1 class="p-title">${product.brand} - ${product.title}</h1>
        <h2 class="p-info">${product.description}</h2>
        <h3 class="p-price">${product.price} USD</h3>
        <button>Køb</button>
      `;

      grid.appendChild(productDiv);
    });
  })