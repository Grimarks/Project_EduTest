import { useState } from "react";
import { mockPremiumClasses, categories } from "../data/mockData";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Clock, User, Star, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumClasses = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredClasses =
        selectedCategory === "All"
            ? mockPremiumClasses
            : mockPremiumClasses.filter((cls) => cls.category === selectedCategory);

    const formatPrice = (price) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <div className="min-h-screen bg-gradient-page">
            {/* Hero Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Premium <span className="text-primary">Classes</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Unlock your potential with expert-led courses designed to help you
                        excel in your studies and beyond.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="px-4 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <h2 className="text-2xl font-semibold text-foreground">
                            Available Classes ({filteredClasses.length})
                        </h2>
                        <div className="flex gap-4">
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
                </div>
            </section>

            {/* Classes Grid */}
            <section className="px-4 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClasses.map((premiumClass, index) => (
                            <Card
                                key={premiumClass.id}
                                className="group hover:shadow-hover transition-smooth animate-slide-up bg-gradient-card border-border/50"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardHeader className="space-y-3">
                                    <div className="aspect-video rounded-lg bg-gradient-hero flex items-center justify-center overflow-hidden">
                                        <BookOpen className="h-12 w-12 text-primary-foreground" />
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
                                        {premiumClass.description}
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
                                            <span>{premiumClass.duration}</span>
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
                                            {premiumClass.features.length > 3 && (
                                                <li className="text-xs text-muted-foreground ml-5">
                                                    +{premiumClass.features.length - 3} more features
                                                </li>
                                            )}
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
                                    <Button asChild className="w-full">
                                        <Link to="/login">Enroll Now</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-hero">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                        Ready to Transform Your Learning?
                    </h2>
                    <p className="text-lg text-primary-foreground/90 mb-8">
                        Join thousands of students who have already accelerated their
                        academic journey with our premium classes.
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
