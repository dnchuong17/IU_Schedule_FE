import React, { useState } from 'react';
import DeadlinePopUp from './DeadlinePopUp';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const lessonSlots = Array.from({ length: 16 }, (_, i) => `Lesson ${i + 1}`);

const ScheduleView = () => {
  const [isDeadlinePopupVisible, setIsDeadlinePopupVisible] = useState(false);

  const handleSetDeadline = () => {
    setIsDeadlinePopupVisible(true);
  };

  const handleNotes = () => {
    alert('Notes feature is under development.');
  };

  const handleNotifications = () => {
    alert('Notifications feature is under development.');
  };

  const closeDeadlinePopup = () => {
    setIsDeadlinePopupVisible(false);
  };

  return (
    <div className="text-center font-sans p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600"> Timetable</h1>      

      {/* Smaller Timetable */}
      <div className="max-w-4xl mx-auto text-sm">
        <div className="grid grid-cols-8 border border-gray-300 mb-6">
          {/* Header Row */}
          <div className="bg-gray-200 border-r border-gray-300"></div>
          {daysOfWeek.map((day, index) => (
            <div key={index} className="bg-blue-600 text-white font-semibold p-1 border border-gray-300">{day}</div>
          ))}
          
          {/* Lesson Rows */}
          {lessonSlots.map((lesson, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {/* Lesson Column */}
              <div className="bg-gray-100 text-center font-semibold p-1 border border-gray-300">{lesson}</div>
              {/* Time Slots for Each Day */}
              {daysOfWeek.map((_, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="p-2 border border-gray-300"></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handleSetDeadline} className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
          Set Deadline
        </button>
        <button onClick={handleNotes} className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
          Notes
        </button>
        <button onClick={handleNotifications} className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
          Notifications
        </button>
      </div>
      
      {isDeadlinePopupVisible && (
        <DeadlinePopUp onClose={closeDeadlinePopup} />
      )}
    </div>
  );
};

export default ScheduleView;
