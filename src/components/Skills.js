import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "../data/portfolioData";
import "./Skills.css";

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="skills" className="section">
      <div className="container" ref={ref}>
        <div className="section-head">
          <span className="section-tag">Skills</span>
          <h2 className="section-title">What I'm Good At</h2>
          <p className="section-sub">
            Core editing skills sharpened across client, event, devotional
            and social media projects.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((skill, i) => (
            <motion.div
              className="skill-chip"
              key={skill.label}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 18, scale: 0.96 }
              }
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <span className="skill-chip-dot" />
              <span className="skill-chip-label">{skill.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
