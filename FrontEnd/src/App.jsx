import { Toaster } from "./components/ui/toaster.jsx";
import { Toaster as Sonner } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home";
import TestList from "./pages/TestList";
import TakeTest from "./pages/TakeTest";
import TestResult from "./pages/TestResult";
import Dashboard from "./pages/Dashboard";
import PremiumClasses from "./pages/PremiumClasses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/tests" element={<TestList />} />
                                <Route path="/test/:testId" element={<TakeTest />} />
                                <Route path="/result" element={<TestResult />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/premium" element={<PremiumClasses />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                {/* Catch-all 404 */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
