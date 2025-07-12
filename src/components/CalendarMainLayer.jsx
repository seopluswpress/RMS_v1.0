import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CalendarMainLayer = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    description: '',
    label: ''
  });

  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://hemanth525.pythonanywhere.com/user/event/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };

      await axios.post("https://hemanth525.pythonanywhere.com/user/event/", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Event added successfully!");
      setFormData({
        title: '',
        start_time: '',
        end_time: '',
        description: '',
        label: ''
      });
      fetchEvents();
    } catch (err) {
      console.error("Failed to add event", err);
      if (err.response?.data) {
        alert("Error: " + JSON.stringify(err.response.data));
      }
    }
  };

  const formatDateRange = (start, end) => {
    try {
      const format = (dateStr) => {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
      };
      return `${format(start)} - ${format(end)}`;
    } catch {
      return 'Invalid Date - Invalid Date';
    }
  };

  const getLabelColor = (label) => {
    switch (label?.toLowerCase()) {
      case 'personal': return 'bg-success-600';
      case 'business': return 'bg-primary-600';
      case 'family': return 'bg-warning-600';
      case 'important': return 'bg-lilac-600';
      case 'holiday': return 'bg-danger-600';
      default: return 'bg-info-600';
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm rounded">
            <div className="card-body">
              <h6 className="card-title mb-3">Event Calendar</h6>
              {events.map(event => (
            <div
              key={event.id}
              className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0"
              onClick={() => handleEventClick(event)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="d-flex align-items-center gap-10">
                  <span className={`w-12-px h-12-px rounded-circle fw-medium ${getLabelColor(event.label)}`} />
                  <span className="text-secondary-light">
                    {formatDateRange(event.start_time, event.end_time)}
                  </span>
                </div>
                <span className="text-primary-light fw-semibold text-md mt-4">
                  {event.title}
                </span>
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm rounded">
            <div className="card-body">
              <h6 className="card-title mb-3">Add New Event</h6>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-control"
                required
              />
            </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
  type="datetime-local"
  value={formData.start_time}
  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
  className="form-control"
  required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
  type="datetime-local"
  value={formData.end_time}
  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
  className="form-control"
  required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-control"
              />
                </div>
                <div className="form-group">
                  <label>Label</label>
              <select
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="form-control"
              >
                <option value="">Select Label</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="family">Family</option>
                <option value="important">Important</option>
                <option value="holiday">Holiday</option>
              </select>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Add Event</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Date:</strong> {formatDateRange(selectedEvent?.start_time, selectedEvent?.end_time)}</p>
          <p><strong>Description:</strong> {selectedEvent?.description || 'N/A'}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarMainLayer;
