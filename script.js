
const lowerLevelButton = document.getElementById("lower-level-tab");
const upperLevelButton = document.getElementById("upper-level-tab");
const seatMap = document.getElementById("seat-map");

let currentLevel = "lower";

function showLevel(level) {
    currentLevel = level;

    if (level === "lower") {
        lowerLevelButton.classList.add("active");
        upperLevelButton.classList.remove("active");
        seatMap.innerHTML = "<p>Lower level seating will appear here.</p>";
    } else {
        upperLevelButton.classList.add("active");
        lowerLevelButton.classList.remove("active");
        seatMap.innerHTML = "<p>Upper level seating will appear here.</p>";
    }

    console.log("Current level:", currentLevel);
}

lowerLevelButton.addEventListener("click", function () {
    showLevel("lower");
});

upperLevelButton.addEventListener("click", function () {
    showLevel("upper");
});

console.log("ADA Auditorium Ticketing System initialized.");
