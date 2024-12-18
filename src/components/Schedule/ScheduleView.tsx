import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Api } from "../../utils/api.ts";
import DeadlinePopUp from "./DeadlinePopUp";
import NotePopUp from "./NotePopUp";
import NotificationPopUp from "./NotificationPopUp";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const lessonSlots = Array.from({ length: 16 }, (_, i) => `Leson ${i + 1}`);

const ScheduleView = () => {
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeadlinePopup, setShowDeadlinePopup] = useState(false);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [customEvents, setCustomEvents] = useState<{ [key: string]: string }>(
    {}
  );

  const api = new Api();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          toast.error("User Id is missing. Please login again!", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        setLoading(true);

        const userId = parseInt(user_id, 10); // Convert user_id to a number
        if (isNaN(userId)) {
          toast.error("Invalid User ID. Please login again!", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        setLoading(true);

        const user = await api.findUserById(userId);
        if (!user || !user.scheduler_ids || user.scheduler_ids.length === 0) {
          toast.error("Scheduler ID not found for this user!", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        const schedulerId = user.scheduler_ids[0];
        localStorage.setItem("schedulerId", String(schedulerId));
        const templateData = await api.getTemplateBySchedulerId(schedulerId);
        setScheduleData(templateData);

        toast.success("Schedule loaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        setError("Failed to load schedule data.");
        toast.error("Failed to load schedule data!", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  const findSubject = (day: string, lessonIndex: number) => {
    return (
      scheduleData.find(
        (item) =>
          item.days_in_week === day &&
          lessonIndex + 1 >= parseInt(item.start_period) &&
          lessonIndex + 1 < parseInt(item.start_period) + item.periods
      ) || null
    );
  };

  const handleAddEvent = (day: string, lessonIndex: number) => {
    const eventKey = `${day}-${lessonIndex}`;
    const customEvent = prompt("Enter your event:");
    if (customEvent) {
      setCustomEvents({ ...customEvents, [eventKey]: customEvent });
    }
  };

  const getCurrentDayIndex = () => {
    const today = new Date().getDay();
    // Map JS getDay() (0=Sunday, 6=Saturday) to schedule index (0=Monday, 6=Sunday)
    return today === 0 ? 6 : today - 1;
  };

  return (
    <div className="text-center font-sans p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Your Timetable</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="max-w-4xl mx-auto text-sm border border-gray-300 p-4 shadow-md rounded-md bg-white">
          <div
            className="grid grid-cols-8 border border-black"
            style={{ borderCollapse: "collapse" }}
          >
            <div className="bg-gray-200 text-center font-semibold border border-black"></div>
            {daysOfWeek.map((day, index) => (
              <div
                key={index}
                className={`bg-blue-600 text-white font-semibold p-2 border border-black ${
                  getCurrentDayIndex() === index ? "bg-green-500" : ""
                }`}
              >
                {day}
              </div>
            ))}

            {lessonSlots.map((slot, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="bg-gray-100 text-center font-semibold p-2 border border-black">
                  {slot}
                </div>

                {daysOfWeek.map((day, colIndex) => {
                  const entry = findSubject(day, rowIndex);
                  const isStartLesson =
                    entry && rowIndex + 1 === parseInt(entry.start_period);
                  const eventKey = `${day}-${rowIndex}`;
                  const customEvent = customEvents[eventKey];

                  if (isStartLesson) {
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="p-2 border border-black bg-yellow-100 text-sm font-medium text-gray-800"
                        style={{
                          gridRow: `span ${entry.periods}`,
                        }}
                      >
                        <strong>{entry.course_name}</strong>
                        <br />
                        <em>Phòng: {entry.location}</em>
                      </div>
                    );
                  }

                  if (entry) return null;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="p-2 border border-black bg-gray-50 cursor-pointer hover:bg-blue-100"
                      onClick={() => handleAddEvent(day, rowIndex)}
                    >
                      {customEvent && (
                        <span className="text-xs text-blue-500">
                          {customEvent}
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setShowDeadlinePopup(true)}
          className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Set Deadline
        </button>
        <button
          onClick={() => setShowNotePopup(true)}
          className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Notes
        </button>
        <button
          onClick={() => setShowNotificationPopup(true)}
          className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Notifications
        </button>
        <Link to="/schedule">
          <button className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg">
            {" "}
            Create new template{" "}
          </button>
        </Link>
      </div>

      {showDeadlinePopup && (
        <DeadlinePopUp onClose={() => setShowDeadlinePopup(false)} />
      )}
      {showNotePopup && <NotePopUp onClose={() => setShowNotePopup(false)} />}
      {showNotificationPopup && (
        <NotificationPopUp onClose={() => setShowNotificationPopup(false)} />
      )}
    </div>
  );
};

export default ScheduleView;
