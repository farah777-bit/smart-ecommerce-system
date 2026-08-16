import "./ForgotPasswordPage.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
    return (
        <div className="forgot-container">

            <div className="forgot-card">

                <img src={logo} alt="Logo" className="logo" />

                <h1>Forgot Password?</h1>

                <p>
                    Enter your email address and we'll send you
                    a link to reset your password.
                </p>

                <form>

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                    />

                    <button>
                        Send Reset Link
                    </button>

                </form>

                <Link to="/login" className="back-link">
                    ← Back to Login
                </Link>

            </div>

        </div>
    );
}

export default ForgotPasswordPage;