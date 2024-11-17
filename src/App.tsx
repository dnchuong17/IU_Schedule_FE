import WorkflowList from "./pages/WorkflowList"

import DeadlinePopUp from "./components/Schedule/DeadlinePopUp"
import NotePopUp from "./components/Schedule/NotePopUp"
import NotificationPopUp from "./components/Schedule/NotificationPopUp"

import Login from "./components/Login_Register/login.tsx"
import Register from "./components/Login_Register/register.tsx"

import Filters from "./components/Timetable/Filters.tsx"

import ScheduleView from "./components/Schedule/ScheduleView"
import Footer from "./components/Header_Footer/footer.tsx"
import Header from "./components/Header_Footer/header.tsx"

import { BrowserRouter as Router, useRoutes } from "react-router-dom"

function App() {
  const AppRoutes = () =>
    useRoutes([
      { path: "/admin/WorkflowList", element: <WorkflowList /> },
      { path: "/deadlinePopUp", element: <DeadlinePopUp /> },
      { path: "/notePopUp", element: <NotePopUp /> },
      { path: "/notificationPopUp", element: <NotificationPopUp /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/scheduleView", element: <ScheduleView /> },
      { path: "/filters", element: <Filters /> },
    ])

  return (
    <div>
      <Router>
        <AppRoutes />
        {window.location.pathname !== "/admin/WorkflowList" && <Header />}
        {window.location.pathname !== "/admin/WorkflowList" && <Footer />}
      </Router>
    </div>
  )
}
export default App
