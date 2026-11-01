import { Link } from "react-router-dom";

// Footer appears on every page via App.jsx
function Footer() {
  return (
    <footer className="bg-ink text-paper py-10 px-8 text-center">
      <div className="flex flex-col items-center gap-1">
        {/* The accent-2 (amber) icon colour matches the original style.css footer */}
        <span className="text-accent-2 text-[1.5rem]">◈</span>
        <span className="font-semibold text-[1rem]">Spendly</span>
        <p className="text-[0.8rem] text-ink-faint">Track every rupee. Own your finances.</p>
        <div className="flex flex-col items-center gap-1">
          <Link to="/terms">Terms and Conditions</Link>{" "}
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

