import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, FileText, BookCopy, ShoppingCart, Loader2 } from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        tests: 0,
        classes: 0,
        pendingOrders: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [
                    usersRes,
                    testsRes,
                    classesRes,
                    ordersRes
                ] = await Promise.all([
                    axios.get("/auth/users"),
                    axios.get("/tests"),
                    axios.get("/premium-classes"),
                    axios.get("/orders"),
                ]);

                const pendingCount = (ordersRes.data || []).filter(
                    (order) => order.status === 'pending'
                ).length;

                setStats({
                    users: usersRes.data?.length || 0,
                    tests: testsRes.data?.length || 0,
                    classes: classesRes.data?.length || 0,
                    pendingOrders: pendingCount,
                });

            } catch (err) {
                console.error("Gagal mengambil data dashboard:", err);
                setError("Gagal memuat data statistik.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { title: "Total Users", value: stats.users, icon: Users },
        { title: "Total Tests", value: stats.tests, icon: FileText },
        { title: "Total Classes", value: stats.classes, icon: BookCopy },
        { title: "Pending Orders", value: stats.pendingOrders, icon: ShoppingCart },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : error ? (
                <p className="text-destructive">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <Card key={stat.title} className="shadow-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-5 w-5 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.title === 'Pending Orders' ? 'Menunggu verifikasi' : 'Total terdaftar'}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Welcome Baaaacckkk Admin!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Gunakan sidebar di sebelah kiri untuk mengelola tes, kelas premium, pengguna, dan pesanan.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;