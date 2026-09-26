import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { apiGet } from "../../Services/api";
import "./OrderDetailsPage.css";

interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

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
    items: OrderItem[];
}

function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrder = async () => {
            if (!id) {
                setError("Invalid order.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await apiGet<Order>(`/orders/${id}`, true);
                setOrder(data);
            } catch (error) {
                console.error("Error loading order:", error);
                setError("Failed to load order.");
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="order-details-page">
                    <p className="order-message">Loading order...</p>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Navbar />
                <main className="order-details-page">
                    <p className="order-message">
                        {error || "Order not found."}
                    </p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="order-details-page">
                <div className="order-details-container">

                    <div className="order-header">
                        <div>
                            <span className="order-label">ORDER DETAILS</span>
                            <h1>Order #{order.orderNumber}</h1>
                            <p>
                                Placed on{" "}
                                {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                        </div>

                        <span className="order-status">
                            {order.status}
                        </span>
                    </div>

                    <div className="order-layout">

                        <div className="order-left">

                            <section className="order-card">
                                <h2>Order Items</h2>

                                {order.items.map((item) => (
                                    <div
                                        className="order-item"
                                        key={item.id}
                                    >
                                        <div>
                                            <h3>{item.productName}</h3>
                                            <p>
                                                {item.quantity} × $
                                                {item.unitPrice.toFixed(2)}
                                            </p>
                                        </div>
                                        <strong>
                                            ${item.totalPrice.toFixed(2)}
                                        </strong>
                                    </div>
                                ))}
                            </section>

                            <section className="order-card">
                                <h2>Shipping Information</h2>
                                <p>{order.shippingAddress}</p>
                            </section>

                            <section className="order-card">
                                <h2>Payment Information</h2>

                                <div className="info-row">
                                    <span>Payment Method</span>
                                    <strong>{order.paymentMethod}</strong>
                                </div>

                                <div className="info-row">
                                    <span>Payment Status</span>
                                    <strong>{order.paymentStatus}</strong>
                                </div>
                            </section>

                        </div>

                        <aside className="order-card order-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Discount</span>
                                <span>
                                    -${order.discountAmount.toFixed(2)}
                                </span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>
                                    ${order.shippingCost.toFixed(2)}
                                </span>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <strong>
                                    ${order.totalAmount.toFixed(2)}
                                </strong>
                            </div>
                        </aside>

                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default OrderDetailsPage;