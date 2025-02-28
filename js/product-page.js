const imgSelectorThumbnails = []
const selectedImage = document.getElementById('selected-image');
const productDetails = document.getElementById('product-details');

async function initializeProductPage(id) {
    const response = await fetch(`http://67.205.143.29:3000/products${id}`);
    if (response.status === 404) {
        window.location.href = 'index.html';
        return;
    }

    const product = await response.json();

    //Fill image selector with available images
    const imageSelector = document.getElementById('product-image-selector');
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = product.description;
        thumbnail.classList.add('unselected');

        //Add event listener
        thumbnail.onmouseenter = () => {
            //Set all as 'unselected'
            imgSelectorThumbnails.forEach(selection => {
                selection.classList.remove('selected')
                selection.classList.add('unselected')
            });
            //Set event thumbnail as 'selected
            thumbnail.classList.add('selected')
            thumbnail.classList.remove('unselected')
            selectedImage.src = thumbnail.src;
        };

        //Track thumbnails for user selection
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
    
    //Determine whether there is a discounted price
    const hasDiscount = product.discount > 0;
    let displayPrice;

    //Strikethrough old price when there is a discounted price
    if (hasDiscount) {
        const discountedPrice = product.price - product.price * (product.discount / 100);
        displayPrice = `
            <s>
                ${product.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                })}
            </s>
            ${discountedPrice.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            })}
        `;
    }
    else {
        displayPrice = `
            ${product.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            })}
        `;
    }

    //Create product info column
    productDetails.innerHTML += `
        <h2>${product.name}</h2>
        <p class="seller">${product.sellerName}</p>
        <div class="rating">
            <p>${product.ratingAverage}</p>
            <span>${stars}</span>
            <p>(${product.numberOfRatings} Ratings)</p>
        </div>
        <p class="description">${product.description}</p>
        <h3>${displayPrice}</h3>
    `;
}

const queryStringParams = new URLSearchParams(window.location.search);
const id = queryStringParams.get('id');
console.log(id)
if (id !== null && id.length > 1) {
    initializeProductPage(id);
}
else {
    window.location.href = 'index.html';
}

