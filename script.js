
const sections = [
    {
        id: "LL",
        name: "Lower Left",
        level: "lower",
        price: 10,
        seatsPerRow: [8, 8, 7]
    },
    {
        id: "LM",
        name: "Lower Middle",
        level: "lower",
        price: 15,
        seatsPerRow: [11, 11, 11]
    },
    {
        id: "LR",
        name: "Lower Right",
        level: "lower",
        price: 10,
        seatsPerRow: [8, 8, 7]
    },
    {
        id: "UL",
        name: "Upper Left",
        level: "upper",
        price: 8,
        seatsPerRow: [9, 9, 9, 9, 8]
    },
    {
        id: "UM",
        name: "Upper Middle",
        level: "upper",
        price: 12,
        seatsPerRow: [17, 17, 17, 16, 16]
    },
    {
        id: "UR",
        name: "Upper Right",
        level: "upper",
        price: 8,
        seatsPerRow: [9, 9, 9, 9, 8]
    }
];

const seats = [];

sections.forEach(function (section) {
    section.seatsPerRow.forEach(function (seatCount, rowIndex) {
        for (let seatNumber = 1; seatNumber <= seatCount; seatNumber++) {
            const seat = {
                id: `${section.id}-R${rowIndex + 1}-S${seatNumber}`,
                sectionId: section.id,
                sectionName: section.name,
                level: section.level,
                row: rowIndex + 1,
                seatNumber: seatNumber,
                price: section.price,
                status: "available"
            };

            seats.push(seat);
        }
    });
});

// Check the generated seat counts
const lowerSeats = seats.filter(function (seat) {
    return seat.level === "lower";
});

const upperSeats = seats.filter(function (seat) {
    return seat.level === "upper";
});

console.log("Lower level seats:", lowerSeats.length);
console.log("Upper level seats:", upperSeats.length);
console.log("Total seats:", seats.length);

console.log("Expected total: 250");
console.log("Seat count correct:", seats.length === 250);
