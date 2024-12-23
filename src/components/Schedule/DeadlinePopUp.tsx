import React, { useState} from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Api } from "../../utils/api.ts";
import { FiBell, FiBellOff } from "react-icons/fi";
import { DeadlineType, DeadlineRequest } from "@/utils/request/deadlineRequest";

interface DeadlinePopUpProps {
    onClose?: () => void; // Made onClose optional
    positionStyle?: React.CSSProperties;
}


const DeadlinePopUp: React.FC<DeadlinePopUpProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [deadlineType, setDeadlineType] = useState<DeadlineType | "">("");
    const [priority, setPriority] = useState<"High" | "Medium" | "Low" | "">("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [courseValueId, setCourseValueId] = useState<number | "">("");
    const [bellClicked, setBellClicked] = useState(false);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    const handleCreateDeadline = async () => {
        if (!deadlineType || !priority || !description || !deadline || !courseValueId) {
            alert("Please fill all the fields.");
            return;
        }

        const parsedDeadline = new Date(deadline);
        if (isNaN(parsedDeadline.getTime())) {
            alert("Invalid deadline format. Please use a valid date and time.");
            return;
        }

        const formattedDeadline = `${parsedDeadline.getFullYear()}-${String(parsedDeadline.getMonth() + 1).padStart(2, '0')}-${String(parsedDeadline.getDate()).padStart(2, '0')} ${String(parsedDeadline.getHours()).padStart(2, '0')}:${String(parsedDeadline.getMinutes()).padStart(2, '0')}:${String(parsedDeadline.getSeconds()).padStart(2, '0')}`;

        const api = new Api();

        const deadlineRequest: DeadlineRequest = {
            deadlineType: deadlineType as DeadlineType,
            priority,
            description,
            deadline: formattedDeadline,
            courseValueId: Number(courseValueId),
        };
        console.log(deadlineRequest);

        try {
            const response = await api.createDeadline(deadlineRequest);
            console.log("API Response:", response);
            alert("Deadline created successfully!");

            handleClose();
        } catch (error: any) {
            console.error("Error creating deadline:", error.response?.data || error.message);
            alert(`Failed to create deadline: ${error.response?.data?.message || error.message}`);
        }
    };



    const handleRadioChange = (type: DeadlineType) => {
        setDeadlineType(type);
    };

    const handleBellClick = async () => {
        setBellClicked(!bellClicked);
        try {
            const api = new Api();
            await api.updateDeadlineAlert("some-deadline-id", !bellClicked);
            alert(bellClicked ? "Deadline alert deactivated" : "Deadline alert activated");
        } catch (error: any) {
            console.error("Error updating deadline alert:", error.response?.data || error.message);
            alert(`Failed to update deadline alert: ${error.response?.data?.message || error.message}`);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative w-96 bg-white shadow-2xl rounded-lg p-4" >
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white bg-opacity-50 rotate-45"></div>
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
                    onClick={handleClose}
                >
                    <AiOutlineClose size={24} />
                </button>
                <h2 className="text-xl font-bold text-blue-600 mb-4">
                    Create a Deadline
                </h2>
                <p className="text-gray-600 mb-4">Fill in the details below to create a new deadline:</p>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2 font-bold">Deadline Type</label>
                    <div className="flex flex-wrap space-y-2">
                        <div className="flex space-x-6 mb-2">
                            {Object.values(DeadlineType).slice(0, 2).map((type) => (
                                <label key={type} className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="deadlineType"
                                        checked={deadlineType === type}
                                        onChange={() => handleRadioChange(type)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700 text-sm">{type}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex space-x-6">
                            {Object.values(DeadlineType).slice(2).map((type) => (
                                <label key={type} className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="deadlineType"
                                        checked={deadlineType === type}
                                        onChange={() => handleRadioChange(type)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700 text-sm">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" >
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" >
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        placeholder="Describe the task"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Deadline
                    </label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value) {
                                const parsedDate = new Date(value);
                                if (!isNaN(parsedDate.getTime())) {
                                    setDeadline(value); // Lưu raw input từ datetime-local
                                } else {
                                    alert("Invalid date and time format");
                                }
                            } else {
                                setDeadline("");
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />

                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-boldm mb-2">
                        Course Value ID
                    </label>
                    <input
                        type="number"
                        id="courseValueId"
                        placeholder="Enter course ID"
                        value={courseValueId}
                        onChange={(e) => setCourseValueId(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                    />
                </div>

                <div className="flex justify-center items-center mt-4">
                    <button
                        className="py-1.5 px-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out"
                        onClick={handleCreateDeadline}
                    >
                        Create
                    </button>
                    <button
                        className={`ml-4 text-gray-600 hover:text-blue-600 transition duration-300 ${bellClicked ? "animate-shake" : ""}`}
                        onClick={handleBellClick}
                    >
                        {bellClicked ? <FiBell size={24} /> : <FiBellOff size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeadlinePopUp;
