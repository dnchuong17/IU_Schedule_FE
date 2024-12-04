import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Api } from "../../utils/api.ts"; // Adjust the import path for your API class

type DeadlinePopUpProps = {
    onClose?: () => void;
};

const DeadlinePopUp: React.FC<DeadlinePopUpProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [deadlineType, setDeadlineType] = useState("");
    const [priority, setPriority] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [courseValueId, setCourseValueId] = useState<number | "">("");

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    const handleCreateDeadline = async () => {
        if (!deadlineType || !priority || !description || !deadline || !courseValueId) {
            alert("Please fill all the fields.");
            return;
        }

        const api = new Api();

        const deadlineRequest = {
            deadlineType,
            priority,
            description,
            deadline,
            courseValueId: Number(courseValueId),
        };

        try {
            const response = await api.createDeadline(deadlineRequest);
            alert("Deadline created successfully!");
            console.log("API Response:", response);

            handleClose();
        } catch (error: any) {
            console.error("Error creating deadline:", error.response?.data || error.message);
            alert(`Failed to create deadline: ${error.response?.data?.message || error.message}`);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50">
            <div className="h-full w-80 bg-white shadow-2xl rounded-l-lg p-6 relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
                    onClick={handleClose}
                >
                    <AiOutlineClose size={24} />
                </button>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Create a Deadline</h2>
                <p className="text-gray-600 mb-6">Fill in the details below to create a new deadline:</p>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="deadlineType">
                        Deadline Type
                    </label>
                    <input
                        type="text"
                        id="deadlineType"
                        placeholder="e.g., Assignment"
                        value={deadlineType}
                        onChange={(e) => setDeadlineType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="priority">
                        Priority
                    </label>
                    <input
                        type="text"
                        id="priority"
                        placeholder="e.g., High, Medium, Low"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="description">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        placeholder="Describe the task"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="deadline">
                        Deadline
                    </label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="courseValueId">
                        Course Value ID
                    </label>
                    <input
                        type="number"
                        id="courseValueId"
                        placeholder="Enter course ID"
                        value={courseValueId}
                        onChange={(e) => setCourseValueId(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>
                <button
                    className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out"
                    onClick={handleCreateDeadline}
                >
                    Create Deadline
                </button>
            </div>
        </div>
    );
};

export default DeadlinePopUp;
