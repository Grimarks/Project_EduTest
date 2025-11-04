import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "../hooks/use-toast.jsx";
import { useAuth } from "../context/UseAuth.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });
            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Login failed",
                description:
                    error.response?.data?.error || "Invalid email or password.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="bg-gradient-hero p-3 rounded-lg shadow-glow">
                            <BookOpen className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">EduTest+</span>
                    </Link>
                </div>

                {/* Login Form */}
                <Card className="bg-gradient-card border-border/50 shadow-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to your account to continue learning
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Button variant="link" className="px-0 text-sm">
                                    Forgot password?
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>

                            <Separator />

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Features */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Join thousands of students improving their test scores
                    </p>
                    <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
                        <span>✓ Free Practice Tests</span>
                        <span>✓ Expert Classes</span>
                        <span>✓ Progress Tracking</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
