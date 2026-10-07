import { useEffect, useState } from "react";
import "./FeaturedProducts.css";

import ProductCard from "../ProductCard/ProductCard";
import { apiGet } from "../../Services/api";
import type { Product } from "../../Types/Product";

type PaginatedProductsResponse = {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

function FeaturedProducts() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [wishlistProductIds, setWishlistProductIds] = useState<number[]>([]);

    useEffect(() => {

        const loadProducts = async () => {

            try {

                const data =
                    await apiGet<PaginatedProductsResponse>(
                        "/products?page=1&pageSize=4"
                    );

                setProducts(data.items);

            } catch (error) {

                console.error(
                    "Error loading featured products:",
                    error
                );

                setError(
                    "Could not load featured products."
                );

            } finally {

                setLoading(false);

            }

        };

        const loadWishlist = async () => {

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) return;

            try {

                const data = await apiGet<any>(
                    "/wishlist",
                    true
                );

                const ids = data.items.map(
                    (item: any) => item.productId
                );

                setWishlistProductIds(ids);

            } catch (error) {

                console.error(
                    "Error loading wishlist:",
                    error
                );

            }
        };

        loadProducts();
        loadWishlist();

    }, []);

    return (

        <section
            className="featured-products"
            id="featured-products"
        >

            <h2>Featured Products</h2>

            <p>
                Explore our most popular products.
            </p>

            {loading && (
                <p>Loading products...</p>
            )}

            {!loading && error && (
                <p>{error}</p>
            )}

            {!loading &&
                !error &&
                products.length > 0 && (

                    <div className="products-grid">

                        {products.map(
                            (product) => (<ProductCard key={product.id} product={product} initialIsFavorite={
                                wishlistProductIds.includes(product.id)
                            } />)
                        )}

                    </div>

                )}

        </section>

    );
}

export default FeaturedProducts;