import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo dan deskripsi */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-hero p-2 rounded-lg shadow-glow">
                                <BookOpen className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">EduTest+</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            The ultimate platform for online test simulation and premium educational classes.
                            Excel in your exams with our comprehensive practice tests.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Quick Links</h3>
                        <div className="space-y-2">
                            <Link to="/tests" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                Browse Tests
                            </Link>
                            <Link to="/premium" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                Premium Classes
                            </Link>
                            <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                Dashboard
                            </Link>
                            <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                About Us
                            </Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Support</h3>
                        <div className="space-y-2">
                            <Link to="/help" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                Help Center
                            </Link>
                            <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                Contact Us
                            </Link>
                            <Link to="/faq" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                FAQ
                            </Link>
                            <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Contact</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>support@edutest.com</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Jakarta, Indonesia</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        © 2024 EduTest+. All rights reserved. Built with <span className="text-pink-300">LOVE</span>️ for better education.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;