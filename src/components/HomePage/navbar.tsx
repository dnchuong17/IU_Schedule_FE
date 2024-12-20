import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
    const [visible, setVisible] = useState(false);

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-50 top-0 w-full"
        >
            <div className="flex items-center justify-between py-5 font-medium">
                <div className="container mx-auto flex items-center justify-between gap-2 border w-full px-6 py-2 rounded-full shadow-lg">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <img className="w-10 h-10" src="../../assets/logo.png" alt="IU Scheduler" />
                        <p className="text-xl tracking-wide font-poppins font-bold">
                            IU Scheduler
                        </p>
                    </div>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden sm:flex gap-5 text-base text-gray-700">
                        <NavLink to="/" className="flex flex-col items-center gap-2 font-bold">
                            <p>HOME</p>
                            <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
                        </NavLink>

                        <NavLink to="/about" className="flex flex-col items-center gap-2 font-bold">
                            <p>HOW TO USE</p>
                            <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
                        </NavLink>


                    </ul>

                    {/* Register and Sign In Buttons */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/register"
                            className="hidden sm:block px-8 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700"
                        >
                            Register
                        </Link>
                        <Link
                            to="/login"
                            className="hidden sm:block px-8 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-800"
                        >
                            Sign In
                        </Link>

                        {/* Hamburger Menu Icon for Mobile */}
                        <img
                            onClick={() => setVisible(true)}
                            src="../../assets/logo.png"
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
                            <img className="h-4 rotate-180" src="#" alt="Back" />
                            <p>Back</p>
                        </div>

                        {/* Mobile Navigation Links */}
                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-4 px-6 border-b text-lg font-medium"
                            to="/"
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-4 px-6 border-b text-lg font-medium"
                            to="/use"
                        >
                            HOW TO USE
                        </NavLink>

                        {/* Register and Sign In Buttons for Mobile */}
                        <div className="mt-auto p-6">
                            <Link
                                to="/register"
                                onClick={() => setVisible(false)}
                                className="block w-full mb-4 px-4 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700"
                            >
                                Register
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setVisible(false)}
                                className="block w-full px-4 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-800"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Navbar;
