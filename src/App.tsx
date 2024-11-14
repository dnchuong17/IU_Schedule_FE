import WorkflowList from "./pages/WorkflowList"

import DeadlinePopUp from "./components/Schedule/DeadlinePopUp"
import NotePopUp from "./components/Schedule/NotePopUp"
import NotificationPopUp from "./components/Schedule/NotificationPopUp"

import Login from "./components/Login_Register/login.tsx"
import Register from "./components/Login_Register/register.tsx"

// import Filters from '../src/components/Timetable/Filters.tsx';
// import Footer from "./components/Header_Footer/footer.tsx";

import { BrowserRouter as Router } from "react-router-dom"
import { Route, Routes } from "react-router-dom"

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route
                        path="/admin/WorkflowList"
                        element={<WorkflowList/>}
                    />
                    <Route
                        path="/deadlinePopUp"
                        element={<DeadlinePopUp/>}
                    />
                    <Route
                        path="/notePopUp"
                        element={<NotePopUp/>}
                    />
                    <Route
                        path="/notificationPopUp"
                        element={<NotificationPopUp/>}
                    />
                    <Route
                        path="/login"
                        element={<Login/>}
                    />
                    <Route
                        path="/register"
                        element={<Register/>}
                    />
                </Routes>
            </Router>
        </div>
    )
}

export default App