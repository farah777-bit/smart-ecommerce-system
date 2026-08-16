import { useState } from "react";
import {
    FaMinus,
    FaPlus,
    FaTrash,
    FaShoppingCart,
} from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import "./CartPage.css";

import product1 from "../../assets/images/products/headphone.jfif";
import product2 from "../../assets/images/products/headphone.jfif";

type CartItem = {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
};

function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Wireless Headphones",
            image: product1,
            price: 89,
            quantity: 1,
        },
        {
            id: 2,
            name: "Smart Watch",
            image: product2,
            price: 120,
            quantity: 2,
        },
    ]);

    const increaseQuantity = (id: number) => {
        setCartItems((previousItems) =>
            previousItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCartItems((previousItems) =>
            previousItems.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems((previousItems) =>
            previousItems.filter((item) => item.id !== id)
        );
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    return (
        <>
            <Navbar />

            <main className="cart-page">
                <div className="cart-heading">
                    <FaShoppingCart />
                    <div>
                        <h1>Shopping Cart</h1>
                        <p>Review and update your selected products.</p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <section className="empty-cart">
                        <FaShoppingCart />
                        <h2>Your cart is empty</h2>
                        <p>Add products to your cart before checkout.</p>
                    </section>
                ) : (
                    <div className="cart-layout">
                        <section className="cart-items">
                            {cartItems.map((item) => (
                                <article className="cart-item" key={item.id}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />

                                    <div className="cart-item-info">
                                        <h2>{item.name}</h2>
                                        <p className="cart-item-price">
                                            ${item.price.toFixed(2)}
                                        </p>

                                        <div className="quantity-control">
                                            <button
                                                type="button"
                                                onClick={() => decreaseQuantity(item.id)}
                                                aria-label="Decrease quantity"
                                            >
                                                <FaMinus />
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() => increaseQuantity(item.id)}
                                                aria-label="Increase quantity"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <p className="item-total">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>

                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => removeItem(item.id)}
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
                                <strong>${subtotal.toFixed(2)}</strong>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <strong>${shipping.toFixed(2)}</strong>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-row total-row">
                                <span>Total</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>

                            <button type="button" className="checkout-button">
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