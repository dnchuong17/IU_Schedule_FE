import React, { useState } from 'react';
import DeadlinePopUp from './DeadlinePopUp';
import NotePopUp from './NotePopUp';
import NotificationPopUp from './NotificationPopUp';


const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const lessonSlots = Array.from({ length: 16 }, (_, i) => `Lesson ${i + 1}`);

const ScheduleView = () => {
  const [showDeadlinePopup, setShowDeadlinePopup] = useState(false);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // const handleSetDeadline = () => setShowDeadlinePopup(true);
  // const handleNotes = () => setShowNotePopup(true);
  // const handleNotifications = () => setShowNotificationPopup(true);


  return (
      <div className="text-center font-sans p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Your Timetable</h1>

        {/* Timetable Container */}
        <div className="max-w-4xl mx-auto text-sm border border-gray-300 p-4 shadow-md rounded-md bg-white">
          <div className="grid grid-cols-8 border border-gray-00">
            <div className="bg-gray-200 border-r border-gray-300"></div>
            {daysOfWeek.map((day, index) => (
                <div
                    key={index}
                    className="bg-blue-600 text-white font-semibold p-1 border border-gray-300"
                >
                  {day}
                </div>
            ))}
            {lessonSlots.map((lesson, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="bg-gray-100 text-center font-semibold p-1 border border-gray-300">
                    {lesson}
                  </div>
                  {daysOfWeek.map((_, colIndex) => (
                      <div
                          key={`${rowIndex}-${colIndex}`}
                          className="p-2 border border-gray-200 bg-gray-50 hover:bg-blue-100 transition duration-200"
                          style={{ borderStyle: 'solid', borderWidth: '1px' }}
                      ></div>
                  ))}
                </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button onClick={()=>setShowDeadlinePopup(true)} className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
            Set Deadline
          </button>
          <button onClick={() => setShowNotePopup(true)} className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
            Notes
          </button>
          <button onClick={() => setShowNotificationPopup(true)} className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out">
            Notifications
          </button>
        </div>

        {/* Popups */}
        {showDeadlinePopup && <DeadlinePopUp onClose={() => setShowDeadlinePopup(false)} />}
        {showNotePopup && <NotePopUp onClose={() => setShowNotePopup(false)} />}
        {showNotificationPopup && <NotificationPopUp
            onClose={() => setShowNotificationPopup(false)}
            onViewDetails={() => {
              setShowNotificationPopup(false);
              setShowDeadlinePopup(true);
            }}
        />}
      </div>
  );
};

export default ScheduleView;
