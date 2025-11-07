import { AuthProvider } from "./context/UseAuth.jsx";
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
import PremiumClassDetail from "./pages/PremiumClassDetail.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminManageTests from "./pages/admin/AdminManageTests.jsx";
import AdminManageClasses from "./pages/admin/AdminManageClasses.jsx";
import AdminClassForm from "./pages/admin/AdminClassForm.jsx";
import AdminManageQuestions from "./pages/admin/AdminManageQuestions.jsx";
import AdminManageUsers from "./pages/admin/AdminManageUsers.jsx";
import AdminManageOrders from "./pages/admin/AdminManageOrders.jsx";
import AdminTestForm from "./pages/admin/AdminTestForm.jsx";
import AdminQuestionForm from "./pages/admin/AdminQuestionForm.jsx";
import { Toaster } from "./components/ui/sonner.jsx";

const queryClient = new QueryClient();

const App = () => {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
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
                                    <Route path="/premium/class/:classId" element={<PremiumClassDetail />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/account" element={<Account/>}/>
                                    <Route path="/my-orders" element={<MyOrders />} />
                                    <Route path="/order/:itemType/:itemId" element={<OrderPage />} />

                                    <Route element={<AdminRoute />}>
                                        <Route path="/admin" element={<AdminLayout />}>
                                            <Route path="dashboard" element={<AdminDashboard />} />
                                            <Route path="tests" element={<AdminManageTests />} />
                                            <Route path="tests/new" element={<AdminTestForm />} />
                                            <Route path="tests/edit/:testId" element={<AdminTestForm />} />
                                            <Route path="questions/:testId" element={<AdminManageQuestions />} />
                                            <Route path="questions/:testId/new" element={<AdminQuestionForm />} />
                                            <Route path="questions/:testId/edit/:questionId" element={<AdminQuestionForm />} />
                                            <Route path="classes" element={<AdminManageClasses />} />
                                            <Route path="classes/new" element={<AdminClassForm />} />
                                            <Route path="classes/edit/:classId" element={<AdminClassForm />} />
                                            <Route path="users" element={<AdminManageUsers />} />
                                            <Route path="orders" element={<AdminManageOrders />} />
                                        </Route>
                                    </Route>

                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </main>
                            <Footer />
                            <Toaster></Toaster>
                        </div>
                    </BrowserRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </AuthProvider>

    );
};

export default App;
