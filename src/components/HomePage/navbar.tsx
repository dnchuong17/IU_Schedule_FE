import { NavLink } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import viteLogo from "../../assets/logo.png";

interface NavbarProps {
    onSignIn: () => void;
    onRegister: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignIn, onRegister }) => {
    const [visible, setVisible] = useState(false); // For mobile menu visibility

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-50 top-0 w-full"
        >
            <div className="flex items-center justify-between py-5 font-medium">
                <div className="container mx-auto flex items-center justify-between gap-4 border w-full px-8 py-4 rounded-lg shadow-lg">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <img src={viteLogo} alt="Vite Logo" style={{ height: "50px" }} />
                        <p className="text-xl tracking-wide font-poppins font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                            IU Scheduler
                        </p>
                    </div>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden sm:flex gap-5 text-base text-gray-700">
                        <NavLink to="/schedule" className="font-bold group">
                            <p className="group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                Home
                            </p>
                        </NavLink>
                        <NavLink to="/scheduleView" className="font-bold group">
                            <p className="group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                Main Schedule
                            </p>
                        </NavLink>
                        <NavLink to="/timeTable" className="font-bold group">
                            <p className="group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                Sub Schedules
                            </p>
                        </NavLink>
                    </ul>

                    {/* Register and Sign In Buttons */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onRegister}
                            className="hidden sm:block px-8 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700"
                        >
                            Register
                        </button>
                        <button
                            onClick={onSignIn}
                            className="hidden sm:block px-8 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-800"
                        >
                            Sign In
                        </button>

                        {/* Hamburger Menu Icon for Mobile */}
                        <img
                            onClick={() => setVisible(true)}
                            src={viteLogo}
                            className="w-6 cursor-pointer sm:hidden"
                            alt="Menu"
                        />
                    </div>
                </div>

                {/* Sidebar menu for mobile */}
                <div
                    className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 ${
                        visible ? "translate-x-0" : "translate-x-full"
                    } w-3/4 sm:hidden`}
                >
                    <div className="flex flex-col text-gray-600 h-full">
                        {/* Back Button */}
                        <div
                            onClick={() => setVisible(false)}
                            className="flex items-center gap-4 p-4 cursor-pointer border-b"
                        >
                            <img
                                className="h-4 rotate-180"
                                src={viteLogo}
                                alt="Back"
                            />
                            <p>Back</p>
                        </div>

                        {/* Mobile Navigation Links */}
                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-4 px-6 border-b text-lg font-medium"
                            to="/schedule"
                        >
                            Home
                        </NavLink>
                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-4 px-6 border-b text-lg font-medium"
                            to="/scheduleView"
                        >
                            Main Schedule
                        </NavLink>
                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-4 px-6 border-b text-lg font-medium"
                            to="/timeTable"
                        >
                            Sub Schedules
                        </NavLink>

                        {/* Register and Sign In Buttons for Mobile */}
                        <div className="mt-auto p-6">
                            <button
                                onClick={() => {
                                    setVisible(false);
                                    onRegister();
                                }}
                                className="block w-full mb-4 px-4 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700"
                            >
                                Register
                            </button>
                            <button
                                onClick={() => {
                                    setVisible(false);
                                    onSignIn();
                                }}
                                className="block w-full px-4 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-800"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Navbar;
