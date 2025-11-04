import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Clock, BookOpen, Star, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/UseAuth";

const TestCard = ({ test }) => {
    const { user } = useAuth();

    const normalizedTest = {
        id: String(test.id || test._id || Math.random()),
        title: test.title || "Untitled Test",
        description: test.description || "No description available.",
        category: test.category || "General",
        difficulty: test.difficulty || "Unknown",
        duration: test.duration || 30,
        questionCount: test.questionCount || test.questions?.length || 0,
        isPremium: test.isPremium ?? test.is_premium ?? false,
        price: test.price || 50000,
    };

    const getDifficultyColor = (difficulty) => {
        let baseClass = "";
        switch (difficulty) {
            case "Easy":
                baseClass = "bg-secondary";
                break;
            case "Medium":
                baseClass = "bg-yellow-500";
                break;
            case "Hard":
                baseClass = "bg-destructive";
                break;
            default:
                baseClass = "bg-muted";
        }
        return `${baseClass} text-white`;
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);

    let buttonLink = `/test/${normalizedTest.id}`;
    let buttonText = "Start Test";
    let buttonVariant = "default";

    if (normalizedTest.isPremium) {
        if (!user?.is_premium) {
            buttonLink = `/order/premium/membership`;
            buttonText = "Upgrade to Premium";
            buttonVariant = "default";
        } else {
            // Jika premium dan user premium
            buttonText = "Start Premium Test";
            buttonVariant = "default";
        }
    }

    return (
        <Card className="group hover:shadow-hover transition-smooth animate-slide-up bg-gradient-card border-border/50">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                        {normalizedTest.category}
                    </Badge>
                    <Badge className={getDifficultyColor(normalizedTest.difficulty)}>
                        {normalizedTest.difficulty}
                    </Badge>
                </div>

                <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                    {normalizedTest.title}
                    {normalizedTest.isPremium && (
                        <Lock className="inline-block ml-2 h-4 w-4 text-yellow-500" />
                    )}
                </CardTitle>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {normalizedTest.description}
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{normalizedTest.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{normalizedTest.questionCount} questions</span>
                    </div>
                </div>

                {normalizedTest.isPremium && !user?.is_premium && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Access:</span>
                        <Badge variant="secondary">Premium Only</Badge>
                    </div>
                )}


                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>4.8 (124 reviews)</span>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    asChild
                    variant={buttonVariant}
                    className="w-full"
                >
                    <Link to={buttonLink}>{buttonText}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TestCard;