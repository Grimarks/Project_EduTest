import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { useAuth } from "../context/UseAuth";
import { User, LogOut, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";

const Account = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user]);

    // Button nya belum kepakai karena belum di implementasikan
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        toast.info("Fitur ganti password saat ini belum tersedia.");
    };

    const handleSignOut = async () => {
        await logout();
        toast.success("Signed out", {
            description: "You have been signed out successfully",
        });
        navigate("/");
    };

    if (!user) {
        return <div className="text-center py-20">Loading account...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <div className="bg-gradient-hero p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-glow">
                        <User className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account preferences
                    </p>
                </div>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            Detail akun Anda. Fitur ganti nama belum tersedia.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            Fitur ganti password saat ini belum tersedia.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Form dinonaktifkan */}
                        <form onSubmit={handleUpdatePassword} className="space-y-4 opacity-50 cursor-not-allowed">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        disabled
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    disabled
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled
                            >
                                <LockKeyhole className="mr-2 h-4 w-4" />
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Sign Out */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sign Out</CardTitle>
                        <CardDescription>Sign out of your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleSignOut}
                            variant="destructive"
                            className="inline-flex items-center justify-center gap-2"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Account;