import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { apiGet } from "../../Services/api";
import "./MyOrdersPage.css";

interface Order {
    id: number;
    orderNumber: string;
    orderDate: string;
    status: string;
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    totalAmount: number;
    shippingAddress: string;
    paymentStatus: string;
    paymentMethod: string;
}

function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiGet<Order[]>("/orders", true);
                setOrders(data);
            } catch (error) {
                console.error("Error loading orders:", error);
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <>
            <Navbar />

            <main className="my-orders-page">
                <div className="my-orders-container">
                    <h1>My Orders</h1>
                    <p className="my-orders-subtitle">
                        View and track your previous orders.
                    </p>

                    {loading && <p>Loading orders...</p>}

                    {error && (
                        <p className="orders-error">{error}</p>
                    )}

                    {!loading && !error && orders.length === 0 && (
                        <div className="no-orders">
                            <h2>No orders yet</h2>
                            <p>You haven't placed any orders yet.</p>
                            <Link to="/products">Start Shopping</Link>
                        </div>
                    )}

                    {!loading && !error && orders.length > 0 && (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div className="order-row" key={order.id}>
                                    <div>
                                        <span className="order-number">
                                            #{order.orderNumber}
                                        </span>
                                        <p>
                                            {new Date(order.orderDate)
                                                .toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="order-row-label">
                                            Status
                                        </span>
                                        <p>{order.status}</p>
                                    </div>

                                    <div>
                                        <span className="order-row-label">
                                            Payment
                                        </span>
                                        <p>{order.paymentStatus}</p>
                                    </div>

                                    <div>
                                        <span className="order-row-label">
                                            Total
                                        </span>
                                        <p className="order-total">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <Link className="view-order-btn" to={`/orders/${order.id}`}>
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main >

            <Footer />
        </>
    );
}

export default MyOrdersPage;