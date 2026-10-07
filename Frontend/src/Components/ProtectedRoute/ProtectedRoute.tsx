import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
    children: ReactNode;
    requiredRole?: string;
};

type StoredUser = {
    id: number;
    fullName: string;
    email: string;
    roles: string[];
};

function ProtectedRoute({
    children,
    requiredRole,
}: ProtectedRouteProps) {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

    if (!token || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    let user: StoredUser;

    try {
        user = JSON.parse(storedUser);
    } catch {
        return <Navigate to="/login" replace />;
    }

    if (
        requiredRole &&
        !user.roles?.includes(requiredRole)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;