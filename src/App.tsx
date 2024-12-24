import React, { useState } from "react";
import WorkflowList from "./pages/WorkflowList";
import DeadlinePopUp from "./components/Schedule/DeadlinePopUp";
import NotificationPopUp from "./components/Schedule/NotificationPopUp";
import Filters from "./components/Timetable/Filters.tsx";
import ScheduleView from "./components/Schedule/ScheduleView";
import Footer from "./components/HomePage/footer.tsx";
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from "react-router-dom";
import Navbar from "../src/components/HomePage/navbar.tsx";
import Schedule from "./pages/Schedule.tsx";
import Timetable from "../src/pages/TimeTable.tsx";
import Login from "./components/Login_Register/login";
import Register from "./components/Login_Register/register";

// Layout component that includes Header and Footer
const DefaultLayout = ({ onSignIn, onRegister, isLogin }: any) => {
    return (
        <>
            <Navbar onSignIn={onSignIn} onRegister={onRegister} isLogin={isLogin} />
            <Outlet />
            <Footer />
        </>
    );
};

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-4">The page you're looking for doesn't exist.</p>
            <a href="/" className="text-blue-500 hover:text-blue-700">
                Go back to home
            </a>
        </div>
    );
};

const App: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/admin/WorkflowList" element={<WorkflowList />} />

                <Route
                    element={
                        <DefaultLayout
                            onSignIn={() => setIsLoginOpen(true)}
                            onRegister={() => setIsRegisterOpen(true)}
                        />
                    }
                >
                    <Route path="/" element={<Navigate to="/schedule" replace />} />
                    <Route path="/deadlinePopUp" element={<DeadlinePopUp />} />
                    <Route path="/notificationPopUp" element={<NotificationPopUp />} />
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLoginSuccess={() => setIsLoginOpen(false)}
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <Register
                                onRegisterSuccess={() => setIsRegisterOpen(false)}
                            />
                        }
                    />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/scheduleView" element={<ScheduleView />} />
                    <Route path="/filters" element={<Filters />} />
                    <Route path="/timeTable" element={<Timetable />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>

            {/* Global Modals for Login and Register */}
            {isLoginOpen && (
                <Login
                    onLoginSuccess={() => setIsLoginOpen(false)}
                />
            )}
            {isRegisterOpen && (
                <Register
                    onRegisterSuccess={() => setIsRegisterOpen(false)}
                />
            )}
        </Router>
    );
}

export default App;
