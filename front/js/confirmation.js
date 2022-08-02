function getProductId() {
  //retrieve the url
  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  //if "OrderID" exists = return the value
  if (searchParams.has("orderid")) {
    let id = searchParams.get("orderid");
    return id;
  } else {
    console.log("Error, no order Id found");
  }
}
// Display OrderID on page load
window.addEventListener("load", () => {
  const orderId = document.getElementById("orderId");
  orderId.innerText = getProductId();
});

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
