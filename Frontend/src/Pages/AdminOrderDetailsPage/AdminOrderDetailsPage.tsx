import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { apiGet, apiPut } from "../../Services/api";

import "./AdminOrderDetailsPage.css";

type OrderItem = {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

type OrderStatusHistory = {
    id: number;
    previousStatus: string;
    newStatus: string;
    changedAt: string;
    changedByUserId: number | null;
    changedByUserName: string;
};

type AdminOrderDetails = {
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

    userId: number;
    customerName: string;
    customerEmail: string;

    items: OrderItem[];
    statusHistory: OrderStatusHistory[];
};

function AdminOrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    
    const [order, setOrder] =
        useState<AdminOrderDetails | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");


    const handleStatusUpdate = async () => {
        if (!order) return;

        if (selectedStatus === order.status) {
            return;
        }

        try {
            setUpdatingStatus(true);
            setStatusMessage("");
            setError("");

            await apiPut(
                `/orders/admin/${order.id}/status`,
                {
                    status: selectedStatus,
                },
                true
            );

            setOrder({
                ...order,
                status: selectedStatus,
            });

            setStatusMessage(
                "Order status updated successfully."
            );

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not update order status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };
    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await apiGet<AdminOrderDetails>(
                        `/orders/admin/${id}`,
                        true
                    );

                setOrder(data);
                setSelectedStatus(data.status);

            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Could not load order."
                );
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

                <main className="admin-order-details">
                    <p>Loading order...</p>
                </main>

                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Navbar />

                <main className="admin-order-details">
                    <p>
                        {error || "Order was not found."}
                    </p>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="admin-order-details">
                <div className="admin-order-details-container">

                    <div className="order-details-header">
                        <div>
                            <span>Administration</span>

                            <h1>Order Details</h1>

                            <p>{order.orderNumber}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin/orders")
                            }
                        >
                            Back to Orders
                        </button>
                    </div>

                    <div className="order-details-grid">

                        <section className="order-details-card">
                            <h2>Order Information</h2>

                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                    order.orderDate
                                ).toLocaleString()}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {order.status}
                            </p>

                            <p>
                                <strong>
                                    Payment Status:
                                </strong>{" "}
                                {order.paymentStatus}
                            </p>
                            <p>
                                <strong>
                                    Payment Method:
                                </strong>{" "}
                                {order.paymentMethod}
                            </p>
                            <div className="admin-status-control">
                                <label htmlFor="orderStatus">
                                    Update Order Status
                                </label>

                                <div className="admin-status-row">
                                    <select
                                        id="orderStatus"
                                        value={selectedStatus}
                                        onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                        }
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Processing">
                                            Processing
                                        </option>

                                        <option value="Shipped">
                                            Shipped
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleStatusUpdate}
                                        disabled={
                                            updatingStatus ||
                                            selectedStatus === order.status
                                        }
                                    >
                                        {updatingStatus
                                            ? "Updating..."
                                            : "Update Status"}
                                    </button>
                                </div>

                                {statusMessage && (
                                    <p className="status-success-message">
                                        {statusMessage}
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="order-details-card">
                            <h2>Customer</h2>

                            <p>
                                <strong>Name:</strong>{" "}
                                {order.customerName}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {order.customerEmail}
                            </p>

                            <p>
                                <strong>
                                    Shipping Address:
                                </strong>{" "}
                                {order.shippingAddress}
                            </p>
                        </section>

                    </div>

                    <section className="order-details-card order-items-section">
                        <h2>Order Items</h2>

                        <div className="order-items-table-wrapper">
                            <table className="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.productName}
                                            </td>

                                            <td>
                                                $
                                                {item.unitPrice.toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                {item.quantity}
                                            </td>

                                            <td>
                                                $
                                                {item.totalPrice.toFixed(
                                                    2
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="order-details-card details-order-summary">
                        <h2>Order Summary</h2>

                        <div>
                            <span>Subtotal</span>
                            <strong>
                                ${order.subtotal.toFixed(2)}
                            </strong>
                        </div>

                        <div>
                            <span>Discount</span>
                            <strong>
                                -$
                                {order.discountAmount.toFixed(2)}
                            </strong>
                        </div>

                        <div>
                            <span>Shipping</span>
                            <strong>
                                ${order.shippingCost.toFixed(2)}
                            </strong>
                        </div>
                        <div className="order-summary-total">
                            <span>Total</span>
                            <strong>
                                ${order.totalAmount.toFixed(2)}
                            </strong>
                        </div>
                    </section>
                    <section className="order-details-card status-history-section">
                        <h2>Status History</h2>

                        {order.statusHistory.length === 0 ? (
                            <p className="no-status-history">
                                No status changes yet.
                            </p>
                        ) : (
                            <div className="status-history-list">
                                {order.statusHistory.map((history) => (
                                    <div
                                        key={history.id}
                                        className="status-history-item"
                                    >
                                        <div className="status-history-dot"></div>

                                        <div className="status-history-content">
                                            <div className="status-history-change">
                                                <span>{history.previousStatus}</span>

                                                <strong>→</strong>

                                                <span>{history.newStatus}</span>
                                            </div>

                                            <div className="status-history-info">
                                                <span>
                                                    {new Date(
                                                        history.changedAt
                                                    ).toLocaleString()}
                                                </span>

                                                {history.changedByUserName && (
                                                    <span>
                                                        Changed by{" "}
                                                        {history.changedByUserName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default AdminOrderDetailsPage;