import "./RegisterPage.css";
import registerImage from "../../assets/images/loginImage.png";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

function RegisterPage() {
    return (
        <div className="register-container">
            <div className="register-image">
                <img src={registerImage} alt="Register" />
            </div>

            <div className="register-card">

                <img src={logo} alt="Logo" className="logo" />

                <h1>Create Account</h1>

                <p>Join SmartCommerce CMS and start managing your store.</p>

                <form>

                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                    />

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                    />

                    <button>Create Account</button>

                </form>

                <p className="login-link">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>

            </div>
        </div>
    );
}

export default RegisterPage;