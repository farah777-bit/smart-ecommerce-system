import { Link } from "react-router-dom";
import "./ProductCard.css";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import type { Product } from "../../Types/Product";

type ProductCardProps = {
    product: Product;
};

function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="product-card">

            <img
                src={product.primaryImageUrl || "/placeholder-product.jpg"}
                alt={product.name}
                className="product-image"
            />

            <div className="product-info">

                <h3>{product.name}</h3>

                <div className="rating">
                    <FaStar />
                    <span>0</span>
                </div>

                <p className="price">
                    ${product.price.toFixed(2)}
                </p>

                <div className="buttons">

                    <Link
                        to={`/products/${product.id}`}
                    className="details-btn"
                    >
                    View Details
                </Link>

                <button
                    className="cart-btn"
                    disabled={product.stockQuantity <= 0}
                >
                    <FaShoppingCart />
                </button>

            </div>

        </div>

        </div >
    );
}

export default ProductCard;