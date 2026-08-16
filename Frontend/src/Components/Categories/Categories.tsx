import "./Categories.css";
import {
    FaLaptop,
    FaTshirt,
    FaHome,
    FaMobileAlt,
    FaBook,
    FaFutbol,
} from "react-icons/fa";

function Categories() {
    const categories = [
        { icon: <FaLaptop />, name: "Electronics" },
        { icon: <FaTshirt />, name: "Fashion" },
        { icon: <FaHome />, name: "Home" },
        { icon: <FaMobileAlt />, name: "Mobiles" },
        { icon: <FaBook />, name: "Books" },
        { icon: <FaFutbol />, name: "Sports" },
    ];

    return (
        <section className="categories" id="categories">
            <h2>Shop by Category</h2>
            <p>Browse products by category.</p>

            <div className="categories-grid">
                {categories.map((category, index) => (
                    <div className="category-card" key={index}>
                        <div className="category-icon">{category.icon}</div>
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Categories;