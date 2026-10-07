import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import {
    apiDelete,
    apiGet,
    apiPost,
    apiPut,
} from "../../Services/api";

import type { ProductImage } from "../../Types/Product";

import "./AdminProductImagesPage.css";

function AdminProductImagesPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const productId = Number(id);

    const [images, setImages] = useState<ProductImage[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadImages = async () => {
        try {
            const data = await apiGet<ProductImage[]>(
                `/productimages/product/${productId}`
            );

            setImages(data);
        } catch (error) {
            console.error("Could not load images:", error);
        }
    };

    useEffect(() => {
        if (productId) {
            loadImages();
        }
    }, [productId]);

    const handleAddImage = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!imageUrl.trim()) {
            setError("Image URL is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await apiPost(
                "/productimages",
                {
                    productId,
                    imageUrl,
                    isPrimary,
                },
                true
            );

            setImageUrl("");
            setIsPrimary(false);

            await loadImages();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not add image."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrimary = async (imageId: number) => {
        try {
            await apiPut(
                `/productimages/${imageId}/set-primary`,
                {},
                true
            );

            await loadImages();
        } catch (error) {
            console.error(
                "Could not set primary image:",
                error
            );
        }
    };

    const handleDelete = async (imageId: number) => {
        try {
            await apiDelete(
                `/productimages/${imageId}`,
                true
            );

            await loadImages();
        } catch (error) {
            console.error(
                "Could not delete image:",
                error
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="admin-product-images">
                <div className="product-images-container">
                    <h1>Product Images</h1>

                    <form
                        className="image-form"
                        onSubmit={handleAddImage}
                    >
                        <input
                            type="url"
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={(e) =>
                                setImageUrl(e.target.value)
                            }
                            required
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={isPrimary}
                                onChange={(e) =>
                                    setIsPrimary(
                                        e.target.checked
                                    )
                                }
                            />

                            Primary Image
                        </label>
<button
    type="submit"
    disabled={loading}
>
    {loading
        ? "Adding..."
        : "Add Image"}
</button>
                    </form >

    { error && (
        <p className="image-error">
            {error}
        </p>
    )}

                    <div className="product-images-grid">
                        {images.map((image) => (
                            <div
                                className="admin-image-card"
                                key={image.id}
                            >
                                <img
                                    src={image.imageUrl}
                                    alt="Product"
                                />

                                {image.isPrimary && (
                                    <span className="primary-badge">
                                        Primary
                                    </span>
                                )}

                                <div className="image-actions">
                                    {!image.isPrimary && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSetPrimary(
                                                    image.id
                                                )
                                            }
                                        >
                                            Set Primary
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="delete-image-btn"
                                        onClick={() =>
                                            handleDelete(
                                                image.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="back-products-btn"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >
                        Back to Products
                    </button>
                </div >
            </main >

    <Footer />
        </>
    );
}

export default AdminProductImagesPage;