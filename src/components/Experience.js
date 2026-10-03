import { motion } from "framer-motion";
import { FiFilm } from "react-icons/fi";
import { experience } from "../data/portfolioData";
import "./Experience.css";

export default function Experience() {
  return (
    <section id="experience" className="section alt-bg">
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Experience</span>
          <h2 className="section-title">Editing Experience</h2>
          <p className="section-sub">
            Project categories I've handled end-to-end, from raw footage to
            final export.
          </p>
        </div>

        <div className="timeline">
          {experience.map((item, i) => (
            <motion.div
              className="timeline-item"
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <div className="timeline-marker">
                <FiFilm />
              </div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
