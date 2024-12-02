import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
// import { Api } from "../../utils/api.ts";
// import { DeadlineRequest } from "../../utils/request/deadlineRequest.ts;

const DeadlinePopUp: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [taskName, setTaskName] = useState("");
    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlineTime, setDeadlineTime] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [deadlines, setDeadlines] = useState<any[]>([]); // Mảng để lưu các deadline
    // const [api] = useState(new Api());

    const handleCreateDeadline = async () => {
        if (!taskName || !deadlineDate || !deadlineTime) {
            alert("Please fill out all fields!");
            return;
        }

        // const deadline = `${deadlineDate}T${deadlineTime}:00Z`; // ISO format for API
        // const deadlineRequest = new DeadlineRequest(
        //     "SUBMISSION",
        //     "HIGH",
        //     taskName,
        //     deadline,
        //     1
        // );
        //
        // setIsLoading(true);

        // try {
        //     const response = await api.createDeadline(deadlineRequest);
        //     alert(response.message);
        //
        //     // Add
        //     setDeadlines((prevDeadlines) => [
        //         ...prevDeadlines,
        //         { description: taskName, deadline: `${deadlineDate} ${deadlineTime}` },
        //     ]);
        //
        //     // Reset
        //     setTaskName("");
        //     setDeadlineDate("");
        //     setDeadlineTime("");
        //
        //     if (onClose) onClose();
        // } catch (error: any) {
        //     console.error("Error creating deadline:", error.response?.data || error.message);
        //     alert("Failed to create deadline. Check console for details.");
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50">
            <div className="h-full w-80 bg-white shadow-2xl rounded-l-lg p-6 relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
                    onClick={onClose}
                >
                    <AiOutlineClose size={24} />
                </button>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Create a Deadline</h2>
                <p className="text-gray-600 mb-6">Set the task and deadline below:</p>

                {/* Task Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg font-medium mb-1" htmlFor="taskName">
                        Task Name
                    </label>
                    <input
                        type="text"
                        id="taskName"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter task name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>

                {/* Deadline Date Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg font-medium mb-1" htmlFor="deadlineDate">
                        Deadline Date
                    </label>
                    <input
                        type="date"
                        id="deadlineDate"
                        value={deadlineDate}
                        onChange={(e) => setDeadlineDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>

                {/* Deadline Time Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg font-medium mb-1" htmlFor="deadlineTime">
                        Time
                    </label>
                    <input
                        type="time"
                        id="deadlineTime"
                        value={deadlineTime}
                        onChange={(e) => setDeadlineTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>

                {/* Create Deadline Button */}
                <button
                    className={`w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                        isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800"
                    }`}
                    onClick={handleCreateDeadline}
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Deadline"}
                </button>

                {/* Display Created Deadlines */}
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Created Deadlines:</h3>
                    <ul className="space-y-2">
                        {deadlines.map((deadline, index) => (
                            <li key={index} className="bg-gray-100 p-3 rounded-lg shadow">
                                <p className="text-lg font-medium text-gray-800">{deadline.description}</p>
                                <p className="text-sm text-gray-600">{deadline.deadline}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DeadlinePopUp;
