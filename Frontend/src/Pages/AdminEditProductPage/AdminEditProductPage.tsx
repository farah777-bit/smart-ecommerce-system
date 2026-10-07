import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import {
    apiGet,
    apiPut,
} from "../../Services/api";

import type { ProductDetails } from "../../Types/Product";

import "./AdminEditProductPage.css";

type Category = {
    id: number;
    name: string;
};

function AdminEditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const productId = Number(id);

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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [product, categoriesData] =
                    await Promise.all([
                        apiGet<ProductDetails>(
                            `/products/${productId}`
                        ),

                        apiGet<Category[]>(
                            "/categories"
                        ),
                    ]);

                setCategories(categoriesData);

                setCategoryId(
                    product.categoryId.toString()
                );

                setName(product.name);
                setDescription(product.description);

                setPrice(
                    product.price.toString()
                );

                setStockQuantity(
                    product.stockQuantity.toString()
                );

                setLowStockThreshold(
                    product.lowStockThreshold.toString()
                );

                setSeoTitle(
                    product.seoTitle ?? ""
                );

                setSeoDescription(
                    product.seoDescription ?? ""
                );

                setIsActive(product.isActive);

            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Could not load product."
                );
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadData();
        }
    }, [productId]);

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            await apiPut(
                `/products/${productId}`,
                {
                    categoryId: Number(categoryId),
                    name,
                    description,
                    seoTitle: seoTitle || null,
                    seoDescription:
                        seoDescription || null,
                    price: Number(price),
                    stockQuantity:
                        Number(stockQuantity),
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
                    : "Could not update product."
            );
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <>
                <Navbar />

                <main className="admin-edit-product">
                    <p>Loading product...</p>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="admin-edit-product">
                <div className="admin-edit-container">

                    <div className="admin-edit-header">
                        <span>Administration</span>

                        <h1>Edit Product</h1>

                        <p>
                            Update product information.
                        </p>
                    </div>

                    <form
                        className="admin-edit-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="admin-edit-group">
                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="admin-edit-group">
                            <label>
                                Category
                            </label>

                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="admin-edit-group full">
                            <label>
                                Description
                            </label>

                            <textarea
                                rows={5}
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="admin-edit-group">
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

                        <div className="admin-edit-group">
                            <label>
                                Stock Quantity
                            </label>
                            <input type="number"
                                min="0"

                                value={
                                    stockQuantity
                                }

                                onChange={
                                    (e) => setStockQuantity(e.target.value)
                                }

                                required /></div ><div className="admin-edit-group"><label>Low Stock Threshold </label><input type="number"
                                    min="0"

                                    value={
                                        lowStockThreshold
                                    }

                                    onChange={
                                        (e) => setLowStockThreshold(e.target.value)
                                    }

                                    required /></div><div className="admin-edit-group"><label>SEO Title </label><input type="text"

                                        value={
                                            seoTitle
                                        }

                                        onChange={
                                            (e) => setSeoTitle(e.target.value)
                                        }

                                    /></div><div className="admin-edit-group full"><label>SEO Description </label><textarea rows={
                                        3
                                    }

                                        value={
                                            seoDescription
                                        }

                                        onChange={
                                            (e) => setSeoDescription(e.target.value)
                                        }

                                    /></div><div className="admin-edit-active full"><input id="editIsActive"
                                        type="checkbox"

                                        checked={
                                            isActive
                                        }

                                        onChange={
                                            (e) => setIsActive(e.target.checked)
                                        }

                                    /><label htmlFor="editIsActive">Product is active </label></div> {
                            error && (<p className="admin-edit-error full" > {
                                error
                            }

                            </p>)
                        }

                        <div className="admin-edit-actions full"><button type="button"
                            className="admin-edit-cancel"

                            onClick={
                                () => navigate("/admin/products"
                                )
                            }

                        >Cancel </button>
                            <button type="submit"
                                className="admin-edit-save"

                                disabled={
                                    saving
                                }

                            > {
                                    saving ? "Saving..."
                                        : "Save Changes"
                                }

                            </button></div></form ></div ></main > <Footer /></>);
}

export default AdminEditProductPage;