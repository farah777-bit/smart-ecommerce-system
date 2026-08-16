import "./LoginPage.css";
import logo from "../../assets/images/logo.png";
import loginImage from "../../assets/images/loginImage.png"
import { Link } from "react-router-dom";

function LoginPage() {
    return (
        <div className="login-container">
            <div className="login-image">
                <img src={loginImage} alt="Login" />
            </div>

            <div className="login-card">
                <img src={logo} alt="Logo" className="logo" />

                <h1>SmartCommerce CMS</h1>

                <p>
                    AI-Powered E-Commerce Content Management System
                </p>

                <form>

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                    />

                    <div className="login-options">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <button>Login</button>

                </form>

                <p className="register">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

            </div>
        </div>
    );
}

export default LoginPage;