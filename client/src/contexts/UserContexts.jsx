// src/contexts/UserContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cek token dan ambil data user saat app pertama kali dijalankan
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios
                .get(`${import.meta.env.VITE_API_URL}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => setUserProfile(res.data.data))
                .catch(() => {
                    setUserProfile(null);
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    return <UserContext.Provider value={{ userProfile, setUserProfile, loading }}>{children}</UserContext.Provider>;
};
