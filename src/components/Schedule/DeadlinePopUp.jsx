import React, { useEffect, useRef } from 'react';

const DeadlinePopUp = ({ onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    // Function to handle click outside the popup
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50">
      <div ref={popupRef} className="h-full w-80 bg-white shadow-2xl rounded-l-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Popup Content */}
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Create a Deadline</h2>
        <p className="text-gray-600 mb-6">Set the task and deadline below:</p>

        {/* Task Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="taskName">Task Name</label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            placeholder="Enter task name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          />
        </div>

        {/* Deadline Date */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="deadlineDate">Deadline Date</label>
          <input
            type="date"
            id="deadlineDate"
            name="deadlineDate"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          />
        </div>

        {/* Time */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="deadlineTime">Time</label>
          <input
            type="time"
            id="deadlineTime"
            name="deadlineTime"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          />
        </div>

        {/* Button */}
        <button className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
          Create Deadline
        </button>
      </div>
    </div>
  );
};

export default DeadlinePopUp;
