const productContainer = document.createElement("div");
productContainer.id = "productContainer";
document.body.appendChild(productContainer);

const searchContainer = document.createElement("div");
searchContainer.id = "searchContainer";
document.body.appendChild(searchContainer);

const searchBox = document.querySelector(".sms");
const searchBtn = document.querySelector(".search-btn");

let products = [];

fetch("https://fakestoreapi.com/products")
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts(products.slice(0, 10)); 
    console.log("Products Loaded:", products);
  })
  .catch(error => console.error("Error loading products:", error));

const displayProducts=(productList)=> {
    productContainer.innerHTML = "";
    productContainer.style.width = "50%";
    productContainer.style.display = "flex";
    productContainer.style.flexWrap = "wrap";
    productContainer.style.justifyContent = "center";
    productContainer.style.marginTop = "20px";
    productContainer.style.gap = "10px";
    productContainer.style.float = "left";

    productList.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.style.border = "1px solid #ddd";
        productElement.style.padding = "10px";
        productElement.style.width = "200px";
        productElement.style.textAlign = "center";
        productElement.style.borderRadius = "10px";
        productElement.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.1)";

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" style="width: 100px; height: 100px; object-fit: cover;">
            <h3 style="font-size: 16px; margin: 10px 0;">${product.title.slice(0,10)}</h3>
            <p>$${product.price}</p>
            <button type="button" onclick="SingleProduct(${product.id})">Details</button>
            <button onclick="handleAddToCart('${product.image}', '${product.title.slice(0, 12)}', '${product.price}')"> Add To Cart </button>
        `;
        productContainer.appendChild(productElement);
    });
}

const displaySearchResults=(productList)=> {
    searchContainer.innerHTML = "";
    searchContainer.style.width = "20%";
    searchContainer.style.display = "flex";
    searchContainer.style.flexWrap = "wrap";
    searchContainer.style.justifyContent = "center";
    searchContainer.style.marginRight = "20%";
    searchContainer.style.gap = "10px";
    searchContainer.style.float = "right";

    productList.slice(0, 5).forEach(product => { 
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.style.border = "1px solid #ddd";
        productElement.style.padding = "10px";
        productElement.style.width = "180px";
        productElement.style.textAlign = "center";
        productElement.style.borderRadius = "10px";
        productElement.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.1)";

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" style="width: 80px; height: 80px; object-fit: cover;">
            <h4 style="font-size: 14px; margin: 10px 0;">${product.title.slice(0, 15)}...</h4>
            <p>$${product.price}</p>
            <button onclick="handleAddToCart('${product.image}', '${product.title.slice(0, 12)}', '${product.price}')"> Add To Cart </button>
        `;
        searchContainer.appendChild(productElement);
    });
}
function searchProducts() {
    const searchText = searchBox.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchText)
    );
    displaySearchResults(filteredProducts);
}
const handleAddToCart = (PD_Image, PD_Name, PD_Price) => {
    const CountCard = document.getElementById("count").innerText;
    let count = parseInt(CountCard) + 1;
    document.getElementById("count").innerText = count;

    const container = document.getElementById("cart-main-container");

    const div = document.createElement("div");
    div.classList.add("Cart-Info");
    if(count > 11){
        alert("Sorry,You can't selected more product upto 11");
        return 0;
    }
    div.innerHTML = `
          <img class="cart-img" src=${PD_Image} alt=""/>
        <p> ${PD_Name}</p>
        <h3 class="price"> ${PD_Price}</h3>
    `;
    container.appendChild(div);
    UpdateTotal();
};

const SingleProduct = (id) => {
    const modal = document.getElementById("productModal");
    const modalBody = document.querySelector(".modal-body");

    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(response => response.json())
        .then(data => {
            modalBody.innerHTML = `
                <img class="card-img" src="${data.image}" alt=""/>
                <h5>${data.title}</h5>
                <h5>Price: $${data.price}</h5>
                <p>${data.description}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <p><strong>Rating:</strong> ${data.rating.rate} ⭐ (${data.rating.count} reviews)</p>
            `;
            modal.style.display = "block";
        });
};

// Modal Close functionality
const closeModal = () => {
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
};

document.querySelector(".close").addEventListener("click", closeModal);

const UpdateTotal = () => {
    const TotalPrice = document.getElementsByClassName("price");
    let count = 0;
    for (const element of TotalPrice) {
        count += parseFloat(element.innerText);
    }
    document.getElementById("total").innerText = count.toFixed(2);
};

searchBox.addEventListener("input", searchProducts);
searchBtn.addEventListener("click", searchProducts);
