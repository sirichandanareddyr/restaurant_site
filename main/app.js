// app.js
console.log("App.js loaded");

// Toggle cart
function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("d-none");
}
document.getElementById("openCartBtn")?.addEventListener("click", toggleCart);

// Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function renderCart() {
  const itemsDiv = document.getElementById("cartItems");
  const totalDiv = document.getElementById("cartTotal");
  if (!itemsDiv) return;
  itemsDiv.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    itemsDiv.innerHTML += `<div class="d-flex justify-content-between">
      <span>${item.name}</span><span>₹${item.price}</span>
    </div>`;
  });
  totalDiv.textContent = "₹" + total;
  localStorage.setItem("cart", JSON.stringify(cart));
}
renderCart();

// Add to cart
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    cart.push({ name, price });
    renderCart();
  });
});

// Confirm order
document.getElementById("confirmOrderBtn")?.addEventListener("click", () => {
  const table = document.getElementById("tableNumber").value;
  const email = document.getElementById("customerEmail").value;
  if (!table || !email) {
    alert("Enter table number and email!");
    return;
  }
  const order = { table, email, items: cart, time: new Date().toLocaleString() };

  // Save to localStorage for workers
  let allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  allOrders.push(order);
  localStorage.setItem("orders", JSON.stringify(allOrders));

  // EmailJS (placeholder)
  if (window.emailjs) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      table_number: table,
      customer_email: email,
      order_items: cart.map(i => i.name).join(", "),
      total: cart.reduce((s, i) => s + i.price, 0)
    });
  }

  alert("Order placed! Sent to staff.");
  cart = [];
  renderCart();
  toggleCart();
});

// Worker dashboard
const workerOrdersDiv = document.getElementById("workerOrders");
if (workerOrdersDiv) {
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  workerOrdersDiv.innerHTML = allOrders.map(o =>
    `<div class="list-group-item">
      <strong>Table ${o.table}</strong> – ${o.items.map(i => i.name).join(", ")} <br>
      <small>${o.time}</small>
    </div>`
  ).join("");
}

// Booking form
document.getElementById("bookingForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    people: document.getElementById("people").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    message: document.getElementById("message").value,
  };
  if (window.emailjs) {
    emailjs.send("YOUR_SERVICE_ID", "BOOKING_TEMPLATE_ID", data);
  }
  alert("Booking confirmed! A copy has been emailed.");
});
