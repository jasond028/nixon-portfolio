import { Link } from "react-router-dom";
import { personal } from "../data/portfolioData";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          NIXON<span className="brand-dot">.</span>
        </span>
        <p>
          © {new Date().getFullYear()} {personal.name}. Crafted frame by
          frame. •{" "}
          <Link
            to="/admin/login"
            style={{
              color: "inherit",
              opacity: 0.45,
              fontSize: "0.8rem",
              textDecoration: "none",
            }}
          >
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}

