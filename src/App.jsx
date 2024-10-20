import { Routes, Route } from "react-router-dom";
import DeadlinePopUp from "./components/Schedule/DeadlinePopUp.jsx";
import Login from "./components/Login_Register/login.jsx"
import Register from "./components/Login_Register/register.jsx";
// import Filters from "./components/Timetable/Filters.jsx"


const App = () => {
    return (
        <div>
            <div className="bg-[#E6EDF5] absolute -z-10 top-[-6rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem]"></div>
            <div className="bg-[#6285c25b] absolute -z-10 top-[-1rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">

                <Routes>
                    <Route path="/" element={<DeadlinePopUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
