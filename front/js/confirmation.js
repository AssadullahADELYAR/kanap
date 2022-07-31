function orderIdRecup() {
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
  orderId.innerText = orderIdRecup();
});
