import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaImages } from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { apiDelete, apiGet } from "../../Services/api";
import type { Product } from "../../Types/Product";

import "./AdminProductsPage.css";

type ProductsResponse = {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiGet<ProductsResponse>(
                    "/products?page=1&pageSize=100"
                );

                setProducts(data.items);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Could not load products."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);


    const handleDeleteProduct = async (
        productId: number,
        productName: string
    ) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${productName}" ?`
    );

        if (!confirmed) {
            return;
        }

        try {
            await apiDelete(
                `/products/${productId}`,
                true
            );

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.id !== productId
                )
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not delete product."
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="admin-products">
                <div className="admin-products-header">
                    <div>
                        <span>Administration</span>
                        <h1>Products</h1>
                        <p>
                            Manage products in your store.
                        </p>
                    </div>

                    <Link
                        to="/admin/products/new"
                        className="admin-add-product-btn"
                        id="add-btn"
                    >
                        <FaPlus />
                        Add Product
                    </Link>
                </div>

                {loading && (
                    <p>Loading products...</p>
                )}

                {error && (
                    <p className="admin-products-error">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="admin-products-table-wrapper">
                        <table className="admin-products-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="admin-product-info">
                                                <img
                                                    src={
                                                        product.primaryImageUrl ||
                                                        "/placeholder-product.jpg"
                                                    }
                                                    alt={product.name}
                                                />

                                                <span>
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {product.categoryName}
                                        </td>

                                        <td>
                                            ${product.price.toFixed(2)}
                                        </td>

                                        <td>
                                            {product.stockQuantity}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    product.isActive
                                                        ? "admin-status active"
                                                        : "admin-status inactive"
                                                }
                                            >
                                                {product.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="admin-product-actions">
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
                                                    className="admin-edit-btn"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <Link
                                                    to={`/admin/products/${product.id}/images`}
                                                    className="admin-images-btn"
                                                    title="Manage Images"
                                                >
                                                    <FaImages />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="admin-delete-btn"
                                                    title="Delete Product"
                                                    onClick={() =>
                                                        handleDeleteProduct(
                                                            product.id,
                                                            product.name
                                                        )
                                                    }
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {products.length === 0 && (
                            <p className="admin-no-products">
                                No products found.
                            </p>
                        )}
                    </div>
                )}
            </main >

            <Footer />
        </>
    );
}

export default AdminProductsPage;