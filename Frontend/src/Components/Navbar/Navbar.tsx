import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaBars,
    FaUserCircle,
    FaSignOutAlt,
} from "react-icons/fa";

import "./Navbar.css";
import logo from "../../assets/images/logo.png";

function Navbar() {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = () => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        setIsLoggedIn(Boolean(token));
    };

    useEffect(() => {
        checkLoginStatus();

        window.addEventListener(
            "authChanged",
            checkLoginStatus
        );

        window.addEventListener(
            "storage",
            checkLoginStatus
        );

        return () => {
            window.removeEventListener(
                "authChanged",
                checkLoginStatus
            );

            window.removeEventListener(
                "storage",
                checkLoginStatus
            );
        };
    }, []);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setIsLoggedIn(false);
        setMenuOpen(false);

        window.dispatchEvent(new Event("authChanged"));

        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link
                to="/"
                className="logo-section"
                onClick={closeMenu}
            >
                <img src={logo} alt="Logo" />
                <h2>SmartCommerce CMS</h2>
            </Link>

            <div
                className={
                    menuOpen
                        ? "nav-links active"
                        : "nav-links"
                }
            >
                <Link to="/" onClick={closeMenu}>
                    Home
                </Link>

                <Link to="/products" onClick={closeMenu}>
                    Products
                </Link>

                <a href="/#categories" onClick={closeMenu}>
                    Categories
                </a>

                <Link to="#" onClick={closeMenu}>
                    AI Search
                </Link>

                <Link to="/cart" onClick={closeMenu}>
                    Cart
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link
                            to="/profile"
                            className="account-link"
                            onClick={closeMenu}
                        >
                            <FaUserCircle />
                            <span>My Account</span>
                        </Link>

                        <button
                            type="button"
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        onClick={closeMenu}
                    >
                        Login
                    </Link>
                )}
            </div>

            <button
                type="button"
                className="menu-btn"
                aria-label="Open navigation menu"
                onClick={() =>
                    setMenuOpen((current) => !current)
                }
            >
                <FaBars />
            </button>
        </nav>
    );
}

export default Navbar;