import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import viteLogo from '../../assets/logo.png';
import { Api } from "../../utils/api"; // Adjust the import path according to your project structure
import { FiLogOut } from "react-icons/fi"; // Import logout icon

interface NavbarProps {
    onSignIn: (onLoginSuccess: (user: { name: string }) => void) => void;
    onRegister: (onRegisterSuccess: (user: { name: string }) => void) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignIn, onRegister }) => {
    const [user, setUser] = useState<{ name: string } | null>(null); // State to store user info
    const [visible, setVisible] = useState(false); // State to manage sidebar visibility

    const api = new Api(); // Create an instance of the Api class

    const fetchUser = async () => {
        const userId = localStorage.getItem("user_id"); // Ensure the ID is stored as a string
        if (userId) {
            try {
                const userData = await api.findUserById(Number(userId)); // Convert to number
                setUser(userData); // Set user state with fetched data
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null); // Reset user state on failure
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []); // Fetch user once when Navbar is mounted

    const handleLogout = () => {
        localStorage.removeItem("user_id"); // Clear user ID from localStorage
        setUser(null); // Reset user state
    };

    const handleLoginSuccess = (userData: { name: string }) => {
        setUser(userData); // Update user state after login
    };

    const handleRegisterSuccess = (userData: { name: string }) => {
        setUser(userData); // Update user state after registration
    };

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
                        <img src={viteLogo} alt="Vite Logo" style={{ height: '50px' }} />
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

                    {/* User Info or Register/Sign In Buttons */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            // Display user's name and logout icon if logged in
                            <div className="flex items-center gap-4">
                                <p className="font-bold text-gray-700">{user.name}</p>
                                <FiLogOut
                                    onClick={handleLogout}
                                    className="text-red-500 text-2xl cursor-pointer transition transform hover:scale-110"
                                    title="Logout" // Tooltip for better accessibility
                                />
                            </div>
                        ) : (
                            // Show Register and Sign In buttons if not logged in
                            <>
                                <button
                                    onClick={() => onRegister(handleRegisterSuccess)}
                                    className="hidden sm:block px-8 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700"
                                >
                                    Register
                                </button>
                                <button
                                    onClick={() => onSignIn(handleLoginSuccess)}
                                    className="hidden sm:block px-8 py-2 rounded-full text-white text-center cursor-pointer transition transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-800"
                                >
                                    Sign In
                                </button>
                            </>
                        )}

                        {/* Hamburger Menu Icon for Mobile */}
                        <img
                            onClick={() => setVisible(true)}
                            src={viteLogo}
                            className="w-6 cursor-pointer sm:hidden"
                            alt="Menu"
                        />
                    </div>
                </div>

                {/* Sidebar Menu for Mobile */}
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
                            <img className="h-4 rotate-180" src={viteLogo} alt="Back" />
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
                        {!user && (
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
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Navbar;
