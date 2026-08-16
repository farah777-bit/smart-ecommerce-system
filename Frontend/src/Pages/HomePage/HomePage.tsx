import Categories from "../../Components/Categories/Categories";
import FeaturedProducts from "../../Components/FeaturedProducts/FeaturedProducts";
import Footer from "../../Components/Footer/Footer";
import Hero from "../../Components/Hero/Hero";
import Navbar from "../../Components/Navbar/Navbar";


function HomePage() {
    return (
        <>
            <Navbar/>
            <Hero />
            <Categories />
            <FeaturedProducts />
            <Footer/>
        </>
    );
}

export default HomePage;