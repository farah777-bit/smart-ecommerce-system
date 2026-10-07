import { useEffect, useState } from "react";
import {
    FaBoxOpen,
    FaShoppingBag,
    FaUsers,
    FaDollarSign,
} from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { apiGet } from "../../Services/api";

import "./AdminDashboardPage.css";
import { Link } from "react-router-dom";

type AdminDashboard = {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
};

function AdminDashboardPage() {
    const [dashboard, setDashboard] =
        useState<AdminDashboard | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await apiGet<AdminDashboard>(
                        "/admin/dashboard",
                        true
                    );

                setDashboard(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Could not load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <>
            <Navbar />

            <main className="admin-dashboard">
                <div className="admin-heading">
                    <span>Administration</span>
                    <h1>Dashboard</h1>
                    <p>
                        Overview of your store activity.
                    </p>
                </div>

                {loading && (
                    <p>Loading dashboard...</p>
                )}

                {error && (
                    <p className="admin-error">
                        {error}
                    </p>
                )}

                {dashboard && (
                    <div className="admin-stats">
                        <div className="admin-stat-card">
                            <FaBoxOpen />

                            <div>
                                <span>Total Products</span>
                                <strong>
                                    {dashboard.totalProducts}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-stat-card">
                            <FaShoppingBag />

                            <div>
                                <span>Total Orders</span>
                                <strong>
                                    {dashboard.totalOrders}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-stat-card">
                            <FaUsers />

                            <div>
                                <span>Total Users</span>
                                <strong>
                                    {dashboard.totalUsers}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-stat-card">
                            <FaDollarSign />

                            <div>
                                <span>Total Revenue</span>
                                <strong>
                                    ${dashboard.totalRevenue.toFixed(2)}
                                </strong>
                            </div>
                        </div>
                    </div>
                )}
                <div className="admin-management">
                    <h2>Store Management</h2>

                    <div className="admin-management-grid">
                        <Link
                            to="/admin/products"
                            className="admin-management-card"
                        >
                            <FaBoxOpen />

                            <div>
                                <h3>Products</h3>
                                <p>
                                    Add, edit and manage store products.
                                </p>
                            </div>
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="admin-management-card"
                        >
                            <FaShoppingBag />

                            <div>
                                <h3>Orders</h3>
                                <p>
                                    View and manage customer orders.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default AdminDashboardPage;