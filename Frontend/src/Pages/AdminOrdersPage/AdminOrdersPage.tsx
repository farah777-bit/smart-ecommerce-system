import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import { apiGet } from "../../Services/api";

import "./AdminOrdersPage.css";
import { Link } from "react-router-dom";

type AdminOrder = {
    id: number;
    orderNumber: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    paymentStatus: string;
    userId: number;
    customerName: string;
    customerEmail: string;
};

function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiGet<AdminOrder[]>(
                    "/orders/admin",
                    true
                );

                setOrders(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Could not load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <>
            <Navbar />

            <main className="admin-orders">
                <div className="admin-orders-container">

                    <div className="admin-orders-header">
                        <span>Administration</span>

                        <h1>Orders</h1>

                        <p>
                            View and manage customer orders.
                        </p>
                    </div>

                    {error && (
                        <p className="admin-orders-error">
                            {error}
                        </p>
                    )}

                    <div className="admin-orders-card">

                        {loading ? (
                            <p className="admin-orders-message">
                                Loading orders...
                            </p>
                        ) : orders.length === 0 ? (
                            <p className="admin-orders-message">
                                No orders found.
                            </p>
                        ) : (
                            <div className="admin-orders-table-wrapper">

                                <table className="admin-orders-table">

                                    <thead>
                                        <tr>
                                            <th>Order</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>

                                                <td>
                                                    <strong>
                                                        {order.orderNumber}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <div className="order-customer">
                                                        <strong>
                                                            {order.customerName}
                                                        </strong>
<span>
                                                            {order.customerEmail}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {new Date(
                                                        order.orderDate
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td>
                                                    ${order.totalAmount.toFixed(2)}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`order-badge${order.paymentStatus.toLowerCase()}`}
                                                    >
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`order-badge ${order.status.toLowerCase()}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>

                                    <td>
                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                    className="view-order-btn"
                                                    title="View Order"
>
                                                    <FaEye />
                                                </Link>
                                    </td>

                                </tr>
                                        ))}
                            </tbody>

                                </table>

                </div>
                        )}

            </div>

        </div >
            </main >

        <Footer />
        </>
    );
}

export default AdminOrdersPage;