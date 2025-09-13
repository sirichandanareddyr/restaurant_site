//  CART & ORDERING 
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.querySelectorAll(".add-to-order").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = {
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price) || 0
    };
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(item.name + " added to cart!");
  });
});

const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
if (cartBtn) {
  cartBtn.onclick = () => {
    document.getElementById("cartItems").innerHTML = cart.map(i => `<li>${i.name} - ₹${i.price}</li>`).join("");
    cartModal.style.display = "block";
  };
}
document.getElementById("closeCart")?.addEventListener("click", () => cartModal.style.display = "none");

document.getElementById("confirmOrder")?.addEventListener("click", () => {
  const tableNumber = document.getElementById("tableNumber").value;
  const customerEmail = document.getElementById("customerEmail").value;
  if (!tableNumber || !customerEmail) {
    alert("Please enter table number and email.");
    return;
  }
  const order = {
    id: Date.now(),
    table: tableNumber,
    items: cart,
    total: cart.reduce((sum, i) => sum + i.price, 0),
    email: customerEmail,
    time: new Date().toLocaleString(),
    status: "Pending"
  };
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  localStorage.removeItem("cart");
  alert("Order confirmed! Your table: " + tableNumber);
  cartModal.style.display = "none";

  // Send email via EmailJS if configured
  if (window.emailjs) {
    emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
      order_id: order.id,
      table: order.table,
      total: order.total,
      time: order.time,
      customer_email: order.email,
      order_items: order.items.map(i => i.name).join(", ")
    });
  }
});

//  WORKER DASHBOARD 
const ordersTableBody = document.getElementById("ordersTableBody");
if (ordersTableBody) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.table}</td>
      <td>${order.items.map(i => i.name).join(", ")}</td>
      <td>₹${order.total}</td>
      <td>${order.time}</td>
      <td>${order.status}</td>
      <td>
        <button class="btn btn-sm btn-info">Preparing</button>
        <button class="btn btn-sm btn-success">Served</button>
        <button class="btn btn-sm btn-danger">Delete</button>
      </td>
    `;
    ordersTableBody.appendChild(row);
  });
}

//  BOOKING
document.getElementById("bookingForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const booking = {
    id: Date.now(),
    name: document.getElementById("bookName").value,
    email: document.getElementById("bookEmail").value,
    phone: document.getElementById("bookPhone").value,
    date: document.getElementById("bookDate").value,
    time: document.getElementById("bookTime").value,
    pax: document.getElementById("bookPax").value
  };
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  alert("Booking confirmed! We’ve sent a confirmation email.");

  // Send booking email
  if (window.emailjs) {
    emailjs.send("SERVICE_ID", "BOOKING_TEMPLATE_ID", {
      booking_id: booking.id,
      name: booking.name,
      date: booking.date,
      time: booking.time,
      pax: booking.pax,
      customer_email: booking.email
    });
  }
});
