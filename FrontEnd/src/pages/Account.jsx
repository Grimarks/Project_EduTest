import React, { useState } from "react";
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
import { useToast } from "../hooks/use-toast";
import { User, LogOut, Eye, EyeOff } from "lucide-react";

const Account = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Dummy user data
    const [user] = useState({
        email: "demo@example.com",
        name: "Demo User",
    });
    const [updating, setUpdating] = useState(false);
    const [name, setName] = useState("Demo User");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({
                title: "Error",
                description: "Name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        setUpdating(true);
        // Simulate API call
        setTimeout(() => {
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            setUpdating(false);
        }, 1000);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        setUpdating(true);
        // Simulate API call
        setTimeout(() => {
            setPassword("");
            setConfirmPassword("");
            toast({
                title: "Success",
                description: "Password updated successfully",
            });
            setUpdating(false);
        }, 1000);
    };

    const handleSignOut = () => {
        toast({
            title: "Signed out",
            description: "You have been signed out successfully",
        });
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
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
                            Update your name and personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={updating}
                                className="bg-[hsl(217,91%,60%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(217,91%,55%)]
             inline-flex items-center justify-center gap-2 rounded-md px-4 py-2
             text-sm font-medium shadow-card hover:shadow-hover transition-all
             disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {updating ? "Updating..." : "Update Profile"}
                            </Button>

                        </form>
                    </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            Update your account password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
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
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={updating || !password}
                                className="bg-[hsl(217,91%,60%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(217,91%,55%)]
             inline-flex items-center justify-center gap-2 rounded-md px-4 py-2
             text-sm font-medium shadow-card hover:shadow-hover transition-all
             disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {updating ? "Updating..." : "Update Password"}
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
                            className="bg-[hsl(0,84%,60%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(0,84%,55%)] transition-all inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-card hover:shadow-hover"
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
