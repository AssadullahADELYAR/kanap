let cartData = localStorage.getItem("cart");
let cart = JSON.parse(cartData);
const product = document.querySelector("#cart__items");
let totalQuantity = document.querySelector("#totalQuantity");
let totalPrice = document.querySelector("#totalPrice");
let heading = document.getElementById("cartHeading");

//-------------------------------- Inserting The Products ---------------------------------------//

//Check if localStorage is empty
function insertProducts() {
  if (cart == null || cart.length == 0) {
    heading.textContent = "Your Cart is Empty";
    localStorage.clear();
    document.querySelector(".cart__order").classList.add("hide_form");
    document.getElementById("order").disabled = true;

    return;
  }

  //Load the products from localStorage
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
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p  class="deleteItem">Delete</p>
                </div>
              </div>
           </div>
      </article>
    `;
    product.insertAdjacentHTML("beforeend", html);
  }
}
insertProducts();

//-------------------------------- Total Price ---------------------------------------//

function getTotalPrice() {
  let total = 0;
  if (cart == null) {
    return total;
  } else {
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    return total;
  }
}
totalPrice.textContent = getTotalPrice();

//-------------------------------- Total Quantity ---------------------------------------//

function getTotalQuantity() {
  let total = 0;

  if (cart == null) {
    return total;
  } else {
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].quantity;
      document.getElementById("itemInCart").textContent = ` ${total}`;
    }
    return total;
  }
}
totalQuantity.textContent = getTotalQuantity();

//-------------------------------- Update Quantity ---------------------------------------//

function updateQuantity() {
  let itemQuantity = document.querySelectorAll(".itemQuantity");

  for (let i = 0; i < itemQuantity.length; i++) {
    itemQuantity[i].addEventListener("change", (event) => {
      //Preventing the default behavior of button
      event.preventDefault();

      //Storing the new value
      let updatedValue = parseInt(itemQuantity[i].value);
      cart[i].quantity = updatedValue;

      //Setting localStorage to cart array
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    });
  }
}
updateQuantity();

//-------------------------------- Remove Item ---------------------------------------//
let deleteProduct = document.querySelectorAll(".deleteItem");

/* boucle qui parcourt le panier */
for (let i = 0; i < deleteProduct.length; i++) {
  deleteProduct[i].addEventListener("click", (event) => {
    event.preventDefault();

    //Getting ID and Color value from cart array on click event
    let singleProductColor = cart[i].color;
    let singleProductId = cart[i].id;

    //keep only the elements that do not meet the conditions
    cart = cart.filter(
      (el) => el.id !== singleProductId || el.color !== singleProductColor
    );

    //Setting back localStorage to cart array
    localStorage.setItem("cart", JSON.stringify(cart));

    //If cart array is empty remove it from localStorage
    if (cart == "[]" || cart.length == 0) {
      localStorage.removeItem("cart");
    }
    window.location.href = "cart.html";
  });
}

//-------------------------------- Form Validation ---------------------------------------//

//Getting form elements from DOM
const order = document.getElementById("order");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

//Creating regular expression
const nameRegex = /^[A-Za-z. ]{3,30}$/;
const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
const cityRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-zA-Z]{2,10}$/;

//Order button event listener function
order.addEventListener("click", (event) => {
  event.preventDefault();
  formValidation();
});

//Checking form data
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

  //Post the order information
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
