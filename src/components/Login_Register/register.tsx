import React, { useState, FormEvent } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface FocusedInput {
    name: boolean;
    username: boolean;
    password: boolean;
    studentId: boolean;
}

const Register: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [studentId, setStudentId] = useState<string>('');
    const [focusedInput, setFocusedInput] = useState<FocusedInput>({
        name: false,
        username: false,
        password: false,
        studentId: false
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleFocus = (input: keyof FocusedInput) => {
        setFocusedInput((prevState) => ({ ...prevState, [input]: true }));
    };

    const handleBlur = (input: keyof FocusedInput, value: string) => {
        if (!value) {
            setFocusedInput((prevState) => ({ ...prevState, [input]: false }));
        }
    };

    const onSubmitHandler = (event: FormEvent) => {
        event.preventDefault();
        console.log('Registered Successfully:', { name, username, password, studentId });
    };

    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-9 rounded-lg shadow-lg w-96">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
                    <form onSubmit={onSubmitHandler}>

                        {/* Name */}
                        <div className="relative mb-8">
                            <div className="flex items-center">
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
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => handleFocus('name')}
                                    onBlur={() => handleBlur('name', name)}
                                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                                />
                            </div>
                        </div>

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
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
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

                        {/* Student ID */}
                        <div className="relative mb-8">
                            <div className="flex items-center">
                                <FaUser className="absolute left-3 text-gray-500" />
                                <label
                                    className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                                        focusedInput.studentId || studentId
                                            ? 'text-[3.5] -top-5 text-blue-500'
                                            : 'text-base top-3'
                                    }`}
                                >
                                    Student ID
                                </label>
                                <input
                                    type="text"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    onFocus={() => handleFocus('studentId')}
                                    onBlur={() => handleBlur('studentId', studentId)}
                                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col mt-8 justify-between items-center gap-y-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                            >
                                Register
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPassword(false)}
                                className="text-blue-500 hover:underline"
                            >
                                Already have an account? Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
