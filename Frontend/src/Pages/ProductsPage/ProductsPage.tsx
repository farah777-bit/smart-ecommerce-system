import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./ProductsPage.css";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ProductCard from "../../Components/ProductCard/ProductCard";

import { apiGet, apiPost } from "../../Services/api";
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

type WishlistItem = {
    productId: number;
};

type Wishlist = {
    items: WishlistItem[];
};

function ProductsPage() {
    const [wishlistProductIds, setWishlistProductIds] =
        useState<number[]>([]);

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [aiQuery, setAiQuery] = useState("");
    const [activeAiQuery, setActiveAiQuery] = useState("");

    const categoryIdFromUrl =
        searchParams.get("categoryId") ?? "";

    const [products, setProducts] =
        useState<Product[]>([]);

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [search, setSearch] = useState("");

    const [categoryId, setCategoryId] =
        useState(categoryIdFromUrl);

    const [sortBy, setSortBy] = useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalCount, setTotalCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const pageSize = 8;

    // ==========================================
    // Read categoryId from URL
    // ==========================================

    useEffect(() => {
        setCategoryId(categoryIdFromUrl);
    }, [categoryIdFromUrl]);

    // =========================================
    useEffect(() => {
        const loadWishlist = async () => {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) {
                setWishlistProductIds([]);
                return;
            }

            try {
                const data =
                    await apiGet<Wishlist>(
                        "/wishlist",
                        true
                    );

                setWishlistProductIds(
                    data.items.map(
                        (item) => item.productId
                    )
                );
            } catch (error) {
                console.error(
                    "Error loading wishlist:",
                    error
                );
            }
        };

        loadWishlist();
    }, []);

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
        let ignore = false;

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                let data: PaginatedProductsResponse;

                if (activeAiQuery) {
                    data = await apiPost<PaginatedProductsResponse>(
                        `/ai-search?page=${currentPage}&pageSize=${pageSize}`,
                        { query: activeAiQuery }
                    );
                } else {
                    const params = new URLSearchParams();

                    if (search.trim()) {
                        params.set("search", search.trim());
                    }

                    if (categoryId) {
                        params.set("categoryId", categoryId);
                    }

                    if (sortBy) {
                        params.set("sortBy", sortBy);
                    }

                    params.set("page", currentPage.toString());
                    params.set("pageSize", pageSize.toString());

                    data = await apiGet<PaginatedProductsResponse>(
                        `/products?${params.toString()}`
                    );
                }

                if (ignore) return;

                setProducts(data.items);
                setTotalPages(data.totalPages);
                setTotalCount(data.totalCount);
            } catch (error) {
                if (ignore) return;

                console.error("Error loading products:", error);

                setError(
                    activeAiQuery
                        ? "Smart search failed. Please try again."
                        : "Could not load products."
                );

                setProducts([]);
                setTotalCount(0);
                setTotalPages(1);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            ignore = true;
        };
    }, [
        search,
        categoryId,
        sortBy,
        currentPage,
        activeAiQuery,
    ]);

    // ==========================================
    // Change Category
    // ==========================================

    const handleCategoryChange = (
        value: string
    ) => {
        setCategoryId(value);
        setCurrentPage(1);

        const updatedParams =
            new URLSearchParams(searchParams);

        if (value) {
            updatedParams.set(
                "categoryId",
                value
            );
        } else {
            updatedParams.delete("categoryId");
        }

        setSearchParams(updatedParams);
    };
    const handleAiSearch = () => {
        const query = aiQuery.trim();

        if (!query || loading) return;

        setCurrentPage(1);
        setActiveAiQuery(query);
    };

    const handleClearAiSearch = () => {
        setAiQuery("");
        setActiveAiQuery("");
        setCurrentPage(1);
    };

    return (
        <>
            <Navbar />

            <section className="products-page">
                <h1>All Products</h1>
                <form
                    className="ai-search"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleAiSearch();
                    }}
                >
                    <input
                        type="text"
                        placeholder="what do you think??"
                        aria-label="Smart product search"
                        value={aiQuery}
                        maxLength={500}
                        onChange={(event) =>
                            setAiQuery(event.target.value)
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading || !aiQuery.trim()}
                    >
                        Smart Search
                    </button>

                    {activeAiQuery && (
                        <button
                            type="button"
                            onClick={handleClearAiSearch}
                        >
                            Clear Smart Search
                        </button>
                    )}
                </form>

                {activeAiQuery && (
                    <p>
                        Smart search results for: {activeAiQuery}
                    </p>
                )}

                <fieldset
                    className="filters"
                    disabled={Boolean(activeAiQuery)}
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <select
                        value={categoryId}
                        onChange={(event) =>
                            handleCategoryChange(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            All Categories
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

                    <select
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(event.target.value)
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
                </fieldset>

                {!loading &&
                    !error &&
                    totalCount > 0 && (
                        <p className="products-count">
                            {totalCount} products found
                        </p>
                    )}

                {loading && (
                    <p className="products-message">
                        Loading products...
                    </p>
                )}

                {!loading && error && (
                    <p className="products-message">
                        {error}
                    </p>
                )}
                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <p className="products-message">
                            No products found.
                        </p>
                    )}

                {!loading &&
                    !error &&
                    products.length > 0 && (
                        <>
                            <div className="products-grid">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        initialIsFavorite={
                                            wishlistProductIds.includes(product.id)
                                        }
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                (previous) =>
                                                    previous - 1
                                            )
                                        }
                                        disabled={
                                            currentPage === 1
                                        }
                                    >
                                        Previous
                                    </button>

                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            className={
                                                currentPage === page
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setCurrentPage(page)
                                            }
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                (previous) =>
                                                    previous + 1
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
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