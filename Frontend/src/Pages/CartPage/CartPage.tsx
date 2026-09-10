import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaMinus,
    FaPlus,
    FaTrash,
    FaShoppingCart,
} from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import {
    apiDelete,
    apiGet,
    apiPut,
} from "../../Services/api";

import type {
    Cart,
    CartItem,
    UpdateCartItemQuantityRequest,
} from "../../Types/Cart";

import "./CartPage.css";

const emptyCart: Cart = {
    id: null,
    items: [],
    totalItems: 0,
    subtotal: 0,
};

function CartPage() {
    const navigate = useNavigate();

    const [cart, setCart] = useState<Cart>(emptyCart);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] =
        useState<number | null>(null);
    const [error, setError] = useState("");

    const loadCart = useCallback(async () => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setError("");

            const result = await apiGet<Cart>(
                "/Cart",
                true
            );

            setCart(result);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not load the cart."
            );
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const updateQuantity = async (
        item: CartItem,
        newQuantity: number
    ) => {
        if (newQuantity < 1) return;

        if (newQuantity > item.stockQuantity) {
            setError("The requested quantity exceeds available stock.");
            return;
        }

        const request: UpdateCartItemQuantityRequest = {
            quantity: newQuantity,
        };

        try {
            setUpdatingItemId(item.id);
            setError("");

            await apiPut<void>(
                `/Cart/items/${item.id}`,
                request,
                true
            );

            await loadCart();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not update the quantity."
            );
        } finally {
            setUpdatingItemId(null);
        }
    };

    const increaseQuantity = async (item: CartItem) => {
        await updateQuantity(
            item,
            item.quantity + 1
        );
    };

    const decreaseQuantity = async (item: CartItem) => {
        await updateQuantity(
            item,
            item.quantity - 1
        );
    };

    const removeItem = async (itemId: number) => {
        try {
            setUpdatingItemId(itemId);
            setError("");

            await apiDelete<void>(
                `/Cart/items/${itemId}`,
                true
            );

            await loadCart();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not remove the product."
            );
        } finally {
            setUpdatingItemId(null);
        }
    };

    const shipping = cart.subtotal > 0 ? 10 : 0;
    const total = cart.subtotal + shipping;

    return (
        <>
            <Navbar />

            <main className="cart-page">
                <div className="cart-heading">
                    <FaShoppingCart />

                    <div>
                        <h1>Shopping Cart</h1>
                        <p>
                            Review and update your selected products.
                        </p>
                    </div>
                </div>
                {error && (
                    <p className="cart-error-message">
                        {error}
                    </p>
                )}

                {isLoading ? (
                    <p className="cart-loading">
                        Loading your cart...
                    </p>
                ) : cart.items.length === 0 ? (
                    <section className="empty-cart">
                        <FaShoppingCart />
                        <h2>Your cart is empty</h2>
                        <p>
                            Add products to your cart before checkout.
                        </p>
                    </section>
                ) : (
                    <div className="cart-layout">
                        <section className="cart-items">
                            {cart.items.map((item) => (
                                <article
                                    className="cart-item"
                                    key={item.id}
                                >
                                    <img
                                        src={
                                            item.primaryImageUrl ||
                                            "/placeholder-product.jpg"
                                        }
                                        alt={item.productName}
                                        className="cart-item-image"
                                    />

                                    <div className="cart-item-info">
                                        <h2>{item.productName}</h2>

                                        <p className="cart-item-price">
                                            ${item.unitPrice.toFixed(2)}
                                        </p>

                                        <div className="quantity-control">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(item)
                                                }
                                                disabled={
                                                    item.quantity <= 1 ||
                                                    updatingItemId === item.id
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                <FaMinus />
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(item)
                                                }
                                                disabled={
                                                    item.quantity >=
                                                    item.stockQuantity ||
                                                    updatingItemId === item.id
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <p className="item-total">
                                            ${item.totalPrice.toFixed(2)}
                                        </p>
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                            disabled={
                                                updatingItemId === item.id
                                            }
                                        >
                                            <FaTrash />
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </section>

                        <aside className="order-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>
                                    ${cart.subtotal.toFixed(2)}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <strong>
                                    ${shipping.toFixed(2)}
                                </strong>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-row total-row">
                                <span>Total</span>
                                <strong>
                                    ${total.toFixed(2)}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className="checkout-button"
                            >
                                Proceed to Checkout
                            </button>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

export default CartPage;