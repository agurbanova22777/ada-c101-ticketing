# ADA C Large(c101) Auditorium Ticketing System

## Project Overview

The ADA C Large Auditorium Ticketing System is a front-end web application developed for the Web & Mobile I student project. It is based on the C Large Auditorium at ADA University and is designed to provide an interactive way for users to explore the seating layout, inspect seats, and select tickets.

The application will be built using HTML, CSS, and JavaScript.

## Venue Structure

The auditorium has two seating levels with a total of 250 seats.

| Level | Section | Number of Seats |
|---|---|---:|
| Lower | Left | 23 |
| Lower | Middle | 33 |
| Lower | Right | 23 |
| Upper | Left | 44 |
| Upper | Middle | 83 |
| Upper | Right | 44 |
| **Total** | | **250** |

The seating map will represent the six sections, with separate views for the lower and upper levels. The layout will be inspired by the auditorium's curved seating arrangement and aisles.

## Planned Features

- Interactive seating map with dynamically generated seats.
- Separate lower and upper level views.
- Seat inspection showing the section, row, seat number, and ticket price.
- Different visual states for available, inspected, selected, and unavailable seats.
- Add-to-cart and ticket removal functionality.
- Automatic ticket total calculation.
- Zoom, directional movement, and reset controls for the seating map.
- Cart persistence using browser localStorage.
- Responsive interface for desktop and mobile devices.

## Technologies

- **HTML5** — Page structure and semantic elements.
- **CSS3** — Layout, styling, and responsive design.
- **JavaScript** — Seat generation, interaction, and application state.
- **localStorage** — Persistent cart data.
- **Git and GitHub** — Version control and project progress tracking.

## Project Structure

```text
ada-auditorium-ticketing/
├── README.md
├── index.html
├── style.css
└── script.js
```

## Development Plan

The project will be developed over four weeks.

- **Week 1 — Design and venue model:** Define the auditorium layout, seating sections, data model, and initial page structure.
- **Week 2 — Dynamic seating and inspection:** Generate seats from JavaScript data and implement seat inspection and status handling.
- **Week 3 — Navigation and cart:** Implement map navigation, ticket selection, cart synchronization, and localStorage.
- **Week 4 — Integration and testing:** Improve responsiveness, test required scenarios, fix bugs, and polish the interface.

## Project Scope

This project focuses on front-end functionality. A backend, database, authentication, real payment processing, and multi-user seat reservation are outside the project scope.

## Course

Web & Mobile I  
ADA University

*This project is being developed by Aydan Gurbanova as part of a four-week student assignment.*
