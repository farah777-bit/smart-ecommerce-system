
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaHeart, FaLock, FaSignOutAlt } from "react-icons/fa";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./ProfilePage.css";

interface User {
    id: number;
    fullName: string;
    email: string;
    roles: string[];
}

function ProfilePage() {
    const navigate = useNavigate();

    const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

    const user: User | null = storedUser
        ? JSON.parse(storedUser)
        : null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));
        navigate("/login");
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <main className="profile-page">
                    <div className="profile-container">
                        <p>Please login to view your profile.</p>
                        <Link to="/login">Login</Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="profile-page">
                <div className="profile-container">

                    <div className="profile-header">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>

                        <div>
                            <h1>{user.fullName}</h1>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-content">

                        <aside className="profile-menu">
                            <div className="profile-menu-title">
                                <FaUser />
                                <span>My Profile</span>
                            </div>

                            <Link to="/orders">
                                <FaBox />
                                <span>My Orders</span>
                            </Link>

                            <Link to="/wishlist">
                                <FaHeart />
                                <span>Wishlist</span>
                            </Link>

                            <button type="button">
                                <FaLock />
                                <span>Security</span>
                            </button>

                            <button
                                type="button"
                                className="profile-logout"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </aside>

                        <section className="profile-details">
                            <h2>Personal Information</h2>

                            <div className="profile-field">
                                <label>Full Name</label>
                                <p>{user.fullName}</p>
                            </div>

                            <div className="profile-field">
                                <label>Email Address</label>
                                <p>{user.email}</p>
                            </div>

                            <div className="profile-field">
                                <label>Account Role</label>
                                <p>{user.roles.join(", ")}</p>
                            </div>
                            <div className="profile-orders-card">
                                <div>
                                    <FaBox />
                                    <div>
                                        <h3>My Orders</h3>
                                        <p>
                                            View your order history and
                                            purchase details.
                                        </p>
                                    </div>
                                </div>

                                <Link to="/orders">
                                    View Orders
                                </Link>
                            </div>
                        </section >

                    </div >
                </div >
            </main >

            <Footer />
        </>
    );
}

export default ProfilePage;