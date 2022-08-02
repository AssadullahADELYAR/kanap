"use strict";
const product = document.querySelector("#items");
//-------------------------------- Loading product from API ---------------------------------------//

fetch("http://localhost:3000/api/products")
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (data) {
    products(data);
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
//-------------------------------- Adding products to the page ---------------------------------------//

function products(data) {
  for (let i = 0; i < data.length; i++) {
    const html = `
    <section id="items">
        <a href="./product.html?id=${data[i]._id}">
            <article>
              <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
              <h3 class="productName">${data[i].name}</h3>
              <p class="productDescription">${data[i].description}</p>
            </article>
        </a>
        </section>`;
    product.insertAdjacentHTML("beforeend", html);
  }
}

//-------------------------------- Display Product Quantity in Navigation ---------------------------------------//

let myStorage = localStorage.getItem("cart");
let storage = JSON.parse(myStorage);
const cart = storage || [];

function showItemInCart() {
  let totalItem = 0;
  if (cart == null) {
    return;
  } else {
    for (let i = 0; i < cart.length; i++) {
      totalItem += cart[i].quantity;
    }
    document.getElementById("itemInCart").textContent = ` ${totalItem}`;
  }
}

showItemInCart();
