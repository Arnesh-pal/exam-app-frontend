// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { token } = useAuth();

    // If there's no token, redirect to the login page
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If there is a token, render the child component (e.g., ExamPage)
    return <Outlet />;
};

export default ProtectedRoute;