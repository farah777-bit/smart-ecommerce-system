import { useEffect, useState, useCallback, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    FaBoxOpen,
    FaChevronLeft,
    FaMinus,
    FaPlus,
    FaRegStar,
    FaShieldAlt,
    FaShoppingCart,
    FaStar,
    FaTruck,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import { apiGet, apiDelete, apiPost, apiPut } from "../../Services/api";
import type { ProductDetails, ProductReview } from "../../Types/Product";

import "./ProductDetailsPage.css";

type AuthenticatedUser = {
    id: number;
    fullName: string;
    email: string;
    roles: string[];
};

type ReviewRequest = {
    rating: number;
    comment: string;
};

type ReviewOperationResponse = {
    message: string;
    reviewId: number;
};

function getStoredUser(): AuthenticatedUser | null {
    const storedUser =
        localStorage.getItem("user") ??
        sessionStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as AuthenticatedUser;
    } catch {
        return null;
    }
}


function ProductDetailsPage() {
    const navigate = useNavigate();

    const [currentUser] =
        useState<AuthenticatedUser | null>(() => getStoredUser());
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] =
        useState<ProductDetails | null>(null);

    const [selectedImage, setSelectedImage] =
        useState<string>("");

    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");


    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");

    const [editingReviewId, setEditingReviewId] =
        useState<number | null>(null);

    const [isSubmittingReview, setIsSubmittingReview] =
        useState(false);

    const [reviewError, setReviewError] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");


    const loadProduct = useCallback(
        async (showLoader = true) => {
            if (!id) {
                setError("Invalid product id.");
                setIsLoading(false);
                return;
            }

            try {
                if (showLoader) {
                    setIsLoading(true);
                }

                setError("");

                const data =
                    await apiGet<ProductDetails>(
                        `/products/${id}`
                    );

                setProduct(data);

                const primaryImage =
                    data.images.find(
                        (image) => image.isPrimary
                    )?.imageUrl ??
                    data.images[0]?.imageUrl ??
                    data.primaryImageUrl ??
                    "";

                setSelectedImage((previousImage) => {
                    const imageStillExists =
                        data.images.some(
                            (image) =>
                                image.imageUrl === previousImage
                        );

                    return imageStillExists
                        ? previousImage
                        : primaryImage;
                });

                if (showLoader) {
                    setQuantity(1);
                }

                document.title =
                    `${data.name} | Smart Shop`;
            } catch (error) {
                setProduct(null);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Could not load the product."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [id]
    );

    useEffect(() => {
        void loadProduct();
    }, [loadProduct]);

    const increaseQuantity = () => {
        if (!product) return;

        setQuantity((previousQuantity) =>
            Math.min(
                previousQuantity + 1,
                product.stockQuantity
            )
        );
    };

    const decreaseQuantity = () => {
        setQuantity((previousQuantity) =>
            Math.max(previousQuantity - 1, 1)
        );
    };


    const resetReviewForm = () => {
        setReviewRating(0);
        setReviewComment("");
        setEditingReviewId(null);
    };

    const handleReviewSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setReviewError("");
        setReviewMessage("");

        if (!currentUser) {
            navigate("/login");
            return;
        }

        if (!id) {
            setReviewError("Invalid product id.");
            return;
        }

        if (reviewRating < 1 || reviewRating > 5) {
            setReviewError(
                "Please select a rating between 1 and 5."
            );
            return;
        }

        const reviewData: ReviewRequest = {
            rating: reviewRating,
            comment: reviewComment,
        };

        try {
            setIsSubmittingReview(true);

            let response: ReviewOperationResponse;

            if (editingReviewId !== null) {
                response =
                    await apiPut<ReviewOperationResponse>(
                        `/reviews/${editingReviewId}`,
                        reviewData,
                        true
                    );
            } else {
                response =
                    await apiPost<ReviewOperationResponse>(
                        `/products/${id}/reviews`,
                        reviewData,
                        true
                    );
            }

            setReviewMessage(response.message);
            resetReviewForm();

            await loadProduct(false);
        } catch (error) {
            setReviewError(
                error instanceof Error
                    ? error.message
                    : "Could not save the review."
            );
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleEditReview = (review: ProductReview) => {
        setEditingReviewId(review.id);
        setReviewRating(review.rating);
        setReviewComment(review.comment ?? "");
        setReviewError("");
        setReviewMessage("");

        document
            .getElementById("review-form")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
    };

    const handleCancelEdit = () => {
        resetReviewForm();
        setReviewError("");
        setReviewMessage("");
    };

    const handleDeleteReview = async (
        reviewId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your review?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setReviewError("");
            setReviewMessage("");
            setIsSubmittingReview(true);

            const response =
                await apiDelete<ReviewOperationResponse>(
                    `/reviews/${reviewId}`,
                    true
                );

            if (editingReviewId === reviewId) {
                resetReviewForm();
            }

            setReviewMessage(response.message);

            await loadProduct(false);
        } catch (error) {
            setReviewError(
                error instanceof Error
                    ? error.message
                    : "Could not delete the review."
            );
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) =>
            index < rating ? (
                <FaStar key={index} />
            ) : (
                <FaRegStar key={index} />
            )
        );
    };

    if (isLoading) {
        return (
            <>
                <Navbar />

                <main className="product-details-state">
                    <div className="product-details-loader" />
                    <p>Loading product details...</p>
                </main>

                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Navbar />

                <main className="product-details-state">
                    <FaBoxOpen className="state-icon" />

                    <h1>Product unavailable</h1>

                    <p>
                        {error || "The requested product was not found."}
                    </p>

                    <Link to="/products" className="back-to-products">
                        <FaChevronLeft />
                        Back to Products
                    </Link>
                </main>

                <Footer />
            </>
        );
    }

    const isOutOfStock = product.stockQuantity <= 0;


    const currentUserReview = currentUser
        ? product.reviews.find(
            (review) => review.userId === currentUser.id
        )
        : undefined;

    return (
        <>
            <Navbar />
            <main className="product-details-page">
                <nav className="product-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Products</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>

                <section className="product-details-container">
                    <div className="product-gallery">
                        <div className="main-image-container">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="main-product-image"
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <FaBoxOpen />
                                    <span>No image available</span>
                                </div>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="thumbnail-list">
                                {product.images.map((image) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        className={
                                            selectedImage === image.imageUrl
                                                ? "thumbnail-button active"
                                                : "thumbnail-button"
                                        }
                                        onClick={() =>
                                            setSelectedImage(image.imageUrl)
                                        }
                                        aria-label={`View ${product.name}`}
                                    >
                                        <img
                                            src={image.imageUrl}
                                            alt={product.name}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-details-content">
                        <span className="product-category">
                            {product.categoryName}
                        </span>

                        <h1>{product.name}</h1>

                        <div className="product-rating">
                            <div className="rating-stars">
                                {renderStars(
                                    Math.round(product.averageRating)
                                )}
                            </div>

                            <strong>
                                {product.averageRating.toFixed(1)}
                            </strong>

                            <a href="#customer-reviews">
                                ({product.reviewsCount} reviews)
                            </a>
                        </div>

                        <p className="product-price">
                            ${product.price.toFixed(2)}
                        </p>

                        <p className="product-description">
                            {product.description}
                        </p>

                        <div className="product-status">
                            <span>Availability</span>

                            <strong
                                className={isOutOfStock
                                    ? "out-of-stock"
                                    : "in-stock"
                                }
                            >
                                {isOutOfStock
                                    ? "Out of stock"
                                    : `${product.stockQuantity} available`}
                            </strong>
                        </div>

                        {!isOutOfStock && (
                            <div className="quantity-section">
                                <span className="quantity-label">
                                    Quantity
                                </span>

                                <div className="quantity-control">
                                    <button
                                        type="button"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        <FaMinus />
                                    </button>

                                    <span>{quantity}</span>

                                    <button
                                        type="button"
                                        onClick={increaseQuantity}
                                        disabled={
                                            quantity >=
                                            product.stockQuantity
                                        }
                                        aria-label="Increase quantity"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            className="add-to-cart-button"
                            disabled={isOutOfStock}
                        >
                            <FaShoppingCart />

                            {isOutOfStock
                                ? "Out of Stock"
                                : "Add to Cart"}
                        </button>

                        <div className="product-benefits">
                            <div>
                                <FaTruck />
                                <span>
                                    <strong>Fast delivery</strong>
                                    Secure shipping
                                </span>
                            </div>

                            <div>
                                <FaShieldAlt />
                                <span>
                                    <strong>Secure shopping</strong>
                                    Protected checkout
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="product-information">
                    <div className="information-card">
                        <span className="section-label">
                            About this product
                        </span>

                        <h2>Product Description</h2>

                        <p>{product.description}</p>
                    </div>

                    <div className="information-card">
                        <span className="section-label">
                            Product information
                        </span>

                        <h2>Details</h2><div className="specifications-list">
                            <div className="specification-row">
                                <span>Category</span>
                                <strong>{product.categoryName}</strong>
                            </div>

                            <div className="specification-row">
                                <span>Product number</span>
                                <strong>#{product.id}</strong>
                            </div>

                            <div className="specification-row">
                                <span>Availability</span>
                                <strong>
                                    {isOutOfStock
                                        ? "Out of stock"
                                        : "In stock"}
                                </strong>
                            </div>

                            <div className="specification-row">
                                <span>Available quantity</span>
                                <strong>
                                    {product.stockQuantity}
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="reviews-section"
                    id="customer-reviews"
                >
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                Customer feedback
                            </span>

                            <h2>Customer Reviews</h2>
                        </div>

                        <div className="reviews-summary">
                            <strong>
                                {product.averageRating.toFixed(1)}
                            </strong>

                            <div>
                                <div className="review-stars">
                                    {renderStars(
                                        Math.round(
                                            product.averageRating
                                        )
                                    )}
                                </div>
                                

                                <span>
                                    Based on {product.reviewsCount} reviews
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="review-form-container" id="review-form">
                        {!currentUser ? (
                            <div className="review-login-message">
                                <div>
                                    <h3>Share your experience</h3>
                                    <p>
                                        Sign in to rate this product and write a
                                        review.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                >
                                    Sign In to Review
                                </button>
                            </div>
                        ) : currentUserReview &&
                            editingReviewId === null ? (
                            <div className="existing-review-message">
                                <div>
                                    <h3>You already reviewed this product</h3>
                                    <p>
                                        You can update your rating or delete your
                                        review.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEditReview(currentUserReview)
                                    }
                                >
                                    <FaEdit />
                                    Edit My Review
                                </button>
                            </div>
                        ) : (
                            <form
                                className="review-form"
                                onSubmit={handleReviewSubmit}
                            >
                                <div className="review-form-heading">
                                    <div>
                                        <h3>
                                            {editingReviewId !== null
                                                ? "Edit your review"
                                                : "Write a review"}
                                        </h3>

                                        <p>
                                            Tell other customers what you think
                                            about this product.
                                        </p>
                                    </div>

                                    {editingReviewId !== null && (
                                        <button
                                            type="button"
                                            className="cancel-review-button"
                                            onClick={handleCancelEdit}
                                            disabled={isSubmittingReview}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <div className="rating-input">
                                    <span>Your rating</span>

                                    <div className="rating-buttons">
                                        {Array.from(
                                            { length: 5 },
                                            (_, index) => {
                                                const ratingValue = index + 1;

                                                return (
                                                    <button
                                                        key={ratingValue}
                                                        type="button"
                                                        className={
                                                            ratingValue <=
                                                                reviewRating
                                                                ? "selected"
                                                                : ""
                                                        }
                                                        onClick={() =>
                                                            setReviewRating(
                                                                ratingValue
                                                            )
                                                        }
                                                        aria-label={`${ratingValue} stars`}
                                                    >
                                                        {ratingValue <=
                                                            reviewRating ? (
                                                            <FaStar />
                                                        ) : (
                                                            <FaRegStar />
                                                        )}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                <label
                                    className="review-comment-label"
                                    htmlFor="review-comment"
                                >
                                    Your comment
                                </label>
                                <textarea
                                    id="review-comment"
                                    value={reviewComment}
                                    onChange={(event) =>
                                        setReviewComment(event.target.value)
                                    }
                                    placeholder="What did you like or dislike about this product?"
                                    maxLength={1000}
                                    rows={5}
                                />

                                <div className="review-form-footer">
                                    <span>
                                        {reviewComment.length}/1000 characters
                                    </span>

                                    <button
                                        type="submit"
                                        className="submit-review-button"
                                        disabled={
                                            isSubmittingReview ||
                                            reviewRating === 0
                                        }
                                    >
                                        {isSubmittingReview
                                            ? "Saving..."
                                            : editingReviewId !== null
                                                ? "Update Review"
                                                : "Submit Review"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {reviewError && (
                            <p className="review-feedback review-feedback-error">
                                {reviewError}
                            </p>
                        )}

                        {reviewMessage && (
                            <p className="review-feedback review-feedback-success">
                                {reviewMessage}
                            </p>
                        )}
                    </div>

                    {product.reviews.length === 0 ? (
                        <div className="empty-reviews">
                            <FaRegStar />

                            <h3>No reviews yet</h3>

                            <p>
                                This product has not received any approved
                                reviews yet.
                            </p>
                        </div>
                    ) : (
                        <div className="reviews-grid">
                            {product.reviews.map((review) => (
                                <article
                                    className="review-card"
                                    key={review.id}
                                >
                                    <div className="review-header">
                                        <div>
                                            <div className="review-avatar">
                                                {review.userFullName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <h3>
                                                    {review.userFullName}
                                                </h3><time>
                                                    {new Date(
                                                        review.createdAt
                                                    ).toLocaleDateString()}
                                                </time>
                                            </div>
                                        </div>

                                        <div className="review-card-controls">
                                            <div className="review-stars">
                                                {renderStars(review.rating)}
                                            </div>

                                            {currentUser?.id === review.userId && (
                                                <div className="review-actions">
                                                    <button
                                                        type="button"
                                                        className="edit-review-button"
                                                        onClick={() =>
                                                            handleEditReview(review)
                                                        }
                                                        disabled={isSubmittingReview}
                                                    >
                                                        <FaEdit />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-review-button"
                                                        onClick={() =>
                                                            handleDeleteReview(review.id)
                                                        }
                                                        disabled={isSubmittingReview}
                                                    >
                                                        <FaTrash />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p>
                                        {review.comment ||
                                            "The customer left a rating without a comment."}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main >

            <Footer />
        </>
    );
}

export default ProductDetailsPage;