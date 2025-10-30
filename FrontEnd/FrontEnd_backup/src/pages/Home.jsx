import { Link } from "react-router-dom";
import {
    BookOpen,
    Users,
    Trophy,
    Clock,
    CheckCircle,
    Star,
} from "lucide-react";
import heroImage from "../assets/hero-education.jpg";
import TestCard from "../components/TestCard";
import { mockTests } from "../data/mockData";

// UI Components
import { Button } from "../components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const Home = () => {
    const featuredTests = mockTests.slice(0, 3);

    const stats = [
        { icon: Users, label: "Active Students", value: "10K+" },
        { icon: BookOpen, label: "Practice Tests", value: "500+" },
        { icon: Trophy, label: "Success Rate", value: "95%" },
        { icon: Clock, label: "Study Hours", value: "100K+" },
    ];

    const features = [
        {
            icon: CheckCircle,
            title: "Comprehensive Tests",
            description:
                "Wide range of practice tests covering all major subjects and exam formats",
        },
        {
            icon: Clock,
            title: "Timed Practice",
            description:
                "Simulate real exam conditions with time-limited practice sessions",
        },
        {
            icon: Trophy,
            title: "Detailed Analytics",
            description:
                "Track your progress with detailed performance analytics and recommendations",
        },
        {
            icon: Star,
            title: "Expert Content",
            description:
                "Questions and materials created by subject matter experts and educators",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-slide-up">
                            <div className="space-y-4">
                                <Badge className="bg-primary-glow text-primary-foreground hover:bg-primary-glow/90">
                                    🎯 #1 Online Test Platform
                                </Badge>
                                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                                    Master Your Exams with{" "}
                                    <span className="text-primary-glow">EduTest+</span>
                                </h1>
                                <p className="text-xl text-white/90 leading-relaxed">
                                    The ultimate platform for online test simulation and premium
                                    educational classes. Practice with real exam conditions and
                                    boost your confidence.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="hero" size="lg" asChild>
                                    <Link to="/tests">Start Practicing Now</Link>
                                </Button>
                                <Button
                                    variant="hero"
                                    size="lg"
                                    className="border-white bg-black text-white hover: hover:text-primary"
                                >
                                    <Link to="/premium">View Premium Classes</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="hidden lg:block animate-float">
                            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-glow">
                                <CardHeader>
                                    <CardTitle className="text-white">Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center space-y-2">
                                            <stat.icon className="h-8 w-8 text-primary-glow mx-auto" />
                                            <div className="text-2xl font-bold text-white">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-white/80">{stat.label}</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                            Why Choose EduTest+?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Experience the most comprehensive online test preparation platform
                            with advanced features
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="text-center group hover:shadow-hover transition-smooth bg-gradient-card"
                            >
                                <CardHeader>
                                    <div className="mx-auto bg-gradient-hero p-3 rounded-full w-fit shadow-glow group-hover:shadow-hover transition-smooth">
                                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Tests Section */}
            <section className="py-16 lg:py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-2">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                                Featured Practice Tests
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Start with our most popular tests
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link to="/tests">View All Tests</Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredTests.map((test) => (
                            <TestCard key={test.id} test={test} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <Card className="bg-gradient-hero text-primary-foreground shadow-glow">
                        <CardHeader>
                            <CardTitle className="text-3xl lg:text-4xl font-bold">
                                Ready to Excel in Your Exams?
                            </CardTitle>
                            <CardDescription className="text-xl text-primary-foreground/90">
                                Join thousands of students who have improved their scores with
                                EduTest+
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center gap-8 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Free Practice Tests</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Instant Results</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Progress Tracking</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="secondary" size="lg" asChild>
                                    <Link to="/register">Get Started Free</Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                                >
                                    <Link to="/premium">Explore Premium</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Home;
