import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Clock, User, Star, CheckCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/UseAuth";

const PremiumClasses = () => {
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categories, setCategories] = useState(["All"]);
    const { user, isLoggedIn } = useAuth(); // <-- Ambil user dan status login

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get("/premium-classes");
                const formattedClasses = response.data.map((cls) => ({
                    ...cls,
                    id: String(cls.id),
                    price: cls.price || 150000,
                    features: cls.features || [
                        "Video Pembelajaran HD",
                        "Live Q&A Mingguan",
                        "Studi Kasus",
                    ],
                }));

                setClasses(formattedClasses);
                const uniqueCategories = [
                    ...new Set(
                        formattedClasses.map((c) => c.category || "General")
                    ),
                ];
                setCategories(["All", ...uniqueCategories]);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch premium classes.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const filteredClasses =
        selectedCategory === "All"
            ? classes
            : classes.filter((cls) => cls.category === selectedCategory);

    const formatPrice = (price) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <div className="min-h-screen bg-gradient-page">
            {/* HEADER */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Premium <span className="text-primary">Classes</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Unlock your potential with expert-led courses designed to help you excel.
                    </p>
                </div>
            </section>

            {/* FILTER */}
            <section className="px-4 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <h2 className="text-2xl font-semibold text-foreground">
                            Available Classes ({filteredClasses.length})
                        </h2>

                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select category">
                                    {selectedCategory}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* LIST KELAS */}
            <section className="px-4 pb-16">
                <div className="max-w-7xl mx-auto">
                    {isLoading && (
                        <p className="text-center text-muted-foreground">Loading classes...</p>
                    )}
                    {error && (
                        <p className="text-center text-destructive">{error}</p>
                    )}

                    {!isLoading && !error && (
                        <>
                            {filteredClasses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredClasses.map((premiumClass, index) => {
                                        // --- LOGIKA TOMBOL BERDASARKAN STATUS USER ---
                                        let buttonLink = `/order/class/${premiumClass.id}`;
                                        let buttonText = "Enroll Now";
                                        let buttonVariant = "default";

                                        if (!isLoggedIn) {
                                            buttonLink = "/login";
                                            buttonText = "Login to Enroll";
                                        } else if (user?.is_premium) {
                                            buttonLink = "/dashboard";
                                            buttonText = "View Class (Premium)";
                                            buttonVariant = "outline";
                                        }

                                        return (
                                            <Card
                                                key={premiumClass.id}
                                                className="group hover:shadow-hover transition-smooth animate-slide-up bg-gradient-card border-border/50"
                                                style={{
                                                    animationDelay: `${index * 0.1}s`,
                                                }}
                                            >
                                                <CardHeader className="space-y-3">
                                                    {/* --- PERBAIKAN GAMBAR --- */}
                                                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                                        {premiumClass.image_url ? (
                                                            <img
                                                                src={premiumClass.image_url}
                                                                alt={premiumClass.title}
                                                                className="w-full h-full object-cover"
                                                                // Tambahkan onError untuk fallback jika link gambar rusak
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                    const parent = e.currentTarget.parentElement;
                                                                    if (parent) {
                                                                        const icon = parent.querySelector('.fallback-icon');
                                                                        if(icon) icon.style.display = 'flex';
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="bg-muted h-full w-full flex items-center justify-center text-muted-foreground">
                                                                <BookOpen className="h-20 w-20 opacity-30" />
                                                            </div>
                                                        )}
                                                        {premiumClass.image_url && (
                                                            <div className="fallback-icon bg-muted h-full w-full items-center justify-center text-muted-foreground" style={{display: 'none'}}>
                                                                <BookOpen className="h-20 w-20 opacity-30" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-start justify-between">
                                                        <Badge variant="outline" className="text-xs">
                                                            {premiumClass.category}
                                                        </Badge>
                                                        <Badge className="bg-accent text-accent-foreground">
                                                            Premium
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                                                        {premiumClass.title}
                                                    </CardTitle>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {premiumClass.description || "No description available."}
                                                    </p>
                                                </CardHeader>

                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            <span>{premiumClass.instructor}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{premiumClass.duration || "Self-paced"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-foreground">
                                                            What you'll learn:
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {premiumClass.features.slice(0, 3).map((feature, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                                                >
                                                                    <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-border">
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Star className="h-4 w-4 fill-accent text-accent" />
                                                            <span>4.9 (89 reviews)</span>
                                                        </div>
                                                        <span className="text-lg font-bold text-accent">
                                                            {formatPrice(premiumClass.price)}
                                                        </span>
                                                    </div>
                                                </CardContent>

                                                <CardFooter>
                                                    <Button asChild className="w-full" variant={buttonVariant}>
                                                        <Link to={buttonLink}>{buttonText}</Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    No classes found for this category.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-16 px-4 bg-gradient-hero">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                        Ready to Transform Your Learning?
                    </h2>
                    <p className="text-lg text-primary-foreground/90 mb-8">
                        Join thousands of students who have accelerated their journey with our premium classes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                            <Link to="/register">Start Free Trial</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                        >
                            View All Classes
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PremiumClasses;