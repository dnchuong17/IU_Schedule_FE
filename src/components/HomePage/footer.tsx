import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaInstagram,
} from "react-icons/fa";

const Footer = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Main Content */}
            <div className="flex-grow">
                {/* Add your main page content here */}
            </div>
            {/* Footer Section */}
            <footer className="bg-white">
                <div className="container mx-auto px-8 md:px-16 lg:px-24 my-16 py-20">
                    <div className="flex flex-col mb-12 text-sm lg:flex-row lg:justify-between lg:items-start lg:text-left text-center gap-8">
                        {/* Logo and Description */}
                        <div className="flex flex-col items-center lg:items-start mb-10 lg:mb-0 lg:w-1/3">
                            <img
                                src="#"
                                className="mb-5 w-32"
                                alt="IU Health Care Logo"
                            />
                            <p className="w-full md:w-2/3 text-gray-600">
                                ..................
                            </p>
                        </div>

                        {/* Links Section */}
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between lg:w-2/3">
                            <div className="flex-1">
                                <p className="text-xl font-semibold mb-4">
                                    Learn more
                                </p>
                                <ul className="flex flex-col gap-2 text-gray-600">
                                    <li className="hover:text-blue-600 cursor-pointer">
                                        About IU Sceduler
                                    </li>
                                    <li className="hover:text-blue-600 cursor-pointer">
                                        Contact us
                                    </li>
                                    <li className="hover:text-blue-600 cursor-pointer">
                                        Privacy Policy
                                    </li>
                                    <li className="hover:text-blue-600 cursor-pointer">
                                        Terms of Service
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Section */}
                            <div className="flex-1">
                                <p className="text-xl font-semibold mb-4">
                                    Contact
                                </p>
                                <ul className="flex flex-col gap-2 text-gray-600">
                                    <li>123 Health St.</li>
                                    <li>Quarter 6, Linh Trung Ward, Thu Duc City</li>
                                    <li>Phone: (123) 456-7890</li>
                                    <li>Email: support@iuscheduler.hcmiu.edu.vn</li>
                                </ul>
                            </div>

                            {/* Social Media Section */}
                            <div className="flex-1">
                                <p className="text-xl font-semibold mb-4">
                                    Follow Us
                                </p>
                                <ul className="flex justify-center lg:justify-start gap-4">
                                    <li>
                                        <div className="p-2 rounded-full bg-gray-200 hover:bg-blue-300 transition-all">
                                            <a
                                                href="#"
                                                aria-label="Facebook"
                                                className="text-blue-600 hover:text-white transition-colors"
                                            >
                                                <FaFacebookF />
                                            </a>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="p-2 rounded-full bg-gray-200 hover:bg-blue-300 transition-all">
                                            <a
                                                href="#"
                                                aria-label="Twitter"
                                                className="text-blue-400 hover:text-white transition-colors"
                                            >
                                                <FaTwitter />
                                            </a>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="p-2 rounded-full bg-gray-200 hover:bg-blue-300 transition-all">
                                            <a
                                                href="#"
                                                aria-label="LinkedIn"
                                                className="text-blue-700 hover:text-white transition-colors"
                                            >
                                                <FaLinkedinIn />
                                            </a>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="p-2 rounded-full bg-gray-200 hover:bg-pink-300 transition-all">
                                            <a
                                                href="#"
                                                aria-label="Instagram"
                                                className="text-pink-500 hover:text-white transition-colors"
                                            >
                                                <FaInstagram />
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="text-center py-4 text-gray-500">
                        &copy; 2024 IU Scheduler. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
