import React, { useState, ChangeEvent, FormEvent } from "react";
import { Api } from "../../utils/api";
import { FaUser, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoClose } from "react-icons/io5"; // Import close icon
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginProps {
  onLoginSuccess?: () => void; // Callback function from parent
}

const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [focusedInput, setFocusedInput] = useState<{
    username: boolean;
    password: boolean;
  }>({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Control modal visibility

  const api = new Api();
  const navigate = useNavigate(); // To handle navigation

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const loginRequest = { email: username, password: password };

    try {
      const response = await api.login(loginRequest);

      if (response && response.user_id) {
        localStorage.setItem("user_id", response.user_id);
        localStorage.setItem("student_id", response.studentId);
        toast.success("Login successful!");

        setTimeout(() => {
          setIsModalOpen(false); // Close the modal
          navigate("/schedule"); // Navigate to /schedule
        }, 2000); // Close modal after 2 seconds
      } else {
        toast.error("Account does not exist.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleInputChange =
      (setter: React.Dispatch<React.SetStateAction<string>>) =>
          (event: ChangeEvent<HTMLInputElement>) =>
              setter(event.target.value);

  const handleFocus = (input: "username" | "password") =>
      setFocusedInput((prev) => ({ ...prev, [input]: true }));

  const handleBlur = (input: "username" | "password", value: string) => {
    if (!value) setFocusedInput((prev) => ({ ...prev, [input]: false }));
  };

  if (!isModalOpen) return null; // Do not render the modal if it's closed

  return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-9 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)} // Close the modal
            >
              <IoClose size={24} />
            </button>

            <h1 className="text-2xl font-semibold mb-6 text-center">Sign in</h1>
            <form onSubmit={onSubmitHandler}>
              {/* Username */}
              <div
                  className="relative mb-8"
                  onClick={() =>
                      document.getElementById("username-input")?.focus()
                  }
              >
                <FaUser className="absolute left-3 text-gray-500 mt-3" />
                <label
                    className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                        focusedInput.username || username
                            ? "text-sm -top-5 text-blue-500"
                            : "text-base top-3"
                    }`}
                >
                  Username
                </label>
                <input
                    id="username-input"
                    type="text"
                    value={username}
                    onChange={handleInputChange(setUsername)}
                    onFocus={() => handleFocus("username")}
                    onBlur={() => handleBlur("username", username)}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                />
              </div>

              {/* Password */}
              <div
                  className="relative mb-6"
                  onClick={() =>
                      document.getElementById("password-input")?.focus()
                  }
              >
                <FaLock className="absolute left-3 text-gray-500 mt-3" />
                <label
                    className={`absolute left-10 transition-all duration-200 ease-in-out text-gray-500 ${
                        focusedInput.password || password
                            ? "text-sm -top-5 text-blue-500"
                            : "text-base top-3"
                    }`}
                >
                  Password
                </label>
                <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password", password)}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 mt-1"
                />
                <div
                    className="absolute right-3 inset-y-0 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col mt-8 justify-between items-center gap-y-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                  Sign In
                </button>

                {/* Register link */}
                <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={() => navigate("/register")} // Navigate to register page
                >
                  Do not have an account? Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
  );
};

export default Login;
