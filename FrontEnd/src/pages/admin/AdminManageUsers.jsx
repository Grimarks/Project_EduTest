import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCheck, User, Star, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch.jsx";
import { Label } from "@/components/ui/label";

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const { toast } = useToast();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/auth/users");
            setUsers(response.data || []);
        } catch (err) {
            setError("Gagal mengambil data pengguna.");
            toast({
                title: "Error",
                description: "Gagal mengambil data pengguna.",
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fungsi untuk update user
    const handleUpdateUser = async (user, newRole, newIsPremium) => {
        setUpdatingId(user.id);
        try {
            await axios.put(`/auth/users/${user.id}`, {
                role: newRole,
                is_premium: newIsPremium,
            });
            toast({
                title: "Sukses",
                description: `User ${user.name} telah diupdate.`,
            });
            setUsers(users.map(u =>
                u.id === user.id ? { ...u, role: newRole, is_premium: newIsPremium } : u
            ));
        } catch (err) {
            toast({
                title: "Error",
                description: "Gagal mengupdate user.",
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>

            {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
            {error && <p className="text-destructive">{error}</p>}

            {!isLoading && !error && (
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-border">
                            {/* Header Tabel */}
                            <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 font-medium text-muted-foreground">
                                <div>User</div>
                                <div>Status</div>
                                <div>Role</div>
                                <div>Actions</div>
                            </div>

                            {users.map((user) => {
                                const isUpdating = updatingId === user.id;
                                return (
                                    <div
                                        key={user.id}
                                        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 items-center"
                                    >
                                        {/* Kolom User */}
                                        <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                                            {user.role === 'admin' ? (
                                                <UserCheck className="h-5 w-5 text-primary" />
                                            ) : (
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            )}
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Kolom Status Premium */}
                                        <div className="flex items-center gap-2">
                                            <Badge variant={user.is_premium ? "secondary" : "outline"}>
                                                <Star className="h-3 w-3 mr-1" />
                                                {user.is_premium ? "Premium" : "Free"}
                                            </Badge>
                                        </div>

                                        {/* Kolom Role */}
                                        <div className="flex items-center gap-2">
                                            <Badge variant={user.role === 'admin' ? "destructive" : "outline"}>
                                                <Shield className="h-3 w-3 mr-1" />
                                                {user.role}
                                            </Badge>
                                        </div>

                                        {/* Kolom Actions */}
                                        <div className="flex flex-col sm:flex-row gap-2 items-start md:items-center col-span-2 md:col-span-1">
                                            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}

                                            {/* Toggle Premium */}
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`premium-${user.id}`}
                                                    checked={user.is_premium}
                                                    onCheckedChange={(checked) => handleUpdateUser(user, user.role, checked)}
                                                    disabled={isUpdating}
                                                />
                                                <Label htmlFor={`premium-${user.id}`} className="text-xs">Premium</Label>
                                            </div>

                                            {/* Toggle Admin */}
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`admin-${user.id}`}
                                                    checked={user.role === 'admin'}
                                                    onCheckedChange={(checked) => handleUpdateUser(user, checked ? 'admin' : 'user', user.is_premium)}
                                                    disabled={isUpdating}
                                                />
                                                <Label htmlFor={`admin-${user.id}`} className="text-xs">Admin</Label>
                                            </div>
                                        </div>
                                    </div>
                                )})}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminManageUsers;