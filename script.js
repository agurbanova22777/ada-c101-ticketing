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
                    status: "available",
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

console.log("Total seats:", seats.length); // should be 250