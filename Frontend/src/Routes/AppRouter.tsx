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
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import AdminDashboardPage from "../Pages/AdminDashboardPage/AdminDashboardPage";
import AdminProductsPage from "../Pages/AdminProductsPage/AdminProductsPage";
import AdminAddProductPage from "../Pages/AdminAddProductPage/AdminAddProductPage";
import AdminProductImagesPage from "../Pages/AdminProductImagesPage/AdminProductImagesPage";
import AdminEditProductPage from "../Pages/AdminEditProductPage/AdminEditProductPage";
import AdminCategoriesPage from "../Pages/AdminCategoriesPage/AdminCategoriesPage";
import AdminOrdersPage from "../Pages/AdminOrdersPage/AdminOrdersPage";
import AdminOrderDetailsPage from "../Pages/AdminOrderDetailsPage/AdminOrderDetailsPage";
function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><AdminDashboardPage /></ProtectedRoute>} />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/products/new"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminAddProductPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/products/:id/images"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminProductImagesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/products/:id/edit"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminEditProductPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminCategoriesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminOrdersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/orders/:id"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminOrderDetailsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;