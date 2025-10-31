import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "@/api/axiosConfig";

const UseAuth = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkLoginStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/auth/me");
            setUser(response.data);
            setIsLoggedIn(true);
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false);
            console.error("Not logged in:", error.response?.data?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/auth/login", { email, password });

            // Ambil token dari response backend
            const token = response.data?.token;
            if (token) {
                localStorage.setItem("accessToken", token);
            }

            await checkLoginStatus();
            return true;
        } catch (error) {
            console.error("Login failed:", error.response?.data?.error || error.message);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            await axios.post("/auth/register", { name, email, password });
            return true;
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.error || error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error.response?.data?.error || error.message);
        } finally {
            localStorage.removeItem("accessToken"); // hapus token dari localStorage
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    return (
        <UseAuth.Provider
            value={{
                user,
                isLoggedIn,
                isLoading,
                login,
                register,
                logout,
                checkLoginStatus,
            }}
        >
            {!isLoading && children}
        </UseAuth.Provider>
    );
};

// Hook custom agar bisa dipakai di komponen lain
export const useAuth = () => useContext(UseAuth);
