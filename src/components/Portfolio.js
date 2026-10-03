import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiPlay, FiVolume2, FiVolumeX, FiExternalLink } from "react-icons/fi";
import { FaGoogleDrive } from "react-icons/fa";
import axios from "axios";
import { projects as defaultProjects, personal } from "../data/portfolioData";
import "./Portfolio.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ReelCard({ project, index, activeIndex, setActiveIndex }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const isActive = activeIndex === index;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      setActiveIndex(index);
      video.play().catch((err) => console.log("Autoplay prevented:", err));
      setPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  // pause automatically if another card becomes active
  useEffect(() => {
    if (!isActive && playing) {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [isActive, playing]);

  // Determine video URL (from backend Google Drive stream or fallback static URL)
  const videoSrc = project.stream_url
    ? `${API_BASE}${project.stream_url}`
    : project.src;

  return (
    <motion.article
      className="reel-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
    >
      <div className="reel-video-wrap" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={videoSrc}
          preload="metadata"
          playsInline
          muted={muted}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => {
            setPlaying(true);
            setActiveIndex(index);
          }}
        />

        {!playing && (
          <div className="reel-play-overlay">
            <span className="reel-play-btn">
              <FiPlay />
            </span>
          </div>
        )}

        {playing && (
          <button className="reel-mute-btn" onClick={toggleMute} aria-label="Toggle mute">
            {muted ? <FiVolumeX /> : <FiVolume2 />}
          </button>
        )}

        <span className="reel-category">{project.category}</span>
      </div>

      <div className="reel-info">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </motion.article>
  );
}

export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    const fetchPortfolioVideos = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/videos`);
        if (res.data?.videos && res.data.videos.length > 0) {
          setVideoList(res.data.videos);
        } else {
          // Gracefully fallback to default demo projects if database is empty
          setVideoList(defaultProjects);
        }
      } catch (err) {
        // Fallback to default projects if backend is starting or offline
        setVideoList(defaultProjects);
      }
    };

    fetchPortfolioVideos();
  }, []);

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Selected Edits</h2>
          <p className="section-sub">
            Scroll through the reel and tap any video to play it.
          </p>
        </div>

        <div className="reel-scroller">
          {videoList.map((project, i) => (
            <ReelCard
              key={project.id || i}
              project={project}
              index={i}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}

          <motion.a
            className="reel-more"
            href={personal.driveLink}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <FaGoogleDrive className="reel-more-icon" />
            <h3>View More Work</h3>
            <p>Full raw &amp; edited library on Google Drive</p>
            <span className="btn btn-primary">
              Open Drive Folder <FiExternalLink />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

