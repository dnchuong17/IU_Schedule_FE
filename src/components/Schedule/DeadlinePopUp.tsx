import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Api } from "../../utils/api.ts";
import { FiBell, FiBellOff } from "react-icons/fi";
import {
  DeadlineType,
  DeadlineRequest,
  DeadlineConstant,
} from "@/utils/request/deadlineRequest";

interface DeadlinePopUpProps {
  onClose?: () => void;
  positionStyle?: React.CSSProperties;
  courseValueId?: number; // Add this prop
}

const DeadlinePopUp: React.FC<DeadlinePopUpProps> = ({
  onClose,
  courseValueId,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [deadlineType, setDeadlineType] = useState<DeadlineType | "">("");
  const [description, setDescription] = useState("");
  const [, setDeadline] = useState("");
  const [date, setDate] = useState("");
  const [, setBellClicked] = useState(false);
  const [priority, setPriority] = useState<DeadlineConstant | "">("");
  const [is_Active, setIsActive] = useState(false);
  // Close handler with cleanup
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleCreateDeadline = async () => {
    if (!deadlineType || !priority || !description || !date) {
      alert("Please fill all the fields.");
      return;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      alert("Invalid deadline format.");
      return;
    }

    const api = new Api();

    const deadlineRequest: DeadlineRequest = {
      deadlineType: deadlineType as DeadlineType,
      priority: priority as DeadlineConstant,
      description,
      date: parsedDate.toISOString(), // Use ISO string format
      courseValueId,
    };

    try {
      await api.createDeadline(deadlineRequest);
      alert("Deadline created successfully!");
      handleClose();
    } catch (error: any) {
      console.error("Error creating deadline:", error);
      alert(
        `Failed to create deadline: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleRadioChange = (type: DeadlineType) => {
    setDeadlineType(type);
  };

  const handleBellClick = async () => {
    try {
      const api = new Api();
      const id = courseValueId;

      if (id === undefined) {
        alert("Course value ID is undefined. Cannot update deadline alert.");
        return;
      }
      console.log("UID:", id); // Log the UID here

      setIsActive((prevIsActive) => {
        const newIsActive = !prevIsActive;
        const isActive = newIsActive;
        console.log("Updating deadline alert for ID:", id);
        console.log("Payload: { isActive: ", isActive, " }");
        // Send the new isActive value. Backend will invert it.
        api.updateDeadlineAlert(id, isActive);

        return newIsActive;
      });
    } catch (error: any) {
      console.error("Error updating deadline alert:", error);
      alert(
        `Failed to update deadline alert: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    // Reset state when popup closes
    if (!isVisible) {
      setDeadlineType("");
      setPriority("");
      setDescription("");
      setDeadline("");
      setBellClicked(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-96 bg-white shadow-2xl rounded-lg p-4">
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
        <p className="text-gray-600 mb-4">
          Fill in the details below to create a new deadline:
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2 font-bold">
            Deadline Type
          </label>
          <div className="flex flex-wrap space-y-2">
            <div className="flex space-x-6 mb-2">
              {Object.values(DeadlineType)
                .slice(0, 2)
                .map((type) => (
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
              {Object.values(DeadlineType)
                .slice(2)
                .map((type) => (
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Priority
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value as DeadlineConstant)}
          >
            <option value="">Select Priority</option>
            <option value={DeadlineConstant.HIGH}>High</option>
            <option value={DeadlineConstant.MEDIUM}>Medium</option>
            <option value={DeadlineConstant.LOW}>Low</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex justify-center items-center mt-4">
          <button
            className="py-1.5 px-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out"
            onClick={handleCreateDeadline}
          >
            Create Deadline
          </button>
          <button
            className={`ml-4 text-gray-600 hover:text-blue-600 transition duration-300 ${
              is_Active ? "animate-shake" : ""
            }`}
            onClick={handleBellClick}
          >
            {is_Active ? <FiBell size={24} /> : <FiBellOff size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeadlinePopUp;
