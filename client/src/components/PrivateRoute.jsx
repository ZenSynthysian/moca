import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PrivateRoute = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        // Verifikasi token ke API
        axios
            .get(`${import.meta.env.VITE_API_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            })
            .then((res) => {
                setIsAuthenticated(true);
            })
            .catch((err) => {
                console.error('Token tidak valid:', err.response?.data || err.message);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center p-10 bg-moca3">Memeriksa sesi login...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
