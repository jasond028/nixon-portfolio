import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { strengths } from "../data/portfolioData";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-head">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">Behind The Timeline</h2>
          <p className="section-sub">
            What I bring to every project, beyond just cutting clips together.
          </p>
        </div>
{/* avoid */}
        <div className="about-grid">
          <motion.div
            className="about-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h3>Client, Event & Devotional Video Editor</h3>
            <p>
              I work across promotional, private event, college event,
              devotional, and social-media video projects — adapting pacing,
              tone, and style to whatever the content calls for. From
              cinematic intros to fast-cut Instagram reels, I shape raw
              footage into something worth watching.
            </p>
          </motion.div>

          <motion.ul
            className="about-strengths"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {strengths.map((s) => (
              <li key={s}>
                <FiCheckCircle className="check" />
                <span>{s}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
