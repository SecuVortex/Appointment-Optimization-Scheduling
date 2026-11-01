# Appointment Optimization & Scheduling

A web application developed for booking, tracking, and managing appointments. It provides real-time time slot checking to prevent duplicate bookings and stores records locally in the browser.

This project was submitted as part of **Mini Project – 1 (Semester V)** at **GLA University, Mathura**.

---

## Academic Details

- **Institution:** GLA University, Mathura
- **Department:** Department of Computer Engineering & Applications
- **Course:** Mini Project – 1 (Semester V)
- **Batch:** Batch 06
- **Section:** 3SD
- **Faculty Mentor:** Anurag Das
- **Submission Date:** 18 September 2026

### Team Members

| S.No. | Name | Roll No. | Role in Project |
| :---: | :--- | :---: | :--- |
| 1 | Krishna Upadhyay | 2415000849 | Frontend Development |
| 2 | Kshma | 2415000859 | Database Management |
| 3 | Lakshya Agrawal | 2415000887 | Testing & Documentation |
| 4 | Maan Pratap Singh | 2415000906 | Backend & API |
| 5 | Mayank Dhakre | 2415000955 | Research & Presentation |

---

## Problem Statement

Traditional appointment scheduling often relies on manual logs or registers, which causes several common issues:
- Double booking the same doctor or service at the same time.
- No easy way for clients to see which time slots are actually available.
- Cluttered, manual record-keeping that takes too much time to manage.
- Difficulty in cancelling or updating appointments quickly.

This project provides a simple digital interface where users can select open slots, book their appointment, and see their scheduled bookings instantly.

---

## Features

- **Appointment Booking:** Users enter their name, email, phone number, required service, date, and preferred time slot.
- **Slot Availability Check:** Available slots are shown based on the selected date. Once a slot is taken, it is marked as booked and cannot be selected again.
- **Duplicate Prevention:** Client-side validation stops users from double-booking an existing slot.
- **View & Cancel Appointments:** Scheduled appointments appear on screen with full details, and users can cancel them with one click.
- **Local Persistence:** Data is stored in the browser's `localStorage`, so bookings stay saved even if the page is refreshed.

---

## Frontend Overview (Glimpse)

The frontend is built using React.js and Bootstrap. It runs completely in the browser without needing a separate backend server.

### 1. Booking Form
- **Inputs:** Name, Email, Phone, Service dropdown (e.g. General Consultation, Dental Checkup).
- **Date Picker:** Restricted to current and future dates.
- **Time Slots:** Interactive buttons showing available slots (`09:00 AM`, `10:00 AM`, `11:00 AM`, `02:00 PM`, `03:00 PM`, `04:00 PM`).
- Slots already reserved for that date turn red (`Booked`) and are disabled.

### 2. Scheduled Appointments List
- Shows cards for all active bookings with client info, service type, date, and time.
- Includes a **Cancel** button on each card that immediately removes the booking and frees up the time slot.

---

## How It Works

```
User enters details -> Selects date & slot -> App validates slot availability
                                                      |
                  +-----------------------------------+
                  |                                   |
           Slot is free                       Slot is already booked
                  |                                   |
       Save to localStorage                  Show error message
                  |
        Update screen view
```

---

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), React.js (`useState`, `useEffect`)
- **Styling:** Bootstrap 5 & custom CSS (`style.css`)
- **Storage:** Browser `localStorage`
- **Full-Stack Architecture (Planned):** Node.js, Express.js REST APIs, MongoDB with Mongoose
- **Tools:** VS Code, Git & GitHub

---

## How to Run Locally

You do not need to install Node or run a build step. The frontend runs directly in any browser:

1. Clone the repository:
   ```bash
   git clone https://github.com/SecuVortex/Appointment-Optimization-Scheduling.git
   cd Appointment-Optimization-Scheduling
   ```

2. Open `index.html` in any web browser (double-click the file or use VS Code Live Server).

3. Fill out the form, choose a date and time slot, and click **Confirm & Reserve Slot**.

---

## Project Files

- `index.html` — Main HTML page loading React, Bootstrap, and the app script.
- `style.css` — Custom styling for cards, slot states, and layout.
- `app.js` — React application logic with slot conflict checking and `localStorage` handling.
- `Batch 6 Project_Synopsis (1).pdf` — Original project synopsis submitted to the department.
- `Presentation  Batch 06.pptx` — Project presentation slides.

---

## Future Enhancements

As outlined in our project synopsis, the following features are planned for future versions:
- User login and authentication system.
- Admin dashboard to manage all bookings and schedules.
- Appointment rescheduling without cancelling first.
- Automated email and SMS reminders.
- Online payment integration.
- Backend API using Node.js/Express and MongoDB database.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
