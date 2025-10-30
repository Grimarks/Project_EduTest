import { useEffect, useState } from "react";
import axios from '@/api/axiosConfig';
import { useAuth } from "../context/UseAuth.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
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

const Dashboard = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [stats, setStats] = useState({ testsCompleted: 0, averageScore: 0, studyTime: 0, rank: "N/A" });
    const [recentResults, setRecentResults] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id || isAuthLoading) return;
            setIsLoadingData(true);
            setError(null);
            try {
                const resultsResponse = await axios.get(`/test-results/user/${user.id}`);
                setRecentResults(resultsResponse.data.slice(0, 3));

                const testsResponse = await axios.get('/tests?limit=3&premium=false');
                setRecommendations(testsResponse.data.map(t => ({ ...t, id: String(t.id) })));

                const completed = resultsResponse.data.length;
                const totalScore = resultsResponse.data.reduce((sum, r) => sum + r.score, 0);
                const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0;
                setStats({ testsCompleted: completed, averageScore: avgScore, studyTime: 0, rank: "N/A" });
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Could not load dashboard data.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [user, isAuthLoading]);

    const getScoreColor = (score) => {
        if (score >= 80) return "text-secondary-foreground";
        if (score >= 60) return "text-accent-foreground";
        return "text-destructive-foreground";
    };

    if (isAuthLoading || isLoadingData) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center">Please log in to view the dashboard.</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                            <p className="text-xl text-muted-foreground">Welcome back, {user.name}!</p>
                        </div>
                        {!user.is_premium && (
                            <Button variant="hero" asChild>
                                <Link to="/premium">Upgrade to Premium</Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader><CardTitle>Tests Completed</CardTitle></CardHeader>
                        <CardContent>{stats.testsCompleted}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Average Score</CardTitle></CardHeader>
                        <CardContent>{stats.averageScore}%</CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Study Time</CardTitle></CardHeader>
                        <CardContent>{stats.studyTime} hrs</CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Rank</CardTitle></CardHeader>
                        <CardContent>{stats.rank}</CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5" /> Recent Test Results
                                    </CardTitle>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to="/tests">View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentResults.length > 0 ? (
                                        recentResults.map(result => (
                                            <div key={result.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-foreground">{result.Test?.title || "Unnamed Test"}</h4>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {new Date(result.completed_at).toLocaleDateString()}
                            </span>
                                                        <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {result.duration || "--"}
                            </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>{result.score}%</div>
                                                    <Badge variant="outline" className="text-xs">Completed</Badge>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No recent test results.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Progress Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm"><span>Mathematics</span><span>85%</span></div>
                                    <Progress value={85} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm"><span>English</span><span>72%</span></div>
                                    <Progress value={72} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm"><span>Science</span><span>68%</span></div>
                                    <Progress value={68} className="h-2" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm"><span>General Knowledge</span><span>91%</span></div>
                                    <Progress value={91} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" asChild>
                                    <Link to="/tests"><Play className="h-4 w-4 mr-2" />Take a Practice Test</Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/premium"><Award className="h-4 w-4 mr-2" />Browse Premium Classes</Link>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start">
                                    <TrendingUp className="h-4 w-4 mr-2" />View Detailed Analytics
                                </Button>
                            </CardContent>
                        </Card>

                        {!user.is_premium && (
                            <Card className="shadow-card bg-gradient-hero text-primary-foreground">
                                <CardHeader><CardTitle>Unlock Premium Features</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2"><Award className="h-4 w-4" /><span>Advanced Analytics</span></div>
                                        <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>Premium Practice Tests</span></div>
                                        <div className="flex items-center gap-2"><Trophy className="h-4 w-4" /><span>Expert-led Classes</span></div>
                                    </div>
                                    <Button variant="secondary" className="w-full" asChild>
                                        <Link to="/premium">Upgrade Now</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

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
                        {recommendations.map(test => (
                            <TestCard key={test.id} test={test} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;