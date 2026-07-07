import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create axios instance with authorization header automatically attached
    const api = axios.create({
        baseURL: API_URL,
    });

    api.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // If API returns 401 Unauthorized, automatically log user out
    api.interceptors.response.use(
        (response) => response,
        (err) => {
            if (err.response && err.response.status === 401) {
                logout();
            }
            return Promise.reject(err);
        }
    );

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch user info from `/auth/me`
                const res = await axios.get(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user info', err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
            const { token: userToken, user: userData } = res.data;
            localStorage.setItem('token', userToken);
            setToken(userToken);
            setUser(userData);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
            return false;
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token: userToken, user: userData } = res.data;
            localStorage.setItem('token', userToken);
            setToken(userToken);
            setUser(userData);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, api, login, register, logout, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
