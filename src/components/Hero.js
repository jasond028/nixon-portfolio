import { motion } from "framer-motion";
import { FiArrowDown, FiDownload, FiMail, FiPhone } from "react-icons/fi";
import { FaGoogleDrive } from "react-icons/fa";
import { personal, summary, projects } from "../data/portfolioData";
import "./Hero.css";

export default function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="hero">
      <div className="hero-glow glow-1" />
      <div className="hero-glow glow-2" />
      <div className="film-strip film-strip-left" />
      <div className="film-strip film-strip-right" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Video Editor · Coimbatore, India
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {personal.name}
          </motion.h1>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {personal.tagline}
          </motion.p>

          <motion.p
            className="hero-summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {summary}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <button className="btn btn-primary" onClick={() => scrollTo("portfolio")}>
              View My Work <FiArrowDown />
            </button>
            <a
              className="btn btn-outline"
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
          </motion.div>

          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <a href={`mailto:${personal.email}`} aria-label="Email">
              <FiMail />
            </a>
            <a href={`tel:${personal.phone}`} aria-label="Phone">
              <FiPhone />
            </a>
            <a
              href={personal.driveLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Google Drive"
            >
              <FaGoogleDrive />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-frame">
            <span className="hero-frame-corner tl" />
            <span className="hero-frame-corner tr" />
            <span className="hero-frame-corner bl" />
            <span className="hero-frame-corner br" />

            <video
              className="hero-frame-video"
              src={projects[0].src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />

            {/* <button
              className="hero-frame-play"
              onClick={() => scrollTo("portfolio")}
              aria-label="View portfolio"
            >
              <FiPlay />
            </button> */}

            <span className="hero-frame-tag">Now Editing · Reel 2026</span>
          </div>

          {/* <motion.div
            className="hero-badge badge-projects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <strong>{projects.length}+</strong>
            <span>Edited Projects</span>
          </motion.div> */}

          <motion.div
            className="hero-badge badge-wave"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <span className="wave-bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>Audio Synced</span>
          </motion.div>
        </motion.div>
      </div>

      <button className="scroll-cue" onClick={() => scrollTo("about")}>
        <span />
      </button>
    </section>
  );
}
