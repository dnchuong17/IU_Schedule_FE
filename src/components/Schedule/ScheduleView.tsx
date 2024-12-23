import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Api } from "@/utils/api.ts";
import "react-toastify/dist/ReactToastify.css";
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

type Deadline = {
  UID: number;
  is_Active: boolean;
  priority: string;
  description: string;
  deadline: string;
  courseValueId: number;
  deadline_type: string;
  userId: number | null;
};



const ScheduleView: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customEvents] = useState<{ [key: string]: string }>(
      {}
  );

  const [hoveredDeadline] = useState<Deadline[] | null>(
      null
  );

  const [isLoggedIn] = useState<boolean>(
      !!localStorage.getItem("user_id")
  );
  const [activePopup, setActivePopup] = useState<
      { type: "deadline" | "note" | null; course: ScheduleEntry } | null
  >(null);

  const [popupData, setPopupData] = useState<{
    position: { top: number; left: number } | null;
    deadlines: Deadline[] | null;
  } | null>(null);

  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);


  const api = new Api();


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

  const handleCourseClick = (entry: ScheduleEntry, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setActivePopup({ type: null, course: entry });
  };

  // const handleOpenNotePopUp = () => {
  //   setActivePopup((prev) => (prev ? { ...prev, type: "note" } : null));
  // };
  //
  // const handleOpenDeadlinePopUp = () => {
  //   setActivePopup((prev) => (prev ? { ...prev, type: "deadline" } : null));
  // };



  const handleAddEvent = (day: string, rowIndex: number) => {
    toast.info(`You don't have any classes during this time.`);
  };

  const getCurrentDayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  };


  //Hover to show deadline

  const fetchAndShowDeadlines = async (entry: ScheduleEntry, event: React.MouseEvent) => {
    try {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const response = await api.getDeadline(entry.course_value_id);
      setPopupData({
        position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },
        deadlines: response?.deadlines || [],
      });
    } catch (error) {
      toast.error("Failed to fetch deadlines for this course!", {
        autoClose: 3000,
      });
      setPopupData(null);
    }
  };

  const hidePopup = () => {
    setPopupData(null);
  };



  return (
      <div className="text-center font-sans p-6">
        <ToastContainer />

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
                                    style={{gridRow: `span ${entry.periods}`}}
                                    onClick={(event) => handleCourseClick(entry, event)}
                                    onMouseEnter={(event) =>
                                        fetchAndShowDeadlines(entry, event)
                                    }
                                    onMouseLeave={hidePopup}
                                >
                                  <strong>{entry.course_name}</strong>
                                  <br/>
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

        {hoveredDeadline && (
            <div className="absolute bg-white p-4 rounded shadow-lg border">
              <h3 className="text-lg font-bold mb-2">Deadlines</h3>
              <ul>
                {hoveredDeadline.map((deadline) => (
                    <li key={deadline.UID} className="mb-1">
                      <strong>{deadline.deadline_type}:</strong> {deadline.description} <br />
                      <em>Due: {new Date(deadline.deadline).toLocaleString()}</em>
                    </li>
                ))}
              </ul>
            </div>
        )}


        {activePopup && activePopup.type === "deadline" && (
            <DeadlinePopUp
                onClose={() => setActivePopup(null)}
                courseValueId={activePopup.course.course_value_id}
            />
        )}

        {activePopup && activePopup.type === "note" && popupPosition && (
            <div
                className="absolute bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 rounded-xl shadow-2xl"
                style={{
                  top: popupPosition.top,
                  left: popupPosition.left,
                }}
            >
              <NotePopUp
                  courseValueId={activePopup.course.course_value_id}
                  onClose={() => setActivePopup(null)}
              />
            </div>
        )}




        {popupData && popupData.deadlines && popupData.deadlines.length > 0 && (
            <div
                className="absolute bg-white p-4 rounded shadow-lg border"
                style={{
                  top: popupData.position?.top,
                  left: popupData.position?.left,
                }}
            >
              <h3 className="text-lg font-bold mb-2">Deadlines</h3>
              <ul>
                {popupData.deadlines.map((deadline) => (
                    <li key={deadline.UID} className="mb-1">
                      <strong>{deadline.deadline_type}:</strong> {deadline.description} <br />
                      <em>Due: {new Date(deadline.deadline).toLocaleString()}</em>
                    </li>
                ))}
              </ul>
            </div>
        )}




        {activePopup && activePopup.type === null && popupPosition && (
            <div
                className="absolute bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 rounded-xl shadow-2xl"
                style={{
                  top: popupPosition.top,
                  left: popupPosition.left,
                }}
            >
              {/* Close button */}
              <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => setActivePopup(null)}
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <p className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Add to Course:
              </p>
              <div className="mt-4 flex justify-around space-x-4">
                <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                    onClick={() =>
                        setActivePopup((prev) => (prev ? { ...prev, type: "note" } : null))
                    }
                >
                  Note
                </button>
                <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                    onClick={() =>
                        setActivePopup((prev) => (prev ? { ...prev, type: "deadline" } : null))
                    }
                >
                  Deadline
                </button>
              </div>
            </div>
        )}

      </div>
  );
};

export default ScheduleView;