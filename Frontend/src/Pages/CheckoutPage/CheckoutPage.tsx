import {
    useEffect,
    useState,
    type FormEvent
}

    from "react";

import {
    useNavigate
}

    from "react-router-dom";

import {
    FaCreditCard,
    FaMapMarkerAlt,
    FaShoppingBag,
    FaTruck,
}

    from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import {
    apiGet,
    apiPost
}

    from "../../Services/api";

import type {
    Cart
}

    from "../../Types/Cart";

import type {
    CreateOrderRequest,
    Order,
}

    from "../../Types/Order";

import "./CheckoutPage.css";

function CheckoutPage() {
    const navigate = useNavigate();

    const [cart,
        setCart] = useState<Cart | null>(null);

    const [shippingAddress,
        setShippingAddress] = useState("");

    const [paymentMethod,
        setPaymentMethod] = useState("CashOnDelivery");

    const [isLoading,
        setIsLoading] = useState(true);
    const [isSubmitting,
        setIsSubmitting] = useState(false);

    const [error,
        setError] = useState("");

    useEffect(() => {
        const loadCart = async () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setError("");

                const result = await apiGet<Cart>("/Cart",
                    true);

                if (result.items.length === 0) {
                    navigate("/cart");
                    return;
                }

                setCart(result);
            }

            catch (error) {
                setError(error instanceof Error ? error.message : "Could not load checkout."
                );
            }

            finally {
                setIsLoading(false);
            }
        }

            ;

        void loadCart();
    }

        , [navigate]);

    const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!shippingAddress.trim()) {
            setError("Please enter your shipping address.");
            return;
        }

        const request: CreateOrderRequest = {
            shippingAddress: shippingAddress.trim(),
            couponId: null,
            paymentMethod,
        }

            ;

        try {
            setIsSubmitting(true);
            setError("");

            const order = await apiPost<Order>("/Orders",
                request,
                true);

            navigate(`/orders/${order.id}`);
        }

        catch (error) {
            setError(error instanceof Error ? error.message : "Could not place your order."
            );
        }

        finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (<> <Navbar /> <main className="checkout-state" > <p>Loading checkout...</p> </main> <Footer /> </>);
    }

    if (!cart) {
        return (<> <Navbar /> <main className="checkout-state" > <p> {
            error || "Checkout is unavailable."
        }

        </p> </main> <Footer /> </>);
    }

    const shipping = 10;
    const total = cart.subtotal + shipping;

    return (<> <Navbar /> <main className="checkout-page" > <div className="checkout-heading" > <FaShoppingBag /> <div> <h1>Checkout</h1> <p> Complete your shipping and payment information. </p> </div> </div>
        {
            error && (<p className="checkout-error" > {
                error
            }

            </p>)
        }

        <form className="checkout-layout"

            onSubmit={
                handlePlaceOrder
            }

        ><section className="checkout-details"><div className="checkout-card"><div className="checkout-card-heading"><FaMapMarkerAlt /><div><h2>Shipping Information</h2><p>Where should we deliver your order? </p></div></div><label htmlFor="shipping-address">Shipping Address </label><textarea id="shipping-address"

            value={
                shippingAddress
            }

            onChange={
                (event) => setShippingAddress(event.target.value)
            }

            placeholder="Enter your full shipping address"

            rows={
                4
            }

            required /></div><div className="checkout-card"><div className="checkout-card-heading"><FaCreditCard /><div><h2>Payment Method</h2><p>Choose how you want to pay. </p></div></div><label className="payment-option"><input type="radio"
                name="paymentMethod"
                value="CashOnDelivery"

                checked={
                    paymentMethod === "CashOnDelivery"
                }

                onChange={
                    (event) => setPaymentMethod(event.target.value)
                }

            /><span><strong>Cash on Delivery </strong>Pay when your order arrives. </span></label><label className="payment-option"><input type="radio"
                name="paymentMethod"
                value="DemoPayment"

                checked={
                    paymentMethod === "DemoPayment"
                }

                onChange={
                    (event) => setPaymentMethod(event.target.value)
                }

            />
                        <span><strong>Demo Payment </strong>No real transaction will be processed. </span></label></div></section><aside className="checkout-summary"><h2>Order Summary</h2><div className="checkout-products"> {
                            cart.items.map((item) => (<div className="checkout-product"

                                key={
                                    item.id
                                }

                            > <div> <strong> {
                                item.productName
                            }

                            </strong> <span> Qty: {
                                item.quantity
                            }

                                    </span> </div> <strong> $ {
                                        item.totalPrice.toFixed(2)
                                    }

                                </strong> </div>))
                        }

                        </div><div className="summary-row"><span>Subtotal</span><strong>$ {
                            cart.subtotal.toFixed(2)
                        }

                        </strong></div><div className="summary-row"><span><FaTruck />Shipping </span><strong>$ {
                            shipping.toFixed(2)
                        }

                        </strong></div><div className="summary-divider" /><div className="summary-row total-row"><span>Total</span><strong>$ {
                            total.toFixed(2)
                        }

                        </strong></div><button type="submit"
                            className="place-order-button"

                            disabled={
                                isSubmitting
                            }

                        > {
                        isSubmitting ? "Placing Order..."
                            : "Place Order"
                    }

                </button></aside></form></main><Footer /></>);
}

export default CheckoutPage;