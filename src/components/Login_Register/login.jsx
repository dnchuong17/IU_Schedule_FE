import React, { useState } from 'react';
import { Api } from "../../utils/api";
import { LoginRequest } from "../../utils/request/loginRequest"; // Import lớp LoginRequest
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState({ username: false, password: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loginMessage, setLoginMessage] = useState(''); // Thêm state cho thông báo
    const navigate = useNavigate(); // Sử dụng hook useNavigate

    const api = new Api();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        console.log(username, password);
        setIsOpen(false);

        const loginRequest = new LoginRequest();
        loginRequest.username = username;
        loginRequest.password = password;

        try {
            const response = await api.login(loginRequest);

            if (response) {
                setLoginMessage("Login successful!");
                navigate("/"); // Điều hướng tới trang home
            } else {
                setLoginMessage("Account does not exist.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setLoginMessage("Login failed. Please check your credentials and try again.");
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFocus = (input) => {
        setFocusedInput({ ...focusedInput, [input]: true });
    };

    const handleBlur = (input, value) => {
        if (!value) {
            setFocusedInput({ ...focusedInput, [input]: false });
        }
    };

    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-9 rounded-lg shadow-lg w-96">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Sign in</h1>
                    <form onSubmit={onSubmitHandler}>
                        {/* Username */}
                        <div className="relative mb-8">
                            <div className="flex items-center">
                                <FaUser className="absolute left-3 text-gray-500" />
                                <label
                                    className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                                        focusedInput.username || username
                                            ? 'text-[3.5] -top-5 text-blue-500'
                                            : 'text-base top-3'
                                    }`}
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    onFocus={() => handleFocus('username')}
                                    onBlur={() => handleBlur('username', username)}
                                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="relative mb-6">
                            <div className="flex items-center">
                                <FaLock className="absolute left-3 text-gray-500" />
                                <label
                                    className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                                        focusedInput.password || password
                                            ? 'text-[3.5] -top-5 text-blue-500'
                                            : 'text-base top-3'
                                    }`}
                                >
                                    Password
                                </label>
                                <input
                                    onChange={handlePasswordChange}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={() => handleBlur('password', password)}
                                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                                />
                                <div
                                    className="absolute right-3 inset-y-0 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col mt-8 justify-between items-center gap-y-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-blue-500 hover:underline"
                            >
                                Forgot password?
                            </button>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                            >
                                Sign In
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-blue-500 hover:underline"
                            >
                                Do not have an account!
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
