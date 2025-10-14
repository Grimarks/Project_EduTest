import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Trophy, Clock, Target, BookOpen, CheckCircle, XCircle, Star, ArrowRight } from "lucide-react";
import { mockPremiumClasses } from "../data/mockData";

const TestResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        testId,
        testTitle,
        score,
        correctAnswers,
        totalQuestions,
        timeSpent,
        answers,
        questions
    } = location.state || {};

    if (!location.state) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-foreground">No test results found</h1>
                    <Button onClick={() => navigate("/tests")}>Back to Tests</Button>
                </div>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-secondary";
        if (score >= 60) return "text-accent";
        return "text-destructive";
    };

    const getScoreMessage = (score) => {
        if (score >= 90) return "Excellent! Outstanding performance!";
        if (score >= 80) return "Great job! Well done!";
        if (score >= 70) return "Good work! Keep it up!";
        if (score >= 60) return "Not bad! Room for improvement.";
        return "Keep practicing! You'll get there.";
    };

    const recommendedClasses = mockPremiumClasses.slice(0, 2);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <div className="animate-slide-up">
                        <Trophy className={`h-16 w-16 mx-auto ${getScoreColor(score)}`} />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Test Completed!</h1>
                    <p className="text-xl text-muted-foreground">{testTitle}</p>
                </div>

                {/* Score Overview */}
                <Card className="mb-8 shadow-card bg-gradient-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl mb-4">
                            <span className={`${getScoreColor(score)} font-bold`}>{score}%</span>
                        </CardTitle>
                        <p className="text-lg text-muted-foreground">{getScoreMessage(score)}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center space-y-2">
                                <Target className="h-8 w-8 mx-auto text-primary" />
                                <div className="text-2xl font-bold text-foreground">{correctAnswers}</div>
                                <div className="text-sm text-muted-foreground">Correct Answers</div>
                                <div className="text-xs text-muted-foreground">out of {totalQuestions}</div>
                            </div>

                            <div className="text-center space-y-2">
                                <Clock className="h-8 w-8 mx-auto text-primary" />
                                <div className="text-2xl font-bold text-foreground">{formatTime(timeSpent)}</div>
                                <div className="text-sm text-muted-foreground">Time Spent</div>
                                <div className="text-xs text-muted-foreground">Great pacing!</div>
                            </div>

                            <div className="text-center space-y-2">
                                <Star className="h-8 w-8 mx-auto text-primary" />
                                <div className="text-2xl font-bold text-foreground">4.2/5</div>
                                <div className="text-sm text-muted-foreground">Performance</div>
                                <div className="text-xs text-muted-foreground">Above average</div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Overall Progress</span>
                                <span>{score}%</span>
                            </div>
                            <Progress value={score} className="h-3" />
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Review */}
                <Card className="mb-8 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Detailed Review
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {questions?.map((question, index) => {
                            const userAnswer = answers[question.id];
                            const isCorrect = userAnswer === question.correctAnswer;

                            return (
                                <div key={question.id} className="border border-border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground mb-2">
                                                Question {index + 1}: {question.question}
                                            </h4>
                                            <Badge variant="outline" className="text-xs">
                                                {question.subject}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isCorrect ? (
                                                <CheckCircle className="h-5 w-5 text-secondary" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-destructive" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`p-2 rounded border text-sm ${
                                                    optionIndex === question.correctAnswer
                                                        ? "border-secondary bg-secondary/10 text-secondary"
                                                        : optionIndex === userAnswer && !isCorrect
                                                            ? "border-destructive bg-destructive/10 text-destructive"
                                                            : "border-border"
                                                }`}
                                            >
                        <span className="font-medium">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>{" "}
                                                {option}
                                                {optionIndex === question.correctAnswer && (
                                                    <span className="ml-2 text-xs">(Correct)</span>
                                                )}
                                                {optionIndex === userAnswer && optionIndex !== question.correctAnswer && (
                                                    <span className="ml-2 text-xs">(Your answer)</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {question.explanation && (
                                        <div className="bg-muted p-3 rounded text-sm">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Recommendations */}
                {score < 80 && (
                    <Card className="mb-8 shadow-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Recommended Premium Classes
                            </CardTitle>
                            <p className="text-muted-foreground">
                                Boost your performance with our expert-led premium classes
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                {recommendedClasses.map((class_) => (
                                    <Card key={class_.id} className="border border-border hover:shadow-hover transition-smooth">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{class_.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{class_.description}</p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Instructor:</span>
                                                    <span className="text-sm font-medium">{class_.instructor}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Duration:</span>
                                                    <span className="text-sm font-medium">{class_.duration}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Price:</span>
                                                    <span className="text-lg font-bold text-accent">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                            }).format(class_.price)}
                          </span>
                                                </div>
                                                <Button variant="secondary" className="w-full" asChild>
                                                    <Link to="/premium">
                                                        View Class
                                                        <ArrowRight className="h-4 w-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" asChild>
                        <Link to="/tests">Take Another Test</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/dashboard">View Dashboard</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link to="/premium">Explore Premium</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TestResult;
