import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Trophy,
    Clock,
    TrendingUp,
    Target,
    Calendar,
    Award,
    Play
} from "lucide-react";
import TestCard from "../components/TestCard";
import { mockTests } from "../data/mockData";

const Dashboard = () => {
    // Mock user data
    const user = {
        name: "John Doe",
        email: "john@example.com",
        isPremium: false,
        joinDate: "2024-01-15"
    };

    const stats = [
        {
            title: "Tests Completed",
            value: "12",
            change: "+3 this week",
            icon: BookOpen,
            color: "text-primary"
        },
        {
            title: "Average Score",
            value: "78%",
            change: "+5% improvement",
            icon: Trophy,
            color: "text-secondary"
        },
        {
            title: "Study Time",
            value: "24hrs",
            change: "+2hrs this week",
            icon: Clock,
            color: "text-accent"
        },
        {
            title: "Rank",
            value: "#143",
            change: "Top 15%",
            icon: TrendingUp,
            color: "text-primary"
        }
    ];

    const recentTests = [
        {
            id: "1",
            title: "UTBK Mathematics Practice",
            score: 85,
            date: "2024-01-20",
            duration: "1h 30m"
        },
        {
            id: "2",
            title: "English Proficiency Test",
            score: 72,
            date: "2024-01-18",
            duration: "1h 15m"
        },
        {
            id: "3",
            title: "General Knowledge Quiz",
            score: 91,
            date: "2024-01-15",
            duration: "45m"
        }
    ];

    const recommendations = mockTests.slice(0, 3);

    const getScoreColor = (score) => {
        if (score >= 80) return "text-secondary-foreground";
        if (score >= 60) return "text-accent-foreground";
        return "text-destructive-foreground";
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                            <p className="text-xl text-muted-foreground">Welcome back, {user.name}!</p>
                        </div>
                        {!user.isPremium && (
                            <Button variant="hero" asChild>
                                <Link to="/premium">Upgrade to Premium</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="shadow-card hover:shadow-hover transition-smooth bg-gradient-card">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.change}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Test Results */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5" />
                                        Recent Test Results
                                    </CardTitle>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to="/tests">View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentTests.map((test) => (
                                        <div key={test.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-foreground">{test.title}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                              {test.date}
                          </span>
                                                    <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                                                        {test.duration}
                          </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${getScoreColor(test.score)}`}>
                                                    {test.score}%
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    Completed
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Overview */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Progress Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Mathematics</span>
                                        <span>85%</span>
                                    </div>
                                    <Progress value={85} className="h-2" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>English</span>
                                        <span>72%</span>
                                    </div>
                                    <Progress value={72} className="h-2" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Science</span>
                                        <span>68%</span>
                                    </div>
                                    <Progress value={68} className="h-2" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>General Knowledge</span>
                                        <span>91%</span>
                                    </div>
                                    <Progress value={91} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" asChild>
                                    <Link to="/tests">
                                        <Play className="h-4 w-4 mr-2" />
                                        Take a Practice Test
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/premium">
                                        <Award className="h-4 w-4 mr-2" />
                                        Browse Premium Classes
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    View Detailed Analytics
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Achievement Badges */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Recent Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gradient-success rounded-lg">
                                    <div className="bg-secondary-foreground rounded-full p-2">
                                        <Trophy className="h-4 w-4 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-secondary-foreground">First Perfect Score!</h4>
                                        <p className="text-xs text-secondary-foreground/80">Scored 100% on General Knowledge Quiz</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gradient-learner rounded-lg">
                                    <div className="bg-primary rounded-full p-2">
                                        <Target className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-foreground">Consistent Learner</h4>
                                        <p className="text-xs text-muted-foreground">Completed 10 tests this month</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Premium Upgrade */}
                        {!user.isPremium && (
                            <Card className="shadow-card bg-gradient-hero text-primary-foreground">
                                <CardHeader>
                                    <CardTitle>Unlock Premium Features</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4" />
                                            <span>Advanced Analytics</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            <span>Premium Practice Tests</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-4 w-4" />
                                            <span>Expert-led Classes</span>
                                        </div>
                                    </div>
                                    <Button variant="secondary" className="w-full" asChild>
                                        <Link to="/premium">Upgrade Now</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Recommended Tests */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
                            <p className="text-muted-foreground">Based on your recent performance</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link to="/tests">View All Tests</Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((test) => (
                            <TestCard key={test.id} test={test} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;