import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiDownload, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { FaGoogleDrive } from "react-icons/fa";
import axios from "axios";
import { personal } from "../data/portfolioData";
import "./Contact.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PROJECT_TYPES = [
  "YouTube Video",
  "Short/Reel",
  "Promotional Video",
  "Cinematic Video",
  "Wedding/Event",
  "Other",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project_type: "YouTube Video",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    // Basic client validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage({ type: "error", text: "Please fill out all required fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatusMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/contact`, formData);
      setStatusMessage({
        type: "success",
        text: res.data.message || "Thank you! Your message has been sent successfully.",
      });
      // Clear form
      setFormData({
        name: "",
        email: "",
        project_type: "YouTube Video",
        message: "",
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          "Unable to send message at this time. Please try contacting via email directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Let's Cut Something Great</h2>
          <p className="section-sub">
            Available for freelance and project-based video editing work. Have a vision? Send a message below.
          </p>

          {/* Interactive Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            {statusMessage && (
              <div
                className={`contact-alert ${
                  statusMessage.type === "success" ? "contact-alert-success" : "contact-alert-error"
                }`}
              >
                {statusMessage.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <div className="contact-form-grid">
              <div className="contact-form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>

              <div className="contact-form-group full-width">
                <label htmlFor="project_type">Project Type / Category *</label>
                <select
                  id="project_type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  required
                >
                  {PROJECT_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-form-group full-width">
                <label htmlFor="message">Message / Project Details *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your footage, deadlines, style references, or turnaround time..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary contact-submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Send Inquiry <FiSend />
                </>
              )}
            </button>
          </form>

          <div className="contact-divider" />

          {/* Original Contact Links & Action Buttons */}
          <div className="contact-links">
            <a href={`mailto:${personal.email}`}>
              <FiMail /> {personal.email}
            </a>
            <a href={`tel:${personal.phone}`}>
              <FiPhone /> {personal.phone}
            </a>
            <span>
              <FiMapPin /> {personal.location}
            </span>
          </div>

          <div className="contact-actions">
            <a
              className="btn btn-primary"
              href={personal.resumeFile}
              download={personal.resumeName}
            >
              Download Resume <FiDownload />
            </a>
            <a
              className="btn btn-outline"
              href={personal.driveLink}
              target="_blank"
              rel="noreferrer"
            >
              View Full Work <FaGoogleDrive />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

