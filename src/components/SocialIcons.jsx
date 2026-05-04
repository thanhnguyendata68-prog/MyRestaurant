import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const iconStyle = {
  width: "28px",
  height: "28px",
  color: "#ffffff",
};

const linkStyle = {
  color: "inherit",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
};

export default function SocialIcons() {
  return (
    <div
      className="social-icons"
      style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center" }}
    >
      <a href="#" aria-label="Facebook" style={linkStyle}>
        <FaFacebookF style={iconStyle} />
      </a>
      <a href="#" aria-label="Instagram" style={linkStyle}>
        <FaInstagram style={iconStyle} />
      </a>
      <a href="#" aria-label="Twitter" style={linkStyle}>
        <FaTwitter style={iconStyle} />
      </a>
      <a href="#" aria-label="YouTube" style={linkStyle}>
        <FaYoutube style={iconStyle} />
      </a>
    </div>
  );
}
