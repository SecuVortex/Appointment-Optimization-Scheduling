/**
 * Appointment Optimization & Scheduling System
 * GLA University - Department of Computer Engineering & Applications
 * Mini Project - 1 (Batch 06 - 3SD)
 */

(function () {
  "use strict";

  // Configuration
  const STORAGE_KEY = "gla_appointment_records";
  const TIME_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ];

  // DOM Elements
  const form = document.getElementById("appointment-form");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const userPhoneInput = document.getElementById("userPhone");
  const serviceTypeSelect = document.getElementById("serviceType");
  const appointmentDateInput = document.getElementById("appointmentDate");
  const selectedTimeSlotInput = document.getElementById("selectedTimeSlot");
  const slotContainer = document.getElementById("slot-container");
  const slotSummaryText = document.getElementById("slot-summary-text");
  const appointmentsListEl = document.getElementById("appointments-list");
  const alertContainer = document.getElementById("alert-container");
  const searchInput = document.getElementById("search-input");
  const filterBtns = document.querySelectorAll(".btn-filter");

  // Stats Elements
  const statTotal = document.getElementById("stat-total");
  const statActive = document.getElementById("stat-active");
  const statSlotsCount = document.getElementById("stat-slots-count");

  // State
  let appointments = [];
  let currentFilter = "all";
  let searchQuery = "";

  // Helper: Format today as YYYY-MM-DD
  function getTodayString(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Pre-seed initial sample appointments if storage is empty
  function loadInitialData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        appointments = JSON.parse(raw);
        return;
      } catch (e) {
        console.error("Failed to parse appointments storage", e);
      }
    }

    // Default sample appointments for immediate demonstration
    const today = getTodayString(0);
    const tomorrow = getTodayString(1);

    appointments = [
      {
        id: "APT-2026-101",
        name: "Aman Gupta",
        email: "aman.gupta@example.com",
        phone: "9876543210",
        service: "General Consultation",
        date: today,
        timeSlot: "09:00 AM",
        status: "Confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "APT-2026-102",
        name: "Pooja Sharma",
        email: "pooja.s@example.com",
        phone: "9812345678",
        service: "Dental Care",
        date: today,
        timeSlot: "11:00 AM",
        status: "Confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "APT-2026-103",
        name: "Vikram Malhotra",
        email: "vikram.m@example.com",
        phone: "9988776655",
        service: "Cardiology Checkup",
        date: tomorrow,
        timeSlot: "02:00 PM",
        status: "Confirmed",
        createdAt: new Date().toISOString()
      }
    ];

    saveAppointments();
  }

  function saveAppointments() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    updateStats();
  }

  function updateStats() {
    const total = appointments.length;
    statTotal.textContent = total;
    statActive.textContent = total;

    const selectedDate = appointmentDateInput.value;
    if (selectedDate) {
      const bookedOnDate = appointments.filter((a) => a.date === selectedDate).length;
      const freeOnDate = TIME_SLOTS.length - bookedOnDate;
      statSlotsCount.textContent = `${freeOnDate} Left on ${selectedDate.slice(5)}`;
    } else {
      statSlotsCount.textContent = `${TIME_SLOTS.length} per day`;
    }
  }

  function showAlert(message, type = "success") {
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
        <i class="bi ${type === "success" ? "bi-check-circle-fill text-success" : "bi-exclamation-triangle-fill text-danger"} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    setTimeout(() => {
      const alert = alertContainer.querySelector(".alert");
      if (alert) {
        alert.classList.remove("show");
        setTimeout(() => alert.remove(), 200);
      }
    }, 4500);
  }

  // Render Time Slot Buttons based on selected date
  function renderSlots() {
    const selectedDate = appointmentDateInput.value;
    slotContainer.innerHTML = "";

    if (!selectedDate) {
      slotSummaryText.textContent = "Select date first";
      slotSummaryText.className = "slot-summary text-muted";
      selectedTimeSlotInput.value = "";
      return;
    }

    const bookedSlots = appointments
      .filter((a) => a.date === selectedDate)
      .map((a) => a.timeSlot);

    const availableCount = TIME_SLOTS.length - bookedSlots.length;
    slotSummaryText.textContent = `${availableCount} of ${TIME_SLOTS.length} slots available`;
    slotSummaryText.className = availableCount > 0 ? "slot-summary text-success" : "slot-summary text-danger";

    TIME_SLOTS.forEach((slot) => {
      const isBooked = bookedSlots.includes(slot);
      const isSelected = selectedTimeSlotInput.value === slot;

      const slotDiv = document.createElement("div");
      slotDiv.className = `slot-item ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`;
      slotDiv.innerHTML = `${slot} ${isBooked ? '<span class="badge bg-danger ms-1" style="font-size:0.6rem">Booked</span>' : ""}`;

      if (!isBooked) {
        slotDiv.addEventListener("click", () => {
          selectedTimeSlotInput.value = slot;
          renderSlots();
        });
      }

      slotContainer.appendChild(slotDiv);
    });

    updateStats();
  }

  // Render Scheduled Appointments List
  function renderAppointments() {
    const today = getTodayString(0);

    let filtered = appointments.filter((app) => {
      // Search query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = app.name.toLowerCase().includes(q);
        const matchesPhone = app.phone.includes(q);
        const matchesEmail = app.email.toLowerCase().includes(q);
        const matchesService = app.service.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesService) {
          return false;
        }
      }

      // Tab filter
      if (currentFilter === "today") {
        return app.date === today;
      }
      if (currentFilter === "upcoming") {
        return app.date >= today;
      }
      return true;
    });

    // Sort by date then slot
    filtered.sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot));

    appointmentsListEl.innerHTML = "";

    if (filtered.length === 0) {
      appointmentsListEl.innerHTML = `
        <div class="empty-placeholder">
          <i class="bi bi-calendar-x"></i>
          <p class="mb-1 fw-semibold text-dark">No appointments found</p>
          <small>No appointments match the selected filter or search.</small>
        </div>
      `;
      return;
    }

    filtered.forEach((app) => {
      const item = document.createElement("div");
      item.className = "appointment-entry";
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="apt-token">${app.id}</span>
              <span class="service-pill">${app.service}</span>
              <span class="badge bg-success-subtle text-success border border-success-subtle" style="font-size:0.65rem">Confirmed</span>
            </div>
            <div class="apt-name">${escapeHtml(app.name)}</div>
            <div class="apt-meta mt-1">
              <span class="me-3"><i class="bi bi-telephone me-1"></i>${escapeHtml(app.phone)}</span>
              <span><i class="bi bi-envelope me-1"></i>${escapeHtml(app.email)}</span>
            </div>
            <div class="mt-2 fw-semibold" style="font-size: 0.88rem;">
              <span class="text-primary me-3"><i class="bi bi-calendar-date me-1"></i>${app.date}</span>
              <span class="text-dark"><i class="bi bi-clock me-1"></i>${app.timeSlot}</span>
            </div>
          </div>
          <div>
            <button class="btn btn-outline-danger btn-sm cancel-btn" data-id="${app.id}" title="Cancel booking">
              <i class="bi bi-trash3 me-1"></i>Cancel
            </button>
          </div>
        </div>
      `;

      appointmentsListEl.appendChild(item);
    });

    // Attach cancel events
    document.querySelectorAll(".cancel-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        cancelAppointment(id);
      });
    });
  }

  function cancelAppointment(id) {
    const target = appointments.find((a) => a.id === id);
    if (!target) return;

    const confirmed = confirm(
      `Cancel appointment ${target.id} for ${target.name} on ${target.date} at ${target.timeSlot}?`
    );

    if (confirmed) {
      appointments = appointments.filter((a) => a.id !== id);
      saveAppointments();
      renderSlots();
      renderAppointments();
      showAlert(`Appointment ${id} has been cancelled. The time slot is now open.`, "success");
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const phone = userPhoneInput.value.trim();
    const service = serviceTypeSelect.value;
    const date = appointmentDateInput.value;
    const timeSlot = selectedTimeSlotInput.value;

    if (!name || !email || !phone) {
      showAlert("Please enter all required patient contact details.", "danger");
      return;
    }

    if (!date) {
      showAlert("Please select an appointment date.", "danger");
      return;
    }

    if (!timeSlot) {
      showAlert("Please click and select an available time slot.", "danger");
      return;
    }

    // Optimization & Collision Prevention Logic
    const conflict = appointments.some(
      (app) => app.date === date && app.timeSlot === timeSlot
    );

    if (conflict) {
      showAlert(
        `Conflict Detected: Slot ${timeSlot} on ${date} is already booked. Please pick another slot.`,
        "danger"
      );
      renderSlots();
      return;
    }

    // Create New Appointment Record
    const newId = "APT-2026-" + String(appointments.length + 101);
    const newAppointment = {
      id: newId,
      name,
      email,
      phone,
      service,
      date,
      timeSlot,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    appointments.unshift(newAppointment);
    saveAppointments();

    showAlert(
      `Appointment ${newId} confirmed for ${name} on ${date} at ${timeSlot}!`,
      "success"
    );

    // Reset Form Fields
    form.reset();
    appointmentDateInput.value = date; // keep date for convenience
    selectedTimeSlotInput.value = "";
    renderSlots();
    renderAppointments();
  });

  // Date input listener
  appointmentDateInput.addEventListener("change", () => {
    selectedTimeSlotInput.value = "";
    renderSlots();
  });

  // Search input listener
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderAppointments();
  });

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderAppointments();
    });
  });

  // Initialization
  function init() {
    loadInitialData();

    // Set minimum date to today
    const today = getTodayString(0);
    appointmentDateInput.min = today;
    appointmentDateInput.value = today;

    renderSlots();
    renderAppointments();
    updateStats();
  }

  // Run on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
