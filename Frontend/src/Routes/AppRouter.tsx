import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ForgotPasswordPage from "../Pages/ForgotPasswordPage/ForgotPasswordPage";
import ProductsPage from "../Pages/ProductsPage/ProductsPage"
import ProductDetailsPage from "../Pages/ProductsDetailsPage/ProductDetailsPage";
import CartPage from "../Pages/CartPage/CartPage";
function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
                <Route path="/products" element={<ProductsPage/>} />
                <Route path="/products/:id" element={<ProductDetailsPage/>} />
                <Route path="/cart" element={<CartPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;