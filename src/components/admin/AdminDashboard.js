import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiVideo,
  FiMail,
  FiUploadCloud,
  FiTrash2,
  FiEdit2,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiLayers,
} from "react-icons/fi";
import axios from "axios";
import "./AdminDashboard.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Social Media & Cinematic Edits",
  "Client & Event Video Editing",
  "Devotional Video Editing",
  "Promotional Video Editing",
  "YouTube Video",
  "Other",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState({ type: "", text: "" });

  // Upload Form State
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Video State
  const [editingVideo, setEditingVideo] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: "", text: "" }), 5000);
  };

  // Fetch Videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/videos`);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Failed to load videos:", err);
    }
  };

  // Fetch Contact Messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/contact`, getAuthHeaders());
      setMessages(res.data.messages || []);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  // Upload Video to Google Drive & PostgreSQL
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      showAlert("error", "Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("display_order", displayOrder);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await axios.post(`${API_BASE}/api/videos`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      showAlert("success", "Video uploaded to Google Drive & saved successfully!");
      // Reset form
      setVideoFile(null);
      setTitle("");
      setDescription("");
      setDisplayOrder(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchVideos();
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.error || "Upload failed. Check Google Drive credentials & size limit."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete Video
  const handleDeleteVideo = async (id, videoTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${videoTitle}"? It will be removed from Google Drive and PostgreSQL.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/videos/${id}`, getAuthHeaders());
      showAlert("success", `Video "${videoTitle}" deleted successfully.`);
      fetchVideos();
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.error || "Failed to delete video."
      );
    }
  };

  // Edit Video Metadata
  const handleUpdateMetadata = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      await axios.put(
        `${API_BASE}/api/videos/${editingVideo.id}`,
        {
          title: editingVideo.title,
          description: editingVideo.description,
          category: editingVideo.category,
          display_order: editingVideo.display_order,
        },
        getAuthHeaders()
      );
      showAlert("success", "Video details updated successfully.");
      setEditingVideo(null);
      fetchVideos();
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.error || "Failed to update video."
      );
    }
  };

  return (
    <div className="admin-dash">
      <header className="admin-nav">
        <div className="container admin-nav-inner">
          <div className="admin-brand">
            NIXON PORTFOLIO <span style={{ color: "var(--accent)" }}>CMS</span>
          </div>

          <div className="admin-nav-actions">
            <Link to="/" target="_blank" className="btn btn-outline" style={{ padding: "8px 16px" }}>
              View Portfolio <FiExternalLink />
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: "8px 16px" }}
            >
              Logout <FiLogOut />
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {alert.text && (
          <div
            className={`admin-error-box`}
            style={{
              borderColor: alert.type === "success" ? "#4ade80" : "var(--accent)",
              color: alert.type === "success" ? "#4ade80" : "#ff5c7a",
              background: alert.type === "success" ? "rgba(74, 222, 128, 0.1)" : "rgba(255, 59, 92, 0.12)",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {alert.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            {alert.text}
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            <FiVideo /> Manage Videos ({videos.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "inquiries" ? "active" : ""}`}
            onClick={() => setActiveTab("inquiries")}
          >
            <FiMail /> Inquiries ({messages.length})
          </button>
        </div>

        {activeTab === "videos" && (
          <>
            {/* Upload Video Section */}
            <div className="admin-panel-card">
              <h3>
                <FiUploadCloud style={{ color: "var(--accent)" }} /> Add New Video to Google Drive
              </h3>
              <form onSubmit={handleUpload} className="admin-video-form">
                <div className="admin-form-group full-col">
                  <label>Select Video File (.mp4, .webm, .mov)</label>
                  <label className="admin-file-picker">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                    <FiUploadCloud style={{ fontSize: "2rem", color: "var(--accent)", marginBottom: 8 }} />
                    <p style={{ fontWeight: 500 }}>
                      {videoFile ? videoFile.name : "Click to select a video from your computer"}
                    </p>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {videoFile
                        ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB`
                        : "Up to 500 MB"}
                    </span>
                  </label>
                  {isUploading && (
                    <div className="admin-progress-bar-wrap">
                      <div
                        className="admin-progress-bar"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label>Video Title</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    placeholder="e.g. Wedding Cinematic Highlight"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    className="admin-input-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Display Order (0 = highest priority)</label>
                  <input
                    type="number"
                    className="admin-input-control"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  />
                </div>

                <div className="admin-form-group full-col">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    className="admin-input-control"
                    placeholder="Brief description of the edit and visual technique used..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="full-col">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUploading}
                    style={{ minWidth: 200 }}
                  >
                    {isUploading ? `Uploading (${uploadProgress}%)...` : "Upload to Google Drive"}
                  </button>
                </div>
              </form>
            </div>

            {/* Video List */}
            <div className="admin-panel-card">
              <h3>
                <FiLayers style={{ color: "var(--accent)" }} /> Existing Portfolio Videos
              </h3>

              {videos.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>
                  No videos stored yet. Upload a video above or ensure the backend server is running.
                </p>
              ) : (
                <div className="admin-videos-grid">
                  {videos.map((vid) => (
                    <div key={vid.id} className="admin-video-card">
                      <div className="admin-video-preview">
                        <video
                          src={`${API_BASE}${vid.stream_url}`}
                          preload="metadata"
                          controls
                        />
                      </div>
                      <div className="admin-video-details">
                        <h4>{vid.title}</h4>
                        <p>{vid.description || "No description provided."}</p>
                        <div className="admin-video-meta">
                          <span>{vid.category}</span>
                          <span>Order: {vid.display_order}</span>
                        </div>
                        <div className="admin-video-actions">
                          <button
                            className="btn btn-outline"
                            style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                            onClick={() => setEditingVideo(vid)}
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{
                              borderColor: "var(--accent)",
                              color: "var(--accent)",
                              padding: "8px 12px",
                              fontSize: "0.85rem",
                            }}
                            onClick={() => handleDeleteVideo(vid.id, vid.title)}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Modal */}
            {editingVideo && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: 20,
                }}
              >
                <div
                  className="admin-panel-card"
                  style={{ maxWidth: 520, width: "100%", margin: 0 }}
                >
                  <h3>Edit Video Details</h3>
                  <form onSubmit={handleUpdateMetadata}>
                    <div className="admin-form-group" style={{ marginBottom: 14 }}>
                      <label>Title</label>
                      <input
                        type="text"
                        className="admin-input-control"
                        value={editingVideo.title}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 14 }}>
                      <label>Category</label>
                      <select
                        className="admin-input-control"
                        value={editingVideo.category}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, category: e.target.value })
                        }
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 14 }}>
                      <label>Display Order</label>
                      <input
                        type="number"
                        className="admin-input-control"
                        value={editingVideo.display_order}
                        onChange={(e) =>
                          setEditingVideo({
                            ...editingVideo,
                            display_order: parseInt(e.target.value, 10) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 20 }}>
                      <label>Description</label>
                      <textarea
                        rows={3}
                        className="admin-input-control"
                        value={editingVideo.description || ""}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, description: e.target.value })
                        }
                      />
                    </div>
                    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setEditingVideo(null)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "inquiries" && (
          <div className="admin-panel-card">
            <h3>
              <FiMail style={{ color: "var(--accent)" }} /> Inbound Inquiries
            </h3>
            {messages.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No inquiries received yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Project Type</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id}>
                        <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ fontWeight: 600 }}>{msg.name}</td>
                        <td>
                          <a href={`mailto:${msg.email}`} style={{ color: "var(--accent)" }}>
                            {msg.email}
                          </a>
                        </td>
                        <td>
                          <span className="badge-read">{msg.project_type}</span>
                        </td>
                        <td style={{ maxWidth: 300 }}>{msg.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
