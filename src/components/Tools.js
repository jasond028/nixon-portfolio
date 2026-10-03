import { motion } from "framer-motion";
import { SiDavinciresolve } from "react-icons/si";
import {
  FiMonitor,
  FiSmartphone,
  FiScissors,
  FiFilm,
} from "react-icons/fi";
import { tools } from "../data/portfolioData";
import "./Tools.css";

const iconMap = {
  davinci: <SiDavinciresolve />,
  capcut: <FiScissors />,
  alight: <FiFilm />,
  vn: <FiScissors />,
};

function ToolCard({ tool, index }) {
  return (
    <motion.div
      className="tool-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="tool-icon">{iconMap[tool.icon]}</div>
      <div className="tool-copy">
        <span className="tool-name">{tool.name}</span>
        <p className="tool-use">{tool.use}</p>
      </div>
    </motion.div>
  );
}

function ToolPanel({ label, icon, items, delayOffset }) {
  return (
    <motion.div
      className="tools-panel"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: delayOffset }}
    >
      <h3>
        <span className="tools-panel-icon">{icon}</span>
        {label}
      </h3>
      <div className="tools-list">
        {items.map((tool, i) => (
          <ToolCard tool={tool} index={i} key={tool.name} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Tools() {
  return (
    <section id="tools" className="section alt-bg">
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Tools</span>
          <h2 className="section-title">Editing Toolkit</h2>
          <p className="section-sub">
            The desktop and mobile tools I use to go from raw footage to a
            finished edit.
          </p>
        </div>

        <div className="tools-groups">
          <ToolPanel
            label="Desktop Tools"
            icon={<FiMonitor />}
            items={tools.desktop}
            delayOffset={0}
          />
          <ToolPanel
            label="Mobile Tools"
            icon={<FiSmartphone />}
            items={tools.mobile}
            delayOffset={0.15}
          />
        </div>
      </div>
    </section>
  );
}
