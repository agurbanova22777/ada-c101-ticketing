const sections = [
    { id: "LL", name: "Lower Left", level: "lower", price: 10, seatsPerRow: [8, 8, 7] },
    { id: "LM", name: "Lower Middle", level: "lower", price: 15, seatsPerRow: [11, 11, 11] },
    { id: "LR", name: "Lower Right", level: "lower", price: 10, seatsPerRow: [8, 8, 7] },
    { id: "UL", name: "Upper Left", level: "upper", price: 8, seatsPerRow: [9, 9, 9, 9, 8] },
    { id: "UM", name: "Upper Middle", level: "upper", price: 12, seatsPerRow: [17, 17, 17, 16, 16] },
    { id: "UR", name: "Upper Right", level: "upper", price: 8, seatsPerRow: [9, 9, 9, 9, 8] }
];

const SEAT = 20;      // seat size in px
const PITCH = 24;     // distance between seat centers along a row
const ROW_GAP = 26;   // distance between rows
const WIDTH = 820;    // map width in px
const startRadius = { lower: 420, upper: 522 }; // radius of the first row of each level

/* ---------- Build the seat data ---------- */

const seats = [];
let seatNumber = 1;

// Every row is an arc around the stage. All sections of a row share the
// same arc, with one empty slot between sections as the aisle.
["lower", "upper"].forEach(function (level) {
    const levelSections = sections.filter(s => s.level === level);
    const rowCount = levelSections[0].seatsPerRow.length;

    for (let row = 0; row < rowCount; row++) {
        const radius = startRadius[level] + row * ROW_GAP;
        const counts = levelSections.map(s => s.seatsPerRow[row]);
        const slots = counts.reduce((a, b) => a + b) + levelSections.length - 1;
        let slot = 0;

        levelSections.forEach(function (section, i) {
            for (let n = 1; n <= counts[i]; n++) {
                // angle 0 = straight in front of the stage
                const angle = (slot - (slots - 1) / 2) * PITCH / radius;

                seats.push({
                    id: `${section.id}-R${row + 1}-S${n}`,
                    seatNumber: seatNumber++,
                    sectionId: section.id,
                    sectionName: section.name,
                    level: level,
                    row: row + 1,
                    price: section.price,
                    status: "available", // "available", "in-cart" or "unavailable"
                    angle: angle,
                    x: radius * Math.sin(angle),
                    y: radius * Math.cos(angle)
                });
                slot++;
            }
            slot++; // aisle
        });
    }
});

// Mark every 13th seat as taken, so we can test the "unavailable" case
seats.forEach(function (seat) {
    if (seat.seatNumber % 13 === 0) seat.status = "unavailable";
});

/* ---------- Draw the map ---------- */

const seatMap = document.getElementById("seat-map");
const stage = document.querySelector(".stage");

function renderSeats() {
    const stageTop = startRadius.lower - 90;
    const top = Math.min(stageTop, ...seats.map(s => s.y)) - SEAT;
    const bottom = Math.max(...seats.map(s => s.y)) + SEAT;

    seatMap.style.height = (bottom - top) + "px";
    stage.style.top = (stageTop - top) + "px";

    seats.forEach(function (seat) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "seat";
        button.classList.add(seat.status); // "available", "in-cart" or "unavailable"
        button.textContent = seat.seatNumber;
        button.title = `${seat.sectionName}, Row ${seat.row}, Seat ${seat.seatNumber} — ${seat.price} AZN`;
        button.setAttribute("aria-label",
            `${seat.sectionName}, row ${seat.row}, seat ${seat.seatNumber}`);
        button.dataset.seatId = seat.id;

        button.style.left = (WIDTH / 2 + seat.x - SEAT / 2) + "px";
        button.style.top = (seat.y - top - SEAT / 2) + "px";
        button.style.transform = `rotate(${-seat.angle}rad)`; // turn the seat toward the stage

        seatMap.appendChild(button);
    });
}

renderSeats();

/* ---------- Seat details and cart ---------- */

const detailSection = document.getElementById("detail-section");
const detailRow = document.getElementById("detail-row");
const detailSeat = document.getElementById("detail-seat");
const detailPrice = document.getElementById("detail-price");
const addButton = document.getElementById("add-to-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

let inspectedSeat = null;   // the seat being looked at (not in the cart yet)
let selectedButton = null;  // its button on the map
const cart = [];            // seats that were added with "Add to Cart"

// Update one seat's button so it matches seat.status
function updateSeatButton(seat) {
    const button = seatMap.querySelector(`[data-seat-id="${seat.id}"]`);
    button.classList.remove("available", "in-cart", "unavailable");
    button.classList.add(seat.status);
}

// Decide if the Add to Cart button is usable for the inspected seat
function updateAddButton() {
    if (!inspectedSeat) {
        addButton.disabled = true;
        addButton.textContent = "Add to Cart";
    } else if (inspectedSeat.status === "in-cart") {
        addButton.disabled = true;
        addButton.textContent = "Already in Cart";
    } else if (inspectedSeat.status === "unavailable") {
        addButton.disabled = true;
        addButton.textContent = "Unavailable";
    } else {
        addButton.disabled = false;
        addButton.textContent = "Add to Cart";
    }
}

// Rebuild the cart panel from the cart array
function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(function (seat) {
        const item = document.createElement("div");
        item.className = "cart-item";
        item.innerHTML =
            `<span>${seat.sectionName}, Row ${seat.row}, Seat ${seat.seatNumber}</span>` +
            `<strong>${seat.price} AZN</strong>`;
        cartItems.appendChild(item);
    });

    const total = cart.reduce(function (sum, seat) {
        return sum + seat.price;
    }, 0);

    cartCount.textContent = cart.length;
    cartTotal.textContent = total + " AZN";
    saveCart();
}

// Clicking a seat only INSPECTS it. The cart is not changed here.
seatMap.addEventListener("click", function (event) {
    const button = event.target.closest("button.seat");
    if (!button) return;

    inspectedSeat = seats.find(s => s.id === button.dataset.seatId);

    if (selectedButton) selectedButton.classList.remove("selected");
    selectedButton = button;
    button.classList.add("selected");

    detailSection.textContent = inspectedSeat.sectionName;
    detailRow.textContent = inspectedSeat.row;
    detailSeat.textContent = inspectedSeat.seatNumber;
    detailPrice.textContent = inspectedSeat.price + " AZN";

    updateAddButton();
});

// Only this button adds a ticket to the cart
addButton.addEventListener("click", function () {
    if (!inspectedSeat) return;

    // Blocks unavailable seats and duplicates
    if (inspectedSeat.status !== "available" || cart.includes(inspectedSeat)) return;

    inspectedSeat.status = "in-cart";
    cart.push(inspectedSeat);

    updateSeatButton(inspectedSeat);
    updateAddButton();
    renderCart();
});

loadCart();
renderCart();
console.log("Total seats:", seats.length); // should be 250

// Save only the seat ids. Prices and details come back from the seats array.
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart.map(seat => seat.id)));
}

// Restore the cart and the matching seat states after a refresh
function loadCart() {
    try {
        const ids = JSON.parse(localStorage.getItem("cart")) || [];

        ids.forEach(function (id) {
            const seat = seats.find(s => s.id === id);

            // Skip ids that no longer exist, unavailable seats and duplicates
            if (!seat || seat.status !== "available") return;

            seat.status = "in-cart";
            cart.push(seat);
            updateSeatButton(seat);
        });
    } catch (error) {
        localStorage.removeItem("cart"); // saved data was corrupted, so start fresh
    }
}