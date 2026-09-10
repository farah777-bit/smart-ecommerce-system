import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";

import type { Product } from "../../Types/Product";
import type {
    Cart,
    AddToCartRequest,
} from "../../Types/Cart";

import { apiPost } from "../../Services/api";

import "./ProductCard.css";

type ProductCardProps = {
    product: Product;
};

function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();

    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleAddToCart = async () => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const request: AddToCartRequest = {
            productId: product.id,
            quantity: 1,
        };

        try {
            setIsAdding(true);
            setMessage("");
            setIsError(false);

            await apiPost<Cart>(
                "/Cart/items",
                request,
                true
            );

            setMessage("Added to cart.");
        } catch (error) {
            setIsError(true);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Could not add the product."
            );
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="product-card">
            <img
                src={
                    product.primaryImageUrl ||
                    "/placeholder-product.jpg"
                }
                alt={product.name}
                className="product-image"
            />

            <div className="product-info">
                <h3>{product.name}</h3>

                <div className="rating">
                    <FaStar />

                    <span>
                        {(product.averageRating ?? 0).toFixed(1)}
                    </span>

                    <span>
                        ({product.reviewsCount ?? 0})
                    </span>
                </div>

                <p className="price">
                    ${product.price.toFixed(2)}
                </p>

                <div className="buttons">
                    <Link
                        to={`/products/${product.id}`}
                    className="details-btn"
                    >
                    View Details
                </Link>

                <button
                    type="button"
                    className="cart-btn"
                    disabled={
                        product.stockQuantity <= 0 ||
                        isAdding
                    }
                    onClick={handleAddToCart}
                    aria-label="Add product to cart"
                >
                    <FaShoppingCart />
                </button>
            </div>

            {message && (
                <p
                    className={
                        isError
                            ? "cart-message cart-error"
                            : "cart-message"
                    }
                >
                    {message}
                </p>
            )}
        </div>
        </div >
    );
}

export default ProductCard;