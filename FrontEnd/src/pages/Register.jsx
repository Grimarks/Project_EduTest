import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox.jsx";
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Password mismatch",
                description: "Passwords do not match. Please try again.",
                variant: "destructive",
            });
            return;
        }

        if (!acceptTerms) {
            toast({
                title: "Terms required",
                description: "Please accept the terms and conditions to continue.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Simulasi API
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Account created!",
                description: "Welcome to EduTest+. You can now start learning.",
            });
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-page flex items-center justify-center px-4 py-8">
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

                {/* Register Form */}
                <Card className="bg-gradient-card border-border/50 shadow-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <CardDescription>
                            Join thousands of students and start your learning journey
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
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
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleInputChange}
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

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))}
                                />
                                <Label htmlFor="terms" className="text-sm">
                                    I agree to the{" "}
                                    <Link to="/terms" className="text-primary hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>
                                </Label>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>

                            <Separator />

                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Benefits */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        What you get with your free account:
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span>Free practice tests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span>Progress tracking</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span>Study materials</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span>Performance analytics</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
