import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Flag, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/UseAuth";
import { useToast } from "../hooks/use-toast";

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast(); // Panggil hook toast
    const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // --- PERBAIKAN TIMER: Gunakan useRef untuk menyimpan ID interval ---
    const timerRef = useRef(null);

    // --- BLOK PERBAIKAN OTENTIKASI (Sudah ada, tapi kita tambahkan toast) ---
    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            toast({
                title: "Akses Ditolak",
                description: "Anda harus login untuk mengambil tes.",
                variant: "destructive",
            });
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [isAuthLoading, isLoggedIn, navigate, location.pathname, toast]);
    // --- AKHIR BLOK PERBAIKAN ---

    useEffect(() => {
        if (isAuthLoading || !isLoggedIn) return;

        const fetchTestData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const testResponse = await axios.get(`/tests/${testId}`);
                const fetchedTest = { ...testResponse.data, id: String(testResponse.data.id) };

                // --- PERBAIKAN AKSES PREMIUM ---
                // Cek apakah tes ini premium dan user bukan premium
                if (fetchedTest.is_premium && !user?.is_premium) {
                    setError("Tes ini khusus untuk anggota premium.");
                    toast({
                        title: "Akses Ditolak",
                        description: "Anda harus menjadi anggota premium untuk mengambil tes ini.",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return; // Hentikan fetching
                }
                // --- AKHIR PERBAIKAN ---

                setTest(fetchedTest);
                setTimeLeft(fetchedTest.duration * 60);

                const questionsResponse = await axios.get(`/questions/test/${testId}`);
                const formattedQuestions = questionsResponse.data.map((q) => ({
                    ...q,
                    id: String(q.id),
                    options: typeof q.options === "string" ? JSON.parse(q.options) : q.options || [],
                    correctAnswer: q.correct_answer,
                }));
                setQuestions(formattedQuestions);
            } catch (err) {
                console.error("Failed to load test:", err);
                setError("Failed to load the test. Please go back and try again.");
                if (err.response?.status === 404) setError("Test not found (404).");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestData();
    }, [testId, isAuthLoading, isLoggedIn, user]);

    // --- PERBAIKAN TIMER: useEffect baru untuk countdown ---
    useEffect(() => {
        // Hanya jalan jika tes sudah ada dan waktu > 0
        if (!test || timeLeft <= 0 || isSubmitted) {
            clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    // Waktu habis, auto-submit
                    toast({
                        title: "Waktu Habis!",
                        description: "Hasil tes Anda sedang dikirim...",
                        variant: "destructive",
                    });
                    handleSubmit(true); // Kirim flag autoSubmit
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup function
        return () => {
            clearInterval(timerRef.current);
        };
    }, [test, timeLeft, isSubmitted, toast]); // Tambahkan dependensi
    // --- AKHIR PERBAIKAN TIMER ---


    const handleAnswerSelect = (questionId, optionIndex) => {
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            // BUGFIX: Seharusnya ke index sebelumnya, bukan +1
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Modifikasi handleSubmit untuk menerima flag autoSubmit
    const handleSubmit = async (isAutoSubmit = false) => {
        if (isSubmitted) return;

        if (!isAutoSubmit) {
            if (!window.confirm("Apakah Anda yakin ingin menyelesaikan tes ini?")) {
                return;
            }
        }

        setIsSubmitted(true);
        clearInterval(timerRef.current); // Hentikan timer

        const totalDurationSeconds = test ? test.duration * 60 : 0;
        const timeSpent = totalDurationSeconds > 0 ? totalDurationSeconds - timeLeft : 0;

        const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            question_id: questionId,
            selected_answer: selectedAnswer,
        }));

        try {
            const response = await axios.post("/test-results", {
                test_id: testId,
                time_spent: timeSpent,
                answers: formattedAnswers,
            });

            navigate("/result", {
                state: {
                    testId: test.id,
                    testTitle: test.title,
                    score: Math.round(response.data.score),
                    correctAnswers: response.data.correct_answers,
                    totalQuestions: response.data.total_questions,
                    timeSpent: response.data.time_spent,
                    answers,
                    questions,
                },
            });
        } catch (error) {
            console.error("Failed to submit test:", error);
            setIsSubmitted(false); // Biarkan user mencoba submit lagi jika gagal
            toast({
                title: "Submit Gagal",
                description: "Gagal mengirimkan hasil tes. Coba lagi.",
                variant: "destructive",
            });
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const getTimeColor = () => {
        if (!test || !test.duration) return "text-foreground";
        const percentageLeft = (timeLeft / (test.duration * 60)) * 100;
        if (percentageLeft <= 10) return "text-destructive";
        if (percentageLeft <= 25) return "text-yellow-500"; // Ganti accent
        return "text-foreground";
    };

    if (isLoading || isAuthLoading) return <div className="p-8 text-center">Loading test...</div>;

    if (error) return (
        <div className="p-8 text-center text-destructive flex flex-col items-center gap-4">
            <ShieldAlert className="h-16 w-16" />
            <p className="text-xl">{error}</p>
            <Button onClick={() => navigate("/tests")} className="mt-4">Back to Tests</Button>
            {error.includes("premium") && (
                <Button onClick={() => navigate("/premium")} variant="secondary">Upgrade to Premium</Button>
            )}
        </div>
    );

    if (!isLoggedIn) return null;

    if (!test || questions.length === 0) return <div className="p-8 text-center">Test data is incomplete.</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

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
                                        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                                        <Badge variant="outline">{currentQuestion.subject || 'General'}</Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`flex items-center gap-2 text-lg font-mono ${getTimeColor()}`}>
                                        <Clock className="h-5 w-5" />
                                        {formatTime(timeLeft)}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">Time remaining</div>
                                </div>
                            </div>
                            <Progress value={progress} className="mt-4" />
                        </CardHeader>
                    </Card>
                </div>

                {/* Question Card */}
                <Card className="mb-6 shadow-card">
                    <CardHeader>
                        <CardTitle className="text-lg leading-relaxed">{currentQuestion.question_text}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                                className={`w-full p-4 text-left rounded-lg border transition-smooth hover:shadow-hover ${
                                    answers[currentQuestion.id] === index
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-card hover:bg-muted"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                        answers[currentQuestion.id] === index
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground"
                                    }`}>
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
                    <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        {/* Panggil handleSubmit tanpa argumen saat diklik manual */}
                        <Button variant="destructive" onClick={() => handleSubmit(false)}>
                            <Flag className="h-4 w-4 mr-2" /> Submit Test
                        </Button>
                    </div>
                    <Button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1}>
                        Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Navigator Grid */}
                <Card className="mt-6 shadow-card">
                    <CardHeader>
                        <CardTitle className="text-lg">Question Navigator</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {questions.map((q, index) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-smooth ${
                                        index === currentQuestionIndex
                                            ? "bg-primary text-primary-foreground"
                                            : answers[q.id] !== undefined
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