import React, { useState, useEffect } from "react";
import axios from "axios";

const EventForm = ({ setEvents, eventToEdit, setEventToEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    reminder: "",
  });

  // Request notification permission on component load
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().catch((err) =>
        console.error("Notification permission error:", err)
      );
    }
  }, []);

  // Populate form with data when editing an event
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name,
        date: eventToEdit.date,
        time: eventToEdit.time,
        location: eventToEdit.location,
        description: eventToEdit.description,
        category: eventToEdit.category,
        reminder: eventToEdit.reminder,
      });
    }
  }, [eventToEdit]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Schedule a reminder notification
  const setReminderNotification = () => {
    if (formData.reminder) {
      const reminderDate = new Date(formData.reminder).getTime(); // UTC timestamp
      const now = new Date().getTime(); // Current UTC timestamp

      if (reminderDate > now) {
        const timeDifference = reminderDate - now;

        console.log(`Reminder set for ${formData.name} in ${timeDifference / 1000} seconds.`);

        setTimeout(() => {
          try {
            new Notification("Event Reminder", {
              body: `Reminder for event: ${formData.name} at ${formData.time}`,
            });
          } catch (err) {
            console.error("Notification error:", err);
          }
        }, timeDifference);
      } else {
        console.warn("Reminder time is in the past. Notification not scheduled.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Schedule notification
    setReminderNotification();

    try {
      const API_BASE_URL = "http://localhost:5000/api/events";

      if (eventToEdit) {
        // Update existing event
        const response = await axios.put(`${API_BASE_URL}/${eventToEdit._id}`, formData);
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event._id === eventToEdit._id ? response.data : event))
        );
      } else {
        // Create a new event
        const response = await axios.post(API_BASE_URL, formData);
        setEvents((prevEvents) => [...prevEvents, response.data]);
      }

      // Clear the form
      setFormData({
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "",
        reminder: "",
      });
      setEventToEdit(null);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Birthday">Birthday</option>
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="date" className="form-label">
            Event Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="time" className="form-label">
            Event Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            className="form-control"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="col-md-6">
          <label htmlFor="reminder" className="form-label">
            Reminder
          </label>
          <input
            type="datetime-local"
            id="reminder"
            name="reminder"
            className="form-control"
            value={formData.reminder}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">
            {eventToEdit ? "Update Event" : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
