import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { apiGet, apiPost } from "../../Services/api";

import "./AdminAddProductPage.css";

type Category = {
    id: number;
    name: string;
};

type CreatedProduct = {
    id: number;
};

function AdminAddProductPage() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);

    const [categoryId, setCategoryId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [lowStockThreshold, setLowStockThreshold] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data =
                    await apiGet<Category[]>("/categories");

                setCategories(data);
            } catch (error) {
                console.error(
                    "Could not load categories:",
                    error
                );
            }
        };

        loadCategories();
    }, []);

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!categoryId) {
            setError("Please select a category.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await apiPost<CreatedProduct>(
                "/products",
                {
                    categoryId: Number(categoryId),
                    name,
                    description,
                    seoTitle: seoTitle || null,
                    seoDescription: seoDescription || null,
                    price: Number(price),
                    stockQuantity: Number(stockQuantity),
                    lowStockThreshold:
                        Number(lowStockThreshold),
                    isActive,
                },
                true
            );

            navigate("/admin/products");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not create product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="admin-add-product">
                <div className="admin-product-form-container">
                    <div className="admin-product-form-header">
                        <span>Administration</span>
                        <h1>Add Product</h1>
                        <p>
                            Add a new product to your store.
                        </p>
                    </div>

                    <form
                        className="admin-product-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="admin-form-group">
                            <label>Product Name</label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(e.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-form-group full-width">
                            <label>Description</label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows={5}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Price</label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Stock Quantity</label>

                            <input
                                type="number"
                                min="0"
                                value={stockQuantity}
                                onChange={(e) =>
                                    setStockQuantity(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Low Stock Threshold</label>

                            <input
                                type="number"
                                min="0"
                                value={lowStockThreshold}
                                onChange={(e) =>
                                    setLowStockThreshold(
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>SEO Title</label>

                            <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) =>
                                    setSeoTitle(e.target.value)
                                }
                            />
                        </div>

                        <div className="admin-form-group full-width">
                            <label>SEO Description</label>

                            <textarea
                                value={seoDescription}
                                onChange={(e) =>
                                    setSeoDescription(
                                        e.target.value
                                    )
                                }
                                rows={3}
                            />
                        </div>

                        <div className="admin-active-field full-width">
                            <input
                                id="isActive"
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) =>
                                    setIsActive(e.target.checked)
                                }
                            />

                            <label htmlFor="isActive">
                                Product is active
                            </label>
                        </div>

                        {error && (
                            <p className="admin-form-error full-width">
                                {error}
                            </p>
                        )}

                        <div className="admin-form-actions full-width">
                            <button
                                type="button"
                                className="admin-cancel-btn"
                                onClick={() =>
                                    navigate("/admin/products")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-create-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default AdminAddProductPage;