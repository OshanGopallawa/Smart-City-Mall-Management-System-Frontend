import { useState } from "react";
import axios from "axios";

function AddEvent() {
  const [event, setEvent] = useState({
    name: "",
    description: "",
    location: "",
    eventDate: "",
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/events", event);
      alert("Event Created Successfully!");
      setEvent({ name: "", description: "", location: "", eventDate: "" });
    } catch (error) {
      alert("Error creating event");
      console.error(error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          Create Event
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Name</label>
          <input
            className="form-input"
            name="name"
            placeholder="Enter event name"
            value={event.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Event Date & Time</label>
          <input
            className="form-input"
            type="datetime-local"
            name="eventDate"
            value={event.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            name="description"
            placeholder="Describe the event"
            value={event.description}
            onChange={handleChange}
            rows="4"
            required
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            className="form-input"
            name="location"
            placeholder="e.g., Main Atrium, Food Court"
            value={event.location}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Create Event
        </button>
      </form>
    </div>
  );
}

export default AddEvent;
