import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCheck, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {user.role === 'admin' ? (
                                            <UserCheck className="h-5 w-5 text-accent" />
                                        ) : (
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {user.is_premium && (
                                            <Badge variant="secondary">Premium</Badge>
                                        )}
                                        <Badge variant={user.role === 'admin' ? "destructive" : "outline"}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminManageUsers;