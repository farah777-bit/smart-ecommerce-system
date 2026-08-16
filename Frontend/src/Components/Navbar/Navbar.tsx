import { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">

            <div className="logo-section">
                <img src={logo} alt="Logo" />
                <h2>SmartCommerce CMS</h2>
            </div>

            <div
                className={menuOpen ? "nav-links active" : "nav-links"}
            >

                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <a href="/#categories">Categories</a>
                <Link to="#">AI Search</Link>
                <Link to="/cart">Cart</Link>
                <Link to="#">Profile</Link>
                <Link to="/login">Login</Link>
            </div>

            <button
                className="menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <FaBars />
            </button>

        </nav>
    );
}

export default Navbar;