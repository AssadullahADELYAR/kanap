let cartData = localStorage.getItem("cart");
let cart = JSON.parse(cartData);
console.log(cart);
const product = document.querySelector("#cart__items");
let totalQuantity = document.querySelector("#totalQuantity");
let totalPrice = document.querySelector("#totalPrice");
let totalPrice1 = 0;
let totalQuantity1 = 0;

//-------------------------------- Inserting The Products ---------------------------------------//

for (let productInCart of cart) {
  console.log(productInCart);
  let html = `
    <article class="cart__item" data-id="${productInCart.id}" data-color="${productInCart.color}">
        <div class="cart__item__img">
          <img src="${productInCart.image}" alt="${productInCart.imageAlt}">

        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${productInCart.name}</h2>
              <p>${productInCart.color}</p>
              <p>${productInCart.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input onclick = "updateQuantity()" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem" onclick = "removeItem(${productInCart.id},${productInCart.color})">Delete</p>
              </div>
            </div>
         </div>
    </article>
  `;
  product.insertAdjacentHTML("beforeend", html);
}

function updateQuantity() {
  let currentProductId = document
    .querySelector(".cart__item")
    .getAttribute("data-id");
  let currentProductColor = document
    .querySelector(".cart__item")
    .getAttribute("data-color");
  let find = [];
  console.log("empty find array");
  console.log(find);
  find = cart.filter(function (ele) {
    return ele.id == currentProductId && ele.color == currentProductColor;
  });
  if (find.length > 0) {
    if (
      find[0].id == currentProductId &&
      find[0].color == currentProductColor
    ) {
      find[0].quantity++;
      // localStorage.setItem("cart", JSON.stringify(cart));
      console.log(find[0].quantity, find[0].color, find[0].id);
    }
  }
}
// updateQuantity();

//-------------------------------- Total Price ---------------------------------------//

function getTotalPrice() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
  }
  return total;
}
totalPrice.textContent = getTotalPrice();
//-------------------------------- Total Quantity ---------------------------------------//

function getTotalQuantity() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].quantity;
  }
  return total;
}
totalQuantity.textContent = getTotalQuantity();

//-------------------------------- Remove Item ---------------------------------------//
let singleProductId = document.querySelector(".cart__item").dataset.id;
let singleProductColor = document.querySelector(".cart__item").dataset.color;
console.log(singleProductId);
console.log(singleProductColor);
let deleteItem = document.querySelector(".deleteItem");
console.log(deleteItem);
deleteItem.addEventListener("click", () => {
  deleteItem.closest("article").remove();
});
function removeItem(id, color) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id && cart[i].color == color) {
      cart.splice(i, 1);
      localStorage.removeItem(cart[i]);
    }
    return;
  }
}

//-------------------------------- Form Validation ---------------------------------------//

const order = document.getElementById("order");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
const nameRegex = /^[A-Za-z. ]{3,30}$/;
const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
const cityRegex = /^[a-zA-Z\s]{3,}+$/;
const emailRegex = /[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-zA-Z]{2,10}$/;

order.addEventListener("click", (event) => {
  event.preventDefault();
  formValidation();
});

function formValidation() {
  if (firstName.value == "" || nameRegex.test(firstName.value) == false) {
    document.getElementById("firstNameErrorMsg").textContent =
      "First Name Invalid";
    return;
  } else {
    document.getElementById("firstNameErrorMsg").textContent = "";
  }
  if (lastName.value == "" || nameRegex.test(lastName.value) == false) {
    document.getElementById("lastNameErrorMsg").textContent =
      "Last Name Invalid";
    return;
  } else {
    document.getElementById("lastNameErrorMsg").textContent = "";
  }
  if (address.value == "" || addressRegex.test(address.value) == false) {
    document.getElementById("addressErrorMsg").textContent = "address Invalid";
    return;
  } else {
    document.getElementById("addressErrorMsg").textContent = "";
  }
  if (city.value == "" || cityRegex.test(city.value) == false) {
    document.getElementById("cityErrorMsg").textContent = "city Invalid";
    return;
  } else {
    document.getElementById("cityErrorMsg").textContent = "";
  }
  if (email.value == "" || emailRegex.test(email.value) == false) {
    document.getElementById("emailErrorMsg").textContent =
      "Email address Invalid";
    return;
  } else {
    document.getElementById("emailErrorMsg").textContent = "";
  }
  let products = [];
  cart.forEach((element) => {
    products.push(element.id);
  });
  console.log(products);
  let orderInfo = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    productId: products,
  };
  console.log(orderInfo);

  let orderData = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(orderInfo),
  };

  fetch("http://localhost:3000/api/products/order", orderData)
    .then((response) => response.json())
    .then((data) => {
      location.href = `./confirmation.html?orderid=${products}`;
      localStorage.clear();
    })
    .catch((error) => {
      alert(error);
    });
}
