import WorkflowList from "./pages/WorkflowList";
import DeadlinePopUp from "./components/Schedule/DeadlinePopUp";
import NotificationPopUp from "./components/Schedule/NotificationPopUp";
import Login from "./components/Login_Register/login.tsx";
import Register from "./components/Login_Register/register.tsx";
import Filters from "./components/Timetable/Filters.tsx";
import ScheduleView from "./components/Schedule/ScheduleView";
import Footer from "./components/HomePage/footer.tsx";
// import Header from "./components/HomePage/header.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import Navbar from "../src/components/HomePage/navbar.tsx"
import Schedule from "./pages/Schedule.tsx";
import Timetable from "../src/pages/TimeTable.tsx";

// Layout component that includes Header and Footer
const DefaultLayout = () => {
    return (
        <>
            <Navbar />
            {/*<Header />*/}
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


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/WorkflowList" element={<WorkflowList />} />


                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<Navigate to="/scheduleView" replace />} />

                    <Route path="/deadlinePopUp" element={<DeadlinePopUp />} />
                    <Route path="/notificationPopUp" element={<NotificationPopUp />} />

                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/scheduleView" element={<ScheduleView />} />
                    <Route path="/filters" element={<Filters />} />
                    <Route
                        path="/register"
                        element={<Register />}
                    />
                    <Route
                        path="/scheduleView"
                        element={<ScheduleView />}
                    />
                    <Route
                        path="/filters"
                        element={<Filters />}
                    />

                    <Route
                        path="/timeTable"
                        element={<Timetable />}
                    />

                    <Route path="/schedule" element={<Schedule />} />


                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;