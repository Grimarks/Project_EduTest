import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Search, Filter } from "lucide-react";
import TestCard from "../components/TestCard";
import { mockTests, categories, difficulties } from "../data/mockData";

const TestList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);

    const filteredTests = mockTests.filter((test) => {
        const matchesSearch =
            test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || test.category === selectedCategory;
        const matchesDifficulty =
            selectedDifficulty === "All" || test.difficulty === selectedDifficulty;
        const matchesPremium = !showPremiumOnly || test.isPremium;

        return (
            matchesSearch && matchesCategory && matchesDifficulty && matchesPremium
        );
    });

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setSelectedDifficulty("All");
        setShowPremiumOnly(false);
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="space-y-4 mb-8">
                    <h1 className="text-4xl font-bold text-foreground">Practice Tests</h1>
                    <p className="text-xl text-muted-foreground">
                        Choose from our comprehensive collection of practice tests
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-card rounded-lg border border-border p-6 shadow-card mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select
                            value={selectedCategory}
                            onValueChange={(val) => setSelectedCategory(val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Difficulty Filter */}
                        <Select
                            value={selectedDifficulty}
                            onValueChange={(val) => setSelectedDifficulty(val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                {difficulties.map((difficulty) => (
                                    <SelectItem key={difficulty} value={difficulty}>
                                        {difficulty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant={showPremiumOnly ? "default" : "outline"}
                                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                                className="flex-1"
                            >
                                Premium
                            </Button>
                            <Button variant="ghost" onClick={resetFilters}>
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {searchTerm && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Search: {searchTerm}
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {selectedCategory !== "All" && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Category: {selectedCategory}
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {selectedDifficulty !== "All" && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Difficulty: {selectedDifficulty}
                                <button
                                    onClick={() => setSelectedDifficulty("All")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {showPremiumOnly && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Premium Only
                                <button
                                    onClick={() => setShowPremiumOnly(false)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">
                            Showing {filteredTests.length} of {mockTests.length} tests
                        </p>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                Sort by relevance
              </span>
                        </div>
                    </div>

                    {/* Test Grid */}
                    {filteredTests.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTests.map((test) => (
                                <TestCard key={test.id} test={test} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="space-y-4">
                                <div className="text-6xl">🔍</div>
                                <h3 className="text-2xl font-semibold text-foreground">
                                    No tests found
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Try adjusting your search criteria or browse our popular tests.
                                </p>
                                <Button onClick={resetFilters}>Clear Filters</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Load More (if needed) */}
                {filteredTests.length > 0 && filteredTests.length >= 9 && (
                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg">
                            Load More Tests
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestList;
