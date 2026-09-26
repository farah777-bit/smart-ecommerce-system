import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaStar,
    FaShoppingCart,
    FaHeart,
    FaRegHeart,
} from "react-icons/fa";

import type { Product } from "../../Types/Product";
import type {
    Cart,
    AddToCartRequest,
} from "../../Types/Cart";

import {
    apiPost,
    apiDelete,
} from "../../Services/api";

import "./ProductCard.css";

type ProductCardProps = {
    product: Product;
    initialIsFavorite?: boolean;
};

function ProductCard({ product, initialIsFavorite = false }: ProductCardProps) {
    const navigate = useNavigate();

    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        setIsFavorite(initialIsFavorite);
    }, [initialIsFavorite]);

    const getToken = () =>
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const handleAddToCart = async () => {
        if (!getToken()) {
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

    const handleWishlist = async () => {
        if (!getToken()) {
            navigate("/login");
            return;
        }

        try {
            setWishlistLoading(true);
            setMessage("");
            setIsError(false);

            if (isFavorite) {
                await apiDelete<{ message: string }>(
                    `/wishlist/items/${product.id}`,
                    true
                );

                setIsFavorite(false);
                setMessage("Removed from wishlist.");
            } else {
                await apiPost<{ message: string }>(
                    `/wishlist/items/${product.id}`,
                    {},
                    true
                );

                setIsFavorite(true);
                setMessage("Added to wishlist.");
            }
        } catch (error) {
            setIsError(true);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Could not update wishlist."
            );
        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <div className="product-card">
            <button
                type="button"
                className={
                    isFavorite
                        ? "wishlist-btn active"
                        : "wishlist-btn"
                }
                onClick={handleWishlist}
                disabled={wishlistLoading}
                aria-label={
                    isFavorite
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                }
            >
                {isFavorite ? (
                    <FaHeart />
                ) : (
                    <FaRegHeart />
                )}
            </button>

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