import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, FileText, BookCopy, ShoppingCart } from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        { title: "Total Users", value: "N/A", icon: Users },
        { title: "Total Tests", value: "N/A", icon: FileText },
        { title: "Total Classes", value: "N/A", icon: BookCopy },
        { title: "Pending Orders", value: "N/A", icon: ShoppingCart },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
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
                                Data from backend needed
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Welcome, Admin!</CardTitle>
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