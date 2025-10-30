import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from '@/api/axiosConfig';

const UseAuth = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Simpan data user (id, name, email, role, is_premium)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Untuk cek status login awal

    // Fungsi untuk cek status login saat aplikasi dimuat
    const checkLoginStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/auth/me');
            setUser(response.data);
            setIsLoggedIn(true);
        } catch (error) {
            // Jika /auth/me gagal (misal 401), berarti belum login
            setUser(null);
            setIsLoggedIn(false);
            console.error("Not logged in:", error.response?.data?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkLoginStatus(); // Cek saat pertama kali load
    }, [checkLoginStatus]);

    const login = async (email, password) => {
        try {
            await axios.post('/auth/login', { email, password });
            await checkLoginStatus(); // Ambil data user setelah login
            return true; // Login berhasil
        } catch (error) {
            console.error("Login failed:", error.response?.data?.error || error.message);
            throw error; // Lempar error agar bisa ditangani di komponen Login
        }
    };

    const register = async (name, email, password) => {
        try {
            await axios.post('/auth/register', { name, email, password });
            // Opsional: Langsung login setelah register atau arahkan ke halaman login
            return true;
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.error || error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed:", error.response?.data?.error || error.message);
            // Tetap lanjutkan proses logout di frontend meskipun API gagal
        } finally {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    return (
        <UseAuth.Provider value={{ user, isLoggedIn, isLoading, login, register, logout, checkLoginStatus }}>
            {!isLoading && children} {/* Tampilkan children hanya setelah loading selesai */}
        </UseAuth.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(UseAuth);