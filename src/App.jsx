import { Routes, Route } from "react-router-dom";
import DeadlinePopUp from "./components/Schedule/DeadlinePopUp.jsx";
import Login from "./components/Login_Register/login.jsx"
import Register from "./components/Login_Register/register.jsx";
import Filters from './components/Timetable/Filters.jsx'; // Adjust the path if necessary
import Header from "./components/Header_Footer/header.jsx";
import Footer from "./components/Header_Footer/footer.jsx";
import WorkflowList from "@/pages/WorkflowList.js";
// import Filters from "./components/Timetable/Filters.jsx"


const App = () => {
    return (
        <div>
            <Header />
            {/*          <div className="bg-[#E6EDF5] absolute -z-10 top-[-6rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem]"></div>
            <div className="bg-[#6285c25b] absolute -z-10 top-[-1rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            */}
            <div className="bg-[#ffff] absolute -z-10 top-[-6rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem]"></div>
            <div className="bg-[#ffff] absolute -z-10 top-[-1rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <div>
                    <Filters />
                </div>
                <Routes>

                    <Route path="/" element={<DeadlinePopUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/admin/WorkflowList"
                        element={<WorkflowList />}
                    />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};
export default App;
