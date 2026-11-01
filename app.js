const { useState, useEffect } = React;

const AVAILABLE_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM"
];

const SERVICES = [
  "General Consultation",
  "Specialist Consultation",
  "Dental Checkup",
  "Health Screening",
  "Follow-up Visit"
];

function App() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: SERVICES[0],
    date: "",
    timeSlot: ""
  });
  const [message, setMessage] = useState(null);

  // Load appointments from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("appointments");
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error reading localStorage:", err);
    }
  }, []);

  // Save appointments to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem("appointments", JSON.stringify(appointments));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }, [appointments]);

  // Determine booked slots for the currently selected date
  const bookedSlotsForDate = formData.date
    ? appointments
        .filter((app) => app.date === formData.date)
        .map((app) => app.timeSlot)
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset selected slot if date changes
      ...(name === "date" ? { timeSlot: "" } : {})
    }));
    setMessage(null);
  };

  const handleSlotSelect = (slot) => {
    if (bookedSlotsForDate.includes(slot)) {
      setMessage({ type: "danger", text: `Slot ${slot} is already booked for this date.` });
      return;
    }
    setFormData((prev) => ({ ...prev, timeSlot: slot }));
    setMessage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setMessage({ type: "danger", text: "Please fill in all personal contact details." });
      return;
    }

    if (!formData.date) {
      setMessage({ type: "danger", text: "Please select an appointment date." });
      return;
    }

    if (!formData.timeSlot) {
      setMessage({ type: "danger", text: "Please choose an available time slot." });
      return;
    }

    // Check conflict / duplicate booking
    const isConflict = appointments.some(
      (app) => app.date === formData.date && app.timeSlot === formData.timeSlot
    );

    if (isConflict) {
      setMessage({
        type: "danger",
        text: "Duplicate booking detected. This slot has just been reserved."
      });
      return;
    }

    const newAppointment = {
      id: "APT-" + Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service: formData.service,
      date: formData.date,
      timeSlot: formData.timeSlot,
      bookedAt: new Date().toLocaleDateString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setMessage({
      type: "success",
      text: `Appointment confirmed for ${newAppointment.name} on ${newAppointment.date} at ${newAppointment.timeSlot}!`
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: SERVICES[0],
      date: "",
      timeSlot: ""
    });
  };

  const handleCancel = (id) => {
    const target = appointments.find((a) => a.id === id);
    if (!target) return;

    if (window.confirm(`Are you sure you want to cancel the appointment for ${target.name} on ${target.date}?`)) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setMessage({ type: "info", text: "Appointment cancelled successfully. Time slot is now open." });
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div>
      <header className="app-header">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="h4 mb-0 fw-bold">Appointment Optimization & Scheduling</h1>
            <small className="text-muted">GLA University | Mini Project 1 (Batch 06 - 3SD)</small>
          </div>
          <div className="mt-2 mt-md-0">
            <span className="badge-tag me-2">React.js</span>
            <span className="badge-tag me-2">localStorage</span>
            <span className="badge-tag">No Backend Required</span>
          </div>
        </div>
      </header>

      <main className="container">
        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="row g-4">
          {/* Booking Form Column */}
          <div className="col-lg-5">
            <div className="booking-card p-4">
              <h2 className="h5 fw-bold mb-3">Book an Appointment</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-sm"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-sm"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-sm"
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Service</label>
                  <select
                    name="service"
                    className="form-select form-select-sm"
                    value={formData.service}
                    onChange={handleInputChange}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    name="date"
                    min={todayStr}
                    className="form-control form-control-sm"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label d-block">
                    Preferred Time Slot{" "}
                    {formData.date ? (
                      <span className="text-muted fw-normal" style={{ fontSize: "0.8rem" }}>
                        ({bookedSlotsForDate.length} of {AVAILABLE_SLOTS.length} booked)
                      </span>
                    ) : (
                      <span className="text-muted fw-normal" style={{ fontSize: "0.8rem" }}>
                        (select date first)
                      </span>
                    )}
                  </label>

                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {AVAILABLE_SLOTS.map((slot) => {
                      const isBooked = bookedSlotsForDate.includes(slot);
                      const isSelected = formData.timeSlot === slot;

                      let btnClass = "btn slot-btn ";
                      if (isSelected) {
                        btnClass += "slot-selected";
                      } else if (isBooked) {
                        btnClass += "slot-booked";
                      } else {
                        btnClass += "slot-available";
                      }

                      return (
                        <button
                          key={slot}
                          type="button"
                          className={btnClass}
                          disabled={!formData.date || isBooked}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {slot} {isBooked ? "(Booked)" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-semibold">
                  Confirm & Reserve Slot
                </button>
              </form>
            </div>
          </div>

          {/* Appointments List Column */}
          <div className="col-lg-7">
            <div className="list-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">Scheduled Appointments</h2>
                <span className="badge bg-secondary">{appointments.length} Active</span>
              </div>

              {appointments.length === 0 ? (
                <div className="empty-state">
                  <p className="mb-1 fw-semibold">No appointments scheduled yet.</p>
                  <small>Fill out the form on the left to book your first slot.</small>
                </div>
              ) : (
                <div className="appointments-list">
                  {appointments.map((app) => (
                    <div key={app.id} className="appointment-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="client-name">{app.name}</span>
                            <span className="service-badge">{app.service}</span>
                          </div>
                          <div className="text-muted small mt-1">
                            <span>📞 {app.phone}</span> | <span>✉️ {app.email}</span>
                          </div>
                          <div className="mt-2 fw-medium small">
                            <span className="text-dark">📅 Date: {app.date}</span> &nbsp;|&nbsp;{" "}
                            <span className="text-primary">🕒 Slot: {app.timeSlot}</span>
                          </div>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(app.id)}
                          title="Cancel appointment"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
