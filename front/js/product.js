//-------------------------------- Getting DOM elements ---------------------------------------//

const productImage = document.querySelector(".item__img");
const productName = document.querySelector("#title");
const productPrice = document.querySelector("#price");
const productDescription = document.querySelector("#description");
const colorDropdown = document.querySelector("#colors");
let orderButton = document.getElementById("addToCart");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

//-------------------------------- Getting and adding the product---------------------------------------//

fetch(`http://localhost:3000/api/products/${productId}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    productImage.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    productName.innerHTML = `${data.name}`;
    productPrice.innerHTML = `${data.price}`;
    productDescription.innerHTML = `${data.description}`;

    data.colors.forEach((colorName) => {
      colorDropdown.innerHTML += `<option value="${colorName}">${colorName}</option>`;
    });
  })
  .catch(function (error) {
    console.log(error);
  });

//-------------------------------- Getting Products from LocalStorage ---------------------------------------//

let myStorage = localStorage.getItem("cart");
let storage = JSON.parse(myStorage);
const cart = storage || [];

//-------------------------------- Adding prducts to localStorage ---------------------------------------//

orderButton.addEventListener("click", function () {
  let productQuantity = Number(document.getElementById("quantity").value);
  let productColor = colors.options[colors.selectedIndex].value;
  let productImgSrc = productImage.getElementsByTagName("img")[0].src;
  let productImgAlt = productImage.getElementsByTagName("img")[0].alt;

  if (productColor === "" || productQuantity < 1 || productQuantity >= 100) {
    alert("Please Select a Color and Choose Quantity between 1 to 100");
    return;
  }

  //-------------------------------- Checking if LocalStorage ---------------------------------------//

  //Creating product object
  let product = {
    id: productId,
    color: productColor,
    quantity: productQuantity,
    name: productName.textContent,
    price: productPrice.textContent,
    image: productImgSrc,
    imageAlt: productImgAlt,
    // description: productDescription.textContent,
  };

  // if it's empty add the product to cart array
  if (cart.length == 0) {
    cart.push(product);

    //Add cart array to localstorage
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    // Else check if product already exist in array
    let find = [];
    find = cart.filter(function (ele) {
      return ele.id == productId && ele.color == productColor;
    });

    //if yes update the quantity
    if (find.length > 0) {
      if (find[0].id == productId && find[0].color == productColor) {
        find[0].quantity = find[0].quantity + productQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } else {
      //Else it is a new product add to cart
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }

  //Call the overlay function
  overlayOn();

  //Call showItemInCart function
  showItemInCart();
});

//-------------------------------- Display Overlay ---------------------------------------//

function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}

//-------------------------------- Hide Overlay ---------------------------------------//

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

//-------------------------------- Display Product Quantity in Navigation ---------------------------------------//

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
