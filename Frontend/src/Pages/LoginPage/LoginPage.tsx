import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";
import logo from "../../assets/images/logo.png";
import loginImage from "../../assets/images/loginImage.png";

import { apiPost } from "../../Services/api";

type LoginResponse = {
    token: string;
};

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");

        try {
            setLoading(true);

            const response = await apiPost<LoginResponse>(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            if (rememberMe) {
                localStorage.setItem("token", response.token);
            } else {
                sessionStorage.setItem("token", response.token);
            }

            navigate("/");
        } catch (error) {
            console.error("Login error:", error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Login failed.");
            }
        } finally {
            setLoading(false);
        }
    };

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

                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <label>Password</label>

                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="login-options">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(
                                        event.target.checked
                                    )
                                }
                            />
                            Remember me
                        </label>

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="submit">
                        {loading ? "Logging in..." : "Login"}
                    </button>
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