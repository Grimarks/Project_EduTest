import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { mockTests } from "../data/mockData";

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    const test = mockTests.find((t) => t.id === testId);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(test ? test.duration * 60 : 0); // detik
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Timer
    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted]);

    if (!test) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-foreground">Test not found</h1>
                    <Button onClick={() => navigate("/tests")}>Back to Tests</Button>
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];
    const totalQuestions = test.questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
                .toString()
                .padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAnswerSelect = (optionIndex) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: optionIndex,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        const correctAnswers = test.questions.filter(
            (q) => answers[q.id] === q.correctAnswer
        ).length;

        const score = Math.round((correctAnswers / totalQuestions) * 100);

        navigate("/result", {
            state: {
                testId: test.id,
                testTitle: test.title,
                score,
                correctAnswers,
                totalQuestions,
                timeSpent: test.duration * 60 - timeLeft,
                answers,
                questions: test.questions,
            },
        });
    };

    const getTimeColor = () => {
        const percentageLeft = (timeLeft / (test.duration * 60)) * 100;
        if (percentageLeft <= 10) return "text-destructive";
        if (percentageLeft <= 25) return "text-accent";
        return "text-foreground";
    };

    return (
        <div className="min-h-screen bg-background py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <Card className="shadow-card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">{test.title}</CardTitle>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                                        <Badge variant="outline">{currentQuestion.subject}</Badge>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div
                                        className={`flex items-center gap-2 text-lg font-mono ${getTimeColor()}`}
                                    >
                                        <Clock className="h-5 w-5" />
                                        {formatTime(timeLeft)}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Time remaining
                                    </div>
                                </div>
                            </div>

                            <Progress value={progress} className="mt-4" />
                        </CardHeader>
                    </Card>
                </div>

                {/* Question */}
                <Card className="mb-6 shadow-card">
                    <CardHeader>
                        <CardTitle className="text-lg leading-relaxed">
                            {currentQuestion.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full p-4 text-left rounded-lg border transition-smooth hover:shadow-hover ${
                                    answers[currentQuestion.id] === index
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-card hover:bg-muted"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                            answers[currentQuestion.id] === index
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-muted-foreground"
                                        }`}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleSubmit}
                            className="text-accent hover:text-accent-foreground"
                        >
                            <Flag className="h-4 w-4 mr-2" />
                            Submit Test
                        </Button>
                    </div>

                    <Button
                        onClick={handleNext}
                        disabled={currentQuestionIndex === totalQuestions - 1}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Question Navigator */}
                <Card className="mt-6 shadow-card">
                    <CardHeader>
                        <CardTitle className="text-lg">Question Navigator</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {test.questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-smooth ${
                                        index === currentQuestionIndex
                                            ? "bg-primary text-primary-foreground"
                                            : answers[test.questions[index].id] !== undefined
                                                ? "bg-secondary text-secondary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-primary rounded"></div>
                                <span>Current</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-secondary rounded"></div>
                                <span>Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-muted rounded"></div>
                                <span>Not answered</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TakeTest;
