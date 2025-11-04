import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { useAuth } from "../context/UseAuth.jsx";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

import {
    BookOpen,
    Trophy,
    Clock,
    TrendingUp,
    Target,
    Calendar,
    Award,
    Play,
} from "lucide-react";

import TestCard from "../components/TestCard";

const Dashboard = () => {
    const { user, isLoading: isAuthLoading } = useAuth();

    const [stats, setStats] = useState({
        testsCompleted: 0,
        averageScore: 0,
        studyTime: 0,
        rank: "N/A",
    });

    const [recentTests, setRecentTests] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [progressOverview, setProgressOverview] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const getScoreColor = (score) => {
        if (score >= 80) return "text-secondary-foreground";
        if (score >= 60) return "text-accent-foreground";
        return "text-destructive-foreground";
    };

    const formatStudyTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) return `${hours} hrs ${minutes} mins`;
        return `${minutes} mins`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id || isAuthLoading) return;

            setIsLoadingData(true);
            setError(null);

            try {
                const resultsResponse = await axios.get(`/test-results/user/${user.id}`);
                const results = resultsResponse.data || [];
                const recResponse = await axios.get("/tests?limit=3&premium=false");
                const formattedRecs = (recResponse.data || []).map((test) => ({
                    ...test,
                    id: String(test.id),
                    questionCount: test.questions?.length || test.questionCount || 0,
                }));
                setRecommendations(formattedRecs);

                const completed = results.length;
                const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
                const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0;
                const totalTimeSeconds = results.reduce(
                    (sum, r) => sum + (r.time_spent || 0),
                    0
                );
                const studyTimeFormatted = formatStudyTime(totalTimeSeconds);
                const categoryScores = {};
                results.forEach((r) => {
                    const category = r.Test?.category || "General";
                    if (!categoryScores[category]) categoryScores[category] = [];
                    categoryScores[category].push(r.score || 0);
                });

                const progressData = Object.entries(categoryScores).map(
                    ([subject, scores]) => {
                        const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
                        return { subject, value: Math.round(avg) };
                    }
                );

                setProgressOverview(progressData);

                setStats({
                    testsCompleted: completed,
                    averageScore: avgScore,
                    studyTime: studyTimeFormatted,
                    rank: "N/A",
                });

                setRecentTests(results.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Gagal memuat data dashboard.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchDashboardData();
    }, [user, isAuthLoading]);

    if (isAuthLoading || isLoadingData) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    if (!user) {
        return (
            <div className="p-8 text-center">Silakan login untuk melihat dashboard.</div>
        );
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">{error}</div>;
    }

    const statCards = [
        { title: "Tests Completed", value: stats.testsCompleted, icon: BookOpen },
        { title: "Average Score", value: `${stats.averageScore}%`, icon: Trophy },
        { title: "Study Time", value: stats.studyTime, icon: Clock },
        { title: "Rank", value: stats.rank, icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                            <p className="text-xl text-muted-foreground">
                                Welcome back, {user.name}!
                            </p>
                        </div>
                        {!user.is_premium && (
                            <Button variant="hero" asChild>
                                <Link to="/premium">Upgrade to Premium</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <Card
                            key={index}
                            className="shadow-card hover:shadow-hover transition-smooth bg-gradient-card"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left */}
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
                                    {recentTests.length > 0 ? (
                                        recentTests.map((test) => (
                                            <div
                                                key={test.id}
                                                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                                            >
                                                <div>
                                                    <h4 className="font-medium text-foreground">
                                                        {test.Test?.title || "Untitled Test"}
                                                    </h4>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                                {test.completed_at
                                    ? new Date(test.completed_at).toLocaleDateString()
                                    : "-"}
                            </span>
                                                        <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />{" "}
                                                            {formatStudyTime(test.time_spent || 0)}
                            </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div
                                                        className={`text-lg font-bold ${getScoreColor(
                                                            test.score
                                                        )}`}
                                                    >
                                                        {test.score ?? "-"}%
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        Completed
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground">No recent test results.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Overview */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Progress Overview (by Category)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {progressOverview.length > 0 ? (
                                    progressOverview.map((item, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{item.subject}</span>
                                                <span>{item.value}%</span>
                                            </div>
                                            <Progress value={item.value} className="h-2" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">
                                        Take a test to see your progress overview.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right */}
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

                        {/* Premium Upgrade */}
                        {!user.is_premium && (
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

                {/* Recommended Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">
                                Recommended for You
                            </h2>
                            <p className="text-muted-foreground">
                                Based on your recent performance
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link to="/tests">View All Tests</Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.length > 0 ? (
                            recommendations.map((test) => (
                                <TestCard key={test.id} test={test} />
                            ))
                        ) : (
                            <p className="text-muted-foreground md:col-span-2 lg:col-span-3">
                                No recommendations available right now.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;