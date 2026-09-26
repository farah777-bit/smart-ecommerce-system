import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "../../Services/api";
import "./ResetPasswordPage.css";

interface ResetState {
    email: string;
    token: string;
}

interface ResetResponse {
    message: string;
}

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as ResetState | null;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!state?.email || !state?.token) {
            setError("Invalid password reset request.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await apiPost<ResetResponse>(
                "/auth/reset-password",
                {
                    email: state.email,
                    token: state.token,
                    newPassword: password
                }
            );

            navigate("/login");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Password reset failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page">
            <div className="reset-card">
                <h1>Reset Password</h1>

                <p className="reset-description">
                    Create a new password for your account.
                </p>

                <form onSubmit={handleSubmit}>
                    <label>New Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />

                    {error && (
                        <div className="reset-error">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>
                </form>

                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
}

export default ResetPasswordPage;