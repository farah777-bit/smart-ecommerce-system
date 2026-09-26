import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ForgotPasswordPage from "../Pages/ForgotPasswordPage/ForgotPasswordPage";
import ProductsPage from "../Pages/ProductsPage/ProductsPage"
import ProductDetailsPage from "../Pages/ProductsDetailsPage/ProductDetailsPage";
import CartPage from "../Pages/CartPage/CartPage";
import CheckoutPage from "../Pages/CheckoutPage/CheckoutPage";
import OrderDetailsPage from "../Pages/OrderDetailsPage/OrderDetailsPage";
import MyOrdersPage from "../Pages/MyOrdersPage/MyOrdersPage";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import ResetPasswordPage from "../Pages/ResetPasswordPage/ResetPasswordPage";
import WishlistPage from "../Pages/WishlistPage/WishlistPage";
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
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders/:id" element={<OrderDetailsPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route  path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/wishlist" element={<WishlistPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;