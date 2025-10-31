import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    BookCopy,
    Users,
    ShoppingCart,
    ShieldCheck,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Tests", href: "/admin/tests", icon: FileText },
    { name: "Manage Classes", href: "/admin/classes", icon: BookCopy },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Manage Orders", href: "/admin/orders", icon: ShoppingCart },
];

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="flex">
                <aside className="w-64 bg-card h-screen sticky top-16 border-r border-border p-4">
                    <div className="flex items-center gap-2 p-2 mb-4">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
                    </div>
                    <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                                        isActive && "bg-muted text-primary font-medium"
                                    )
                                }
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;