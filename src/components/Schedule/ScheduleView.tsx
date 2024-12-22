import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Api } from "@/utils/api.ts";
import "react-toastify/dist/ReactToastify.css";
import Login from "../Login_Register/login.tsx";
import DeadlinePopUp from "../Schedule/DeadlinePopUp";
import NotePopUp from "../Schedule/NotePopUp";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const lessonSlots = Array.from({ length: 16 }, (_, i) => `Lesson ${i + 1}`);

const dayMapping: { [key: string]: string } = {
  "Thứ Hai": "Monday",
  "Thứ Ba": "Tuesday",
  "Thứ Tư": "Wednesday",
  "Thứ Năm": "Thursday",
  "Thứ Sáu": "Friday",
  "Thứ Bảy": "Saturday",
  "Chủ Nhật": "Sunday",
};

type ScheduleEntry = {
  days_in_week: string;
  start_period: string;
  periods: number;
  course_name: string;
  location: string;
  course_value_id: number;  // Assuming this is added to the course data
};

const ScheduleView: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customEvents, setCustomEvents] = useState<{ [key: string]: string }>(
      {}
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
      !!localStorage.getItem("user_id")
  );
  const [activePopup, setActivePopup] = useState<
      { type: "deadline" | "note" | null; course: ScheduleEntry } | null
  >(null);

  const api = new Api();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchTemplate();
    toast.success("Login successful!", { autoClose: 3000 });
  };

  useEffect(() => {
    if (isLoggedIn) fetchTemplate();
  }, [isLoggedIn]);

  const fetchTemplate = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        toast.error("User ID is missing. Please login again!", {
          autoClose: 3000,
        });
        return;
      }

      setLoading(true);
      const userId = parseInt(user_id, 10);
      if (isNaN(userId)) {
        toast.error("Invalid User ID. Please login again!", {
          autoClose: 3000,
        });
        return;
      }

      const user = await api.getTemplateId(userId);
      if (!user?.scheduler_template_ids?.length) {
        toast.error("No Scheduler Templates found for this user!", {
          autoClose: 3000,
        });
        return;
      }

      const allTemplates = await Promise.all(
          user.scheduler_template_ids.map((schedulerId: number) =>
              api.getTemplateBySchedulerId(schedulerId)
          )
      );

      const flattenedTemplates = allTemplates.flat();
      if (!flattenedTemplates.length) {
        toast.error("No schedule data found!", { autoClose: 3000 });
        return;
      }

      setScheduleData(flattenedTemplates);
      toast.success("Schedule loaded successfully!", { autoClose: 3000 });
    } catch {
      setError("Failed to load schedule data.");
      toast.error("Failed to load schedule data!", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const findSubject = (
      day: string,
      lessonIndex: number
  ): ScheduleEntry | null => {
    return (
        scheduleData.find((item) => {
          const mappedDay = dayMapping[item.days_in_week];
          const startPeriod = parseInt(item.start_period, 10);
          return (
              mappedDay === day &&
              lessonIndex + 1 >= startPeriod &&
              lessonIndex + 1 < startPeriod + item.periods
          );
        }) || null
    );
  };

  const handleCourseClick = (entry: ScheduleEntry) => {
    setActivePopup({ type: null, course: entry });
  };

  const handleAddEvent = (day: string, rowIndex: number) => {
    toast.info(`You don't have any classes during this time.`);
  };

  const getCurrentDayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  };

  return (
      <div className="text-center font-sans p-6">
        <ToastContainer />

        {!isLoggedIn ? (
            <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
            <div>
              <h1 className="text-3xl font-bold mb-4 text-blue-600">
                Your Timetable
              </h1>
              {loading ? (
                  <p className="text-blue-500 text-xl">Loading your schedule...</p>
              ) : error ? (
                  <p className="text-red-500 text-xl">{error}</p>
              ) : (
                  <div className="max-w-6xl mx-auto text-sm border p-4 shadow-lg rounded-md bg-white">
                    <div className="grid grid-cols-8 gap-1">
                      <div className="bg-gray-300 text-center font-bold p-2"></div>
                      {daysOfWeek.map((day, index) => (
                          <div
                              key={index}
                              className={`text-white font-bold text-center p-2 border ${
                                  getCurrentDayIndex() === index
                                      ? "bg-blue-700"
                                      : "bg-blue-500"
                              }`}
                          >
                            {day}
                          </div>
                      ))}

                      {lessonSlots.map((slot, rowIndex) => (
                          <React.Fragment key={rowIndex}>
                            <div className="bg-gray-200 text-center font-semibold p-2 border">
                              {slot}
                            </div>
                            {daysOfWeek.map((day, colIndex) => {
                              const entry = findSubject(day, rowIndex);
                              const isStartLesson =
                                  entry && rowIndex + 1 === parseInt(entry.start_period);
                              const eventKey = `${day}-${rowIndex}`;

                              if (isStartLesson) {
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className="p-2 border bg-yellow-100 text-sm font-medium text-gray-800 cursor-pointer"
                                        style={{ gridRow: `span ${entry.periods}` }}
                                        onClick={() => handleCourseClick(entry)}
                                    >
                                      <strong>{entry.course_name}</strong>
                                      <br />
                                      <em>Room: {entry.location}</em>
                                    </div>
                                );
                              }

                              if (entry) return null;

                              return (
                                  <div
                                      key={`${rowIndex}-${colIndex}`}
                                      className="p-2 border bg-gray-50 cursor-pointer hover:bg-blue-100"
                                      onClick={() => handleAddEvent(day, rowIndex)}
                                  >
                                    {customEvents[eventKey] && (
                                        <span className="text-xs text-blue-500">
                              {customEvents[eventKey]}
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
            </div>
        )}
        {activePopup && activePopup.type === "deadline" && (
            <DeadlinePopUp onClose={() => setActivePopup(null)} />
        )}
        {activePopup && activePopup.type === "note" && (
            <NotePopUp
                courseValueId={activePopup.course.course_value_id} // Pass the course_value_id
                onClose={() => setActivePopup(null)}
            />
        )}

        {activePopup && activePopup.type === null && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 rounded-xl shadow-2xl w-96">
                <p className="text-xl font-semibold text-gray-700 mb-4 text-center">
                  Add to Course:
                </p>
                <div className="mt-4 flex justify-around space-x-4">
                  <button
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                      onClick={() =>
                          setActivePopup((prev) =>
                              prev ? { ...prev, type: "note" } : null
                          )
                      }
                  >
                    Note
                  </button>
                  <button
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                      onClick={() =>
                          setActivePopup((prev) =>
                              prev ? { ...prev, type: "deadline" } : null
                          )
                      }
                  >
                    Deadline
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default ScheduleView;
