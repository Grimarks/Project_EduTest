import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";

const AdminRoute = () => {
    const { isLoggedIn, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
                <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-3xl font-bold text-foreground">Akses Ditolak</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Anda tidak memiliki hak akses untuk melihat halaman ini.
                </p>
                <Button asChild className="mt-6">
                    <Navigate to="/dashboard">Kembali ke Dashboard</Navigate>
                </Button>
            </div>
        );
    }
    return <Outlet />;
};

export default AdminRoute;