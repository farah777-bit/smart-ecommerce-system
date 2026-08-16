import { useEffect, useState } from "react";
import "./ProductsPage.css";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ProductCard from "../../Components/ProductCard/ProductCard";

import { apiGet } from "../../Services/api";
import type { Product } from "../../Types/Product";

type Category = {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    parentCategoryId: number | null;
    parentCategoryName: string | null;
};

type PaginatedProductsResponse = {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sortBy, setSortBy] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const pageSize = 8;

    // ==========================================
    // Load Categories
    // ==========================================

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data =
                    await apiGet<Category[]>("/categories");

                setCategories(data);
            } catch (error) {
                console.error(
                    "Error loading categories:",
                    error
                );
            }
        };

        loadCategories();
    }, []);

    // ==========================================
    // Reset Pagination
    // ==========================================

    useEffect(() => {
        setCurrentPage(1);
    }, [search, categoryId, sortBy]);

    // ==========================================
    // Load Products
    // ==========================================

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params =
                    new URLSearchParams();

                if (search.trim()) {
                    params.append(
                        "search",
                        search.trim()
                    );
                }

                if (categoryId) {
                    params.append(
                        "categoryId",
                        categoryId
                    );
                }

                if (sortBy) {
                    params.append(
                        "sortBy",
                        sortBy
                    );
                }

                params.append(
                    "page",
                    currentPage.toString()
                );

                params.append(
                    "pageSize",
                    pageSize.toString()
                );

                let endpoint = "/products";

                if (params.toString()) {
                    endpoint +=
                        `?${params.toString()}`;
                }

                const data =
                    await apiGet<PaginatedProductsResponse>(
                        endpoint
                    );

                setProducts(data.items);

                setTotalPages(
                    data.totalPages
                );

                setTotalCount(
                    data.totalCount
                );
            } catch (error) {
                console.error(
                    "Error loading products:",
                    error
                );

                setError(
                    "Could not load products."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [
        search,
        categoryId,
        sortBy,
        currentPage
    ]);

    return (
        <>
            <Navbar />

            <section className="products-page">

                <h1>All Products</h1>

                {/* ========================= */}
                {/* Filters */}
                {/* ========================= */}

                <div className="filters">

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <select
                        value={categoryId}
                        onChange={(e) =>
                            setCategoryId(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Categories
                        </option>

                        {categories.map(
                            (category) => (

                                <option
                                    key={
                                        category.id
                                    }
                                    value={
                                        category.id
                                    }
                                >
                                    {
                                        category.name
                                    }
                                </option>

                            )
                        )}

                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Sort By
                        </option>

                        <option value="price-low">
                            Price: Low to High
                        </option>

                        <option value="price-high">
                            Price: High to Low
                        </option>

                        <option value="name">
                            Name
                        </option>

                    </select>

                </div>

                {/* ========================= */}
                {/* Total Count */}
                {/* ========================= */}

                {!loading &&
                    !error &&
                    totalCount > 0 && (

                        <p className="products-count">
                            {totalCount} products found
                        </p>

                    )}

                {/* ========================= */}
                {/* Loading */}
                {/* ========================= */}

                {loading && (

                    <p className="products-message">
                        Loading products...
                    </p>

                )}

                {/* ========================= */}
                {/* Error */}
                {/* ========================= */}

                {!loading &&
                    error && (

                        <p className="products-message">
                            {error}
                        </p>

                    )}

                {/* ========================= */}
                {/* No Products */}
                {/* ========================= */}

                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <p className="products-message">
                            No products found.
                        </p>

                    )}

                {/* ========================= */}
                {/* Products */}
                {/* ========================= */}

                {!loading &&
                    !error &&
                    products.length > 0 && (

                        <>
                            <div className="products-grid">

                                {products.map(
                                    (product) => (

                                        <ProductCard
                                            key={
                                                product.id
                                            }
                                            product={
                                                product
                                            }
                                        />

                                    )
                                )}

                            </div>

                            {/* ========================= */}
                            {/* Pagination */}
                            {/* ========================= */}

                            {totalPages > 1 && (

                                <div className="pagination">

                                    <button
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>

                                    {Array.from(
                                        { length: totalPages, }, (_, index) => index + 1).map((page) => (

                                            <button
                                                key={page}
                                                className={currentPage === page ? "active" : ""}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                        )}

                                    <button
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>

                                </div>

                            )}

                        </>

                    )}

            </section>

            <Footer />
        </>
    );
}

export default ProductsPage;