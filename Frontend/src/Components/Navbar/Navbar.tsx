import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaBars,
    FaUserCircle,
    FaSignOutAlt,
    FaBox,
    FaHeart,
} from "react-icons/fa";

import "./Navbar.css";
import logo from "../../assets/images/logo.png";

function Navbar() {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = () => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        setIsLoggedIn(Boolean(token));
    };

    useEffect(() => {
        checkLoginStatus();

        window.addEventListener("authChanged", checkLoginStatus);
        window.addEventListener("storage", checkLoginStatus);

        return () => {
            window.removeEventListener("authChanged", checkLoginStatus);
            window.removeEventListener("storage", checkLoginStatus);
        };
    }, []);

    const closeMenu = () => {
        setMenuOpen(false);
        setAccountOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setIsLoggedIn(false);
        setMenuOpen(false);
        setAccountOpen(false);

        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo-section" onClick={closeMenu}>
                <img src={logo} alt="Logo" />
                <h2>SmartCommerce CMS</h2>
            </Link>

            <div className={menuOpen ? "nav-links active" : "nav-links"}>
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
                    <div className="account-menu">
                        <button
                            type="button"
                            className="account-btn"
                            onClick={() =>
                                setAccountOpen((current) => !current)
                            }
                        >
                            <FaUserCircle />
                            <span>My Account</span>
                        </button>

                        {accountOpen && (
                            <div className="account-dropdown">
                                <Link to="/profile" onClick={closeMenu}>
                                    <FaUserCircle />
                                    My Profile
                                </Link>

                                <Link to="/orders" onClick={closeMenu}>
                                    <FaBox />
                                    My Orders
                                </Link>

                                <Link to="/wishlist" onClick={closeMenu}>
                                    <FaHeart />
                                    Wishlist
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="dropdown-logout"
                                >
                                    <FaSignOutAlt />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" onClick={closeMenu}>
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