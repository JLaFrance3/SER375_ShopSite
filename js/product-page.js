const imgSelectorThumbnails = []
const selectedImage = document.getElementById('selected-image');
const productDetails = document.getElementById('product-details');

async function initializeProductPage(id) {
    const response = await fetch(`http://67.205.143.29:3000/products${id}`);
    const product = await response.json();
    console.log(product);
    //Fill image selector with available images
    const imageSelector = document.getElementById('product-image-selector');
    product.images.forEach(image => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = product.description;
        thumbnail.classList.add('unselected');
        imgSelectorThumbnails.push(thumbnail);
        imageSelector.appendChild(thumbnail);
    });

    //Default image selected
    selectedImage.alt = product.description
    selectedImage.src = imgSelectorThumbnails[0].src;
    imgSelectorThumbnails[0].classList.remove('unselected')
    imgSelectorThumbnails[0].classList.add('selected')

    //Create star rating
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(product.ratingAverage)) {
            stars += createStar(i);
        }
        else {
            if (i >= Math.ceil(product.ratingAverage)) {
                stars += createStar(i, 0);
            }
            else {
                stars += createStar(i, (product.ratingAverage % 1) * 100);
            }
        }
    }

    //Calculate price after discount. Set to 0 if discounted price less than 0.
    const price = (product.price - product.discount) > 0 ? (product.price - product.discount) : 0;

    //Create product info column
    productDetails.innerHTML += `
        <h2>${product.name}</h2>
        <p class="seller">${product.sellerName}</p>
        <p class="rating">
            ${product.ratingAverage}
            <span>${stars}</span>
            (${product.numberOfRatings} Ratings)
        </p>
        <p class="description">${product.description}</p>
        <h3>${price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            })}
        </h3>
        `;
}

const queryStringParams = new URLSearchParams(window.location.search);
const id = queryStringParams.get('id');
initializeProductPage(id);

