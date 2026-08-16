import "./Hero.css";
import heroImage from "../../assets/images/heroImage.jpg";

function Hero() {
    return (
        <section className="hero">

            <div className="hero-content">

                <h1>
                    Smart AI-Powered
                    <br />
                    E-Commerce Platform
                </h1>

                <p>
                    Discover products faster using intelligent search,
                    personalized recommendations, and AI-powered content
                    management.
                </p>

                <div className="hero-buttons">
                    <button className="primary-btn">
                        Explore Products
                    </button>

                    <button className="secondary-btn">
                        AI Search
                    </button>
                </div>

            </div>

            <div className="hero-image">
                <img src={heroImage} alt="Hero" />
            </div>

        </section>
    );
}

export default Hero;