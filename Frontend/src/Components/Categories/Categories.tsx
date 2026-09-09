import { useEffect, useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./Categories.css";
import { apiGet } from "../../Services/api";

type Category = {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    parentCategoryId: number | null;
    parentCategoryName: string | null;
};

function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await apiGet<Category[]>("/categories");

                const mainCategories = data.filter(
                    (category) =>
                        category.parentCategoryId === null
                );

                setCategories(mainCategories);
            } catch (error) {
                console.error(
                    "Error loading categories:",
                    error
                );

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Unable to load categories.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return (
        <section
            className="categories"
            id="categories"
        >
            <h2>Shop by Category</h2>

            <p>Browse products by category.</p>

            {loading && (
                <p className="categories-message">
                    Loading categories...
                </p>
            )}

            {!loading && error && (
                <p className="categories-error">
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                categories.length === 0 && (
                    <p className="categories-message">
                        No categories available.
                    </p>
                )}

            {!loading &&
                !error &&
                categories.length > 0 && (
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                to={`/products?categoryId=${category.id}`}
                                className="category-card-link"
                                key={category.id}
                            >
                                <div className="category-card">
                                    <div className="category-icon">
                                        {category.imageUrl ? (
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                            />
                                        ) : (
                                            <FaLayerGroup />
                                        )}
                                    </div>

                                    <h3>{category.name}</h3>

                                    {category.description && (
                                        <p>
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
        </section>
    );
}

export default Categories;