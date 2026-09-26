
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import {
    apiDelete,
    apiGet
} from "../../Services/api";

import "./WishlistPage.css";

interface WishlistItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    imageUrl?: string;
    isInStock: boolean;
    addedAt: string;
}

interface Wishlist {
    id: number;
    createdAt: string;
    items: WishlistItem[];
}

function WishlistPage() {
    const [wishlist, setWishlist] =
        useState<Wishlist | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await apiGet<Wishlist>(
                    "/wishlist",
                    true
                );

            setWishlist(data);
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load wishlist."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: number) => {
        try {
            setError("");

            await apiDelete<{ message: string }>(
                `/wishlist/items/${productId}`,
                true
            );

            setWishlist((current) => {
                if (!current) return current;

                return {
                    ...current,
                    items: current.items.filter(
                        (item) => item.productId !== productId
                    )
                };
            });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to remove product."
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="wishlist-page">
                <div className="wishlist-container">

                    <div className="wishlist-header">
                        <div>
                            <h1>
                                <FaHeart />
                                My Wishlist
                            </h1>

                            <p>
                                Products you've saved for later.
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <p className="wishlist-message">
                            Loading wishlist...
                        </p>
                    )}

                    {error && (
                        <div className="wishlist-error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        wishlist?.items.length === 0 && (
                            <div className="empty-wishlist">
                                <FaHeart />

                                <h2>Your wishlist is empty</h2>

                                <p>
                                    Save products you like and
                                    find them here later.
                                </p>

                                <Link to="/products">
                                    Browse Products
                                </Link>
                            </div>
                        )}

                    {!loading &&
                        wishlist &&
                        wishlist.items.length > 0 && (
                            <div className="wishlist-grid">
{
    wishlist.items.map((item) => (
                                    <div
                                        className="wishlist-card"
                                        key={item.id}
                                    >
                                        <Link
                                            to={`/products/${item.productId}`}
                                            className="wishlist-image"
                                        >
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                />
                                            ) : (
                                                <div className="no-image">
                                                    No Image
                                                </div>
                                            )}
                                        </Link>

                                        <div className="wishlist-info">
                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="wishlist-name"
                                            >
                                                {item.productName}
                                            </Link>

                                            <strong>
                                                ${item.price.toFixed(2)}
                                            </strong>

                                            <span
                                                className={
                                                    item.isInStock
                                                        ? "wishlist-stock in-stock"
                                                        : "wishlist-stock out-stock"
                                                }
                                            >
                                                {item.isInStock
                                                    ? "In Stock"
                                                    : "Out of Stock"}
                                            </span>

                                            <button
                                                type="button"
                                                className="remove-wishlist-btn"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.productId
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                                Remove
                                            </button>
                                        </div >
                                    </div >
                                ))
}

                            </div >
                        )}
                </div >
            </main >

    <Footer />
        </>
    );
}

export default WishlistPage;