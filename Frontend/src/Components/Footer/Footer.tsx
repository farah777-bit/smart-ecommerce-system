import { Link } from "react-router-dom";
import "./Footer.css";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-section">

                    <h2>SmartCommerce CMS</h2>

                    <p>
                        AI-powered e-commerce content management system
                        designed to improve shopping experience.
                    </p>

                </div>

                <div className="footer-section">

                    <h3>Quick Links</h3>

                    <a href="#">Home</a>
                    <a href="/#featured-products">Products</a>
                    <a href="/#categories">Categories</a>
                    <Link to="/login">Login</Link>

                </div>

                <div className="footer-section">

                    <h3>Contact</h3>

                    <p><FaEnvelope /> support@smartcommerce.com</p>

                    <p><FaPhone /> +963 999 999 999</p>

                    <p><FaMapMarkerAlt /> Latakia, Syria</p>

                </div>

                <div className="footer-section">

                    <h3>Follow Us</h3>

                    <div className="social-icons">

                        <FaFacebook />
                        <FaInstagram />
                        <FaLinkedin />

                    </div>

                </div>

            </div>

            <hr />

            <p className="copyright">
                © 2026 SmartCommerce CMS. All Rights Reserved.
            </p>

        </footer>
    );
}

export default Footer;