import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Api } from "@/utils/api.ts";
import "react-toastify/dist/ReactToastify.css";

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
};

const Timetable: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customEvents, setCustomEvents] = useState<{ [key: string]: string }>(
    {}
  );
  const [isLoggedIn] = useState<boolean>(!!localStorage.getItem("user_id"));

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

      // Get the first templateId from the array
      const firstTemplateId = user.scheduler_template_ids[0];
      console.log("Using Template ID:", firstTemplateId);

      const template = await api.getTemplateBySchedulerId(firstTemplateId);

      if (!template || !template.length) {
        toast.error("No schedule data found for the selected template!", {
          autoClose: 3000,
        });
        return;
      }

      setScheduleData(template);
      toast.success("Schedule loaded successfully!", { autoClose: 3000 });
    } catch (err) {
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

  const handleAddEvent = (day: string, lessonIndex: number) => {
    const eventKey = `${day}-${lessonIndex}`;
    const customEvent = prompt("Enter your event:");
    if (customEvent) {
      setCustomEvents((prev) => ({ ...prev, [eventKey]: customEvent }));
    }
  };

  const getCurrentDayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
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
    </div>
  );
};

export default Timetable;
