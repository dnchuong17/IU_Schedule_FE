import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Api } from "@/utils/api.ts";
import "react-toastify/dist/ReactToastify.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
    const [customEvents, setCustomEvents] = useState<{ [key: string]: string }>({});
   const [isLoggedIn] = useState<boolean>(!!localStorage.getItem("user_id"));

    const api = new Api();

/*    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        fetchTemplate();
        toast.success("Login successful!", { autoClose: 3000 });
    };
*/
    useEffect(() => {
        if (isLoggedIn) fetchTemplate();
    }, [isLoggedIn]);

    const fetchTemplate = async () => {
        try {
            const user_id = localStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID is missing. Please login again!", { autoClose: 3000 });
                return;
            }

            setLoading(true);
            const userId = parseInt(user_id, 10);
            if (isNaN(userId)) {
                toast.error("Invalid User ID. Please login again!", { autoClose: 3000 });
                return;
            }

            const user = await api.getTemplateId(userId);
            if (!user?.scheduler_template_ids?.length) {
                toast.error("No Scheduler Templates found for this user!", { autoClose: 3000 });
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
        } catch (err) {
            setError("Failed to load schedule data.");
            toast.error("Failed to load schedule data!", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const findSubject = (day: string, lessonIndex: number): ScheduleEntry | null => {
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
        <div className="p-4 bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-6 text-blue-700">Your Sub Schedule</h1>
            </div>
            {loading ? (
                <p className="text-lg text-center text-blue-500">Loading your schedule...</p>
            ) : error ? (
                <p className="text-lg text-center text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto overflow-y-auto">
                    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="grid grid-cols-8 text-sm border border-gray-300">
                            <div className="bg-blue-700 text-white text-center font-bold py-2 px-1 border">
                                Time/Day
                            </div>
                            {daysOfWeek.map((day, index) => (
                                <div
                                    key={index}
                                    className={`py-2 px-1 text-center font-bold border ${
                                        getCurrentDayIndex() === index ? "bg-blue-500 text-white" : "bg-gray-300"
                                    }`}
                                >
                                    {day}
                                </div>
                            ))}
                            {lessonSlots.map((slot, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    <div className="bg-blue-200 text-center font-semibold py-2 px-1 border">
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
                                                    className="py-2 px-1 bg-purple-200 border border-blue-400 text-center"
                                                    style={{ gridRow: `span ${entry.periods}` }}
                                                >
                                                    <strong>{entry.course_name}</strong>
                                                    <br />
                                                    <em>{entry.location}</em>
                                                </div>
                                            );
                                        }

                                        if (entry) return null;

                                        return (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                className="py-2 px-1 bg-gray-100 border border-gray-300 text-center cursor-pointer hover:bg-purple-100"
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
                </div>
            )}
        </div>
    );
};

export default Timetable;
