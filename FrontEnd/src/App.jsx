import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const App = () => (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
);

export default App;
