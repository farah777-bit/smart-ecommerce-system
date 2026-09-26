import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../../Services/api";
import "./ForgotPasswordPage.css";

interface ForgotPasswordResponse {
    message: string;
    token?: string;
}

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await apiPost<ForgotPasswordResponse>(
                "/auth/forgot-password",
                { email }
            );

            if (response.token) {
                navigate("/reset-password", {
                    state: {
                        email,
                        token: response.token
                    }
                });
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">
            <div className="forgot-card">
                <h1>Forgot Password?</h1>

                <p className="forgot-description">
                    Enter your email address and we'll help you
                    reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <label>Email Address</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    {error && (
                        <div className="forgot-error">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Please wait..." : "Continue"}
                    </button>
                </form>

                <Link to="/login" className="back-login">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;