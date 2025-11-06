import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    BookCopy,
    Users,
    ShoppingCart,
    ShieldCheck,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Tests", href: "/admin/tests", icon: FileText },
    { name: "Manage Classes", href: "/admin/classes", icon: BookCopy },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Manage Orders", href: "/admin/orders", icon: ShoppingCart },
];

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="flex">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/50 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <aside
                    className={cn(
                        "fixed top-0 left-0 z-30 h-full w-64 bg-card border-r border-border p-4 " +
                        "transition-transform duration-300 ease-in-out -translate-x-full",
                        "md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0",
                        isSidebarOpen && "translate-x-0"
                    )}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2 p-2 mb-4">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
                    </div>
                    <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)}
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

                <main className="flex-1 p-4 md:p-8 w-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mb-4 md:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;