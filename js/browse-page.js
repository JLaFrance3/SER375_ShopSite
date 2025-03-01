//load products for product grid on browse page
async function loadItems() {
    const numItems = document.getElementById("num-items");
    const productGrid = document.getElementById("product-grid");

    // Get JSON
    const response = await fetch('http://67.205.143.29:3000/products');
    const products = await response.json();

    //Sort products by name alphabetically
    products.sort((a, b) => {
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
        }
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
        }
        return 0;
    });

    let productCounter = 0;
    products.forEach((product, index) => {
        productCounter++;

        //Create star rating
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(product.ratingAverage)) {
                stars += createStar(index * 10 + i);
            }
            else {
                if (i >= Math.ceil(product.ratingAverage)) {
                    stars += createStar(index * 10 + i, 0);
                }
                else {
                    stars += createStar(index * 10 + i, (product.ratingAverage % 1) * 100);
                }
            }
        }

        //Calculate price after percentage discount. If no discount
        const price = product.price - product.price * (product.discount / 100)

        //Create product card
        productGrid.innerHTML += `
            <div class="product-card">
                <div class="product-image-container">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.images[0]}" alt="Picture of ${product.description}" draggable="false">
                    </a>
                </div>
                <div class="product-details">
                    <a href="product.html?id=${product.id}">
                        <h4>${product.name}</h4>
                    </a>
                    <div class="star-rating">
                        ${stars}
                    </div>
                    <p>
                        ${price.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        })}
                    </p>
                </div>
            </div>
        `;
    });

    //Update numItems on page
    numItems.innerText = productCounter;
}

loadItems();