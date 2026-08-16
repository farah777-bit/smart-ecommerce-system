import { useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart, FaStar } from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import "./ProductDetailsPage.css";

import productImage1 from "../../assets/images/products/T-shirt.jfif"
import productImage2 from "../../assets/images/products/headphone.jfif";
import productImage3 from "../../assets/images/products/laptop.jfif";

function ProductDetailsPage() {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(productImage1);

    const productImages = [
        productImage1,
        productImage2,
        productImage3,
    ];

    const increaseQuantity = () => {
        setQuantity((previousQuantity) => previousQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((previousQuantity) =>
            previousQuantity > 1 ? previousQuantity - 1 : 1
        );
    };

    return (
        <>
            <Navbar />

            <main className="product-details-page">
                <section className="product-details-container">

                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img
                                src={selectedImage}
                                alt="Wireless headphones"
                                className="main-product-image"
                            />
                        </div>

                        <div className="thumbnail-list">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={
                                        selectedImage === image
                                            ? "thumbnail-button active"
                                            : "thumbnail-button"
                                    }
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img
                                        src={image}
                                        alt={`Product view ${index + 1}`}
                  />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="product-details-content">
                        <span className="product-category">Electronics</span>

                        <h1>Wireless Headphones</h1>

                        <div className="product-rating">
                            <FaStar />
                            <span>4.8</span>
                            <span className="review-count">(124 reviews)</span>
                        </div>

                        <p className="product-price">$89.00</p>

                        <p className="product-description">
                            Enjoy clear sound, comfortable ear cushions, and long
                            battery life. These wireless headphones are suitable for
                            work, study, travel, and daily entertainment.
                        </p>

                        <div className="product-status">
                            <span>Availability:</span>
                            <strong>In Stock</strong>
                        </div>

                        <div className="quantity-section">
                            <span className="quantity-label">Quantity</span>

                            <div className="quantity-control">
                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                    aria-label="Decrease quantity"
                                >
                                    <FaMinus />
                                </button>

                                <span>{quantity}</span>

                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                    aria-label="Increase quantity"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>

                        <button type="button" className="add-to-cart-button">
                            <FaShoppingCart />
                            Add to Cart
                        </button>
                    </div>
                </section>

                <section className="product-information">
                    <div className="information-card">
                        <h2>Product Description</h2>

                        <p>
                            This product combines modern design with reliable
                            performance. It provides stable wireless connectivity,
                            balanced sound quality, and a lightweight structure for
                            comfortable use throughout the day.
                        </p>
                    </div>
                    <div className="information-card">
                        <h2>Specifications</h2>

                        <div className="specifications-list">
                            <div className="specification-row">
                                <span>Connection</span>
                                <strong>Bluetooth 5.3</strong>
                            </div>

                            <div className="specification-row">
                                <span>Battery Life</span>
                                <strong>Up to 30 hours</strong>
                            </div>

                            <div className="specification-row">
                                <span>Color</span>
                                <strong>Black</strong>
                            </div>

                            <div className="specification-row">
                                <span>Charging Port</span>
                                <strong>USB-C</strong>
                            </div>

                            <div className="specification-row">
                                <span>Warranty</span>
                                <strong>One year</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="reviews-section">
                    <div className="section-heading">
                        <h2>Customer Reviews</h2>
                        <p>See what customers think about this product.</p>
                    </div>

                    <div className="reviews-grid">
                        <article className="review-card">
                            <div className="review-header">
                                <h3>Sarah Ahmed</h3>

                                <div className="review-stars">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>

                            <p>
                                Excellent sound quality and very comfortable for long
                                periods of use.
                            </p>
                        </article>

                        <article className="review-card">
                            <div className="review-header">
                                <h3>Omar Khaled</h3>

                                <div className="review-stars">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>

                            <p>
                                The battery lasts a long time, and the connection is
                                stable. I am satisfied with the product.
                            </p>
                        </article>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default ProductDetailsPage;