import { motion, AnimatePresence } from "framer-motion";
import "./Loader.css";

export default function Loader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="loader-mark">
            <span className="loader-slate">
              NIXON<span className="dot">.</span>
            </span>
            <motion.div
              className="loader-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
            <span className="loader-caption">loading reel…</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
