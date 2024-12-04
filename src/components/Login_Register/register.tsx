import React, { useState, FormEvent, useRef } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Api } from "../../utils/api.ts";
import { useNavigate } from "react-router-dom";

interface FocusedInput {
    email: boolean;
    name: boolean;
    password: boolean;
    student_id: boolean;
}

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [student_id, setStudent_id] = useState<string>('');

    const [loading, setLoading] = useState(false);

    const [focusedInput, setFocusedInput] = useState<FocusedInput>({
        email: false,
        name: false,
        password: false,
        student_id: false,
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [registerMessage, setRegisterMessage] = useState<string>('');
    const navigate = useNavigate();

    const api = new Api();

    const nameInputRef = useRef<HTMLInputElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const studentIdInputRef = useRef<HTMLInputElement>(null);

    const focusInput = (inputRef: React.RefObject<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleFocus = (input: keyof FocusedInput) => {
        setFocusedInput((prevState) => ({ ...prevState, [input]: true }));
    };

    const handleBlur = (input: keyof FocusedInput, value: string) => {
        if (!value) {
            setFocusedInput((prevState) => ({ ...prevState, [input]: false }));
        }
    };

    const validateForm = () => {
        if (!name || !email || !password || !student_id) {
            setRegisterMessage("All fields are required.");
            return false;
        }
        return true;
    };

    const onSubmitHandler = async (event: FormEvent) => {
        event.preventDefault();
        setRegisterMessage(''); // Clear any previous messages

        if (!validateForm()) {
            return;
        }

        setLoading(true); // Start loading

        const registerRequest = {
            name,
            email,
            password,
            student_id,
        };

        console.log(registerRequest);
        try {
            const response = await api.register(registerRequest);
            console.log(response);
            setRegisterMessage("Registration successful!");
            setTimeout(() => {
                setLoading(false);
                navigate("/login");
            }, 3000);
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            setRegisterMessage(error.response?.data?.message || "Registration failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-9 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
                <form onSubmit={onSubmitHandler}>
                    {/* Name */}
                    <div
                        className="relative mb-8 flex items-center cursor-text"
                        onClick={() => focusInput(nameInputRef)}
                    >
                        <FaUser className="absolute left-3 text-gray-500" />
                        <label
                            className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                                focusedInput.name || name
                                    ? 'text-[3.5] -top-5 text-blue-500'
                                    : 'text-base top-3'
                            }`}
                        >
                            Full Name
                        </label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => handleFocus('name')}
                            onBlur={() => handleBlur('name', name)}
                            className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                        />
                    </div>

                    {/* Email */}
                    <div
                        className="relative mb-8 flex items-center cursor-text"
                        onClick={() => focusInput(usernameInputRef)}
                    >
                        <FaUser className="absolute left-3 text-gray-500" />
                        <label
                            className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                                focusedInput.email || email
                                    ? 'text-[3.5] -top-5 text-blue-500'
                                    : 'text-base top-3'
                            }`}
                        >
                            Email
                        </label>
                        <input
                            ref={usernameInputRef}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email', email)}
                            className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                        />
                    </div>

                    {/* Password */}
                    <div
                        className="relative mb-8 flex items-center cursor-text"
                        onClick={() => focusInput(passwordInputRef)}
                    >
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
                            ref={passwordInputRef}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    {/* Student ID */}
                    <div
                        className="relative mb-8 flex items-center cursor-text"
                        onClick={() => focusInput(studentIdInputRef)}
                    >
                        <FaUser className="absolute left-3 text-gray-500" />
                        <label
                            className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                                focusedInput.student_id || student_id
                                    ? 'text-[3.5] -top-5 text-blue-500'
                                    : 'text-base top-3'
                            }`}
                        >
                            Student ID
                        </label>
                        <input
                            ref={studentIdInputRef}
                            type="text"
                            value={student_id}
                            onChange={(e) => setStudent_id(e.target.value)}
                            onFocus={() => handleFocus('student_id')}
                            onBlur={() => handleBlur('student_id', student_id)}
                            className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col mt-8 justify-between items-center gap-y-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-blue-500 hover:underline"
                        >
                            Have an account? Sign in
                        </button>
                    </div>

                    {/* Registration Message */}
                    {registerMessage && (
                        <div className="mt-4 text-center">
                            <p
                                className={`text-lg font-semibold ${
                                    registerMessage === "Registration successful!"
                                        ? "text-green-500"
                                        : "text-red-700"
                                }`}
                            >
                                {registerMessage}
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Register;

