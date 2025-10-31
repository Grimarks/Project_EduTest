// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button.jsx";
import { BookOpen, Menu, X, CircleUserRound, ShieldCheck } from "lucide-react"; // <-- Tambah ShieldCheck
import { useState } from "react";
import { useAuth } from "../context/UseAuth.jsx";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, user, logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate("/");
        setIsMenuOpen(false);
    };

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Tests", path: "/tests" },
        { name: "Premium Classes", path: "/premium" },
        { name: "Dashboard", path: "/dashboard" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* ... Logo ... */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-hero p-2 rounded-lg shadow-glow">
                            <BookOpen className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">EduTest+</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-sm font-medium transition-smooth hover:text-primary ${
                                    isActive(item.path)
                                        ? "text-primary border-b-2 border-primary" // (Perbaikan kecil)
                                        : "text-muted-foreground"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <span className="text-sm text-muted-foreground">
                                    Hi, {user?.name}
                                </span>

                                {user?.role === 'admin' && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to="/admin/dashboard" className="text-accent hover:text-accent-foreground">
                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                            Admin
                                        </Link>
                                    </Button>
                                )}

                                <Link to="/account">
                                    <CircleUserRound className="h-6 w-6 text-primary cursor-pointer hover:opacity-80" />
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button variant="default" size="sm" asChild>
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                                        isActive(item.path)
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {isLoggedIn && user?.role === 'admin' && (
                                <Link
                                    to="/admin/dashboard"
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth text-accent bg-accent/10`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <ShieldCheck className="h-4 w-4 mr-2 inline" />
                                    Admin Panel
                                </Link>
                            )}

                            <div className="flex space-x-2 px-3 py-2 border-t border-border mt-2">
                                {isLoggedIn ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="flex-1"
                                        >
                                            <Link
                                                to="/account"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Account
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleLogout}
                                            className="flex-1"
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="flex-1"
                                        >
                                            <Link
                                                to="/login"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Login
                                            </Link>
                                        </Button>
                                        <Button size="sm" asChild className="flex-1">
                                            <Link
                                                to="/register"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;