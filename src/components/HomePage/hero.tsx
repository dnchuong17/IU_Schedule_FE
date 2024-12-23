import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.75,
                delay: 0.75,
                ease: [0, 0.71, 0.2, 1.01],
            }}
            className="flex items-center justify-center min-h-screen"
        >
            <div className="text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="../../assets/logo.png"
                        alt="Logo"
                        className="w-[120px] h-[120px] sm:w-[170px] sm:h-[170px] max-w-sm rounded-xl"
                    />
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4 font-poppins leading-tight text-center">
                    <div>WELCOME TO</div>
                    <div className="text-blue-600">IU SCHEDULER</div>
                </h1>


                {/* Subtitle */}
                <p className="text-gray-600 text-lg sm:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto">
                    Lorem
                </p>

                {/* Get Started Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 text-white text-lg sm:text-xl py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-400 transition transform hover:-translate-y-1 duration-300 animate-pulse"
                    >
                        <IoIosArrowForward className="mr-2 text-xl sm:text-2xl" />
                        GET STARTED
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Hero;
