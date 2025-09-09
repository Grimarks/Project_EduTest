import { Clock, BookOpen, Star, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const TestCard = ({ test }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "Easy":
                return "bg-secondary text-secondary-foreground";
            case "Medium":
                return "bg-accent text-accent-foreground";
            case "Hard":
                return "bg-destructive text-destructive-foreground";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Card className="group hover:shadow-hover transition-smooth animate-slide-up bg-gradient-card border-border/50">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                        {test.category}
                    </Badge>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                        {test.difficulty}
                    </Badge>
                </div>

                <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                    {test.title}
                    {test.isPremium && (
                        <Lock className="inline-block ml-2 h-4 w-4 text-accent" />
                    )}
                </CardTitle>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {test.description}
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{test.questionCount} questions</span>
                    </div>
                </div>

                {test.isPremium && test.price && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="font-semibold text-accent">
              {formatPrice(test.price)}
            </span>
                    </div>
                )}

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span>4.8 (124 reviews)</span>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    asChild
                    variant={test.isPremium ? "secondary" : "default"}
                    className="w-full"
                >
                    <Link to={`/test/${test.id}`}>
                        {test.isPremium ? "View Premium Test" : "Start Test"}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TestCard;