import React, { useState, useEffect, useCallback } from "react";
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
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
};

type ScheduleEntry = {
    days_in_week: string;
    start_period: string;
    periods: number;
    course_name: string;
    location: string;
    lecture?: string;
};

const TimeTable: React.FC = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customEvents, setCustomEvents] = useState<{ [key: string]: string }>({});
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        !!localStorage.getItem("user_id")
    );

    const api = new Api();

    const handleLoginSuccess = useCallback(() => {
        setIsLoggedIn(true);
        fetchTemplate();
        toast.success("Login successful!", { autoClose: 3000 });
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTemplate();
        }
    }, [isLoggedIn]);

    const fetchTemplate = useCallback(async () => {
        try {
            const user_id = localStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID is missing. Please login again!", {
                    autoClose: 3000,
                });
                return;
            }

            setLoading(true);
            setError(null);

            const userId = parseInt(user_id, 10);
            if (isNaN(userId)) {
                throw new Error("Invalid User ID. Please login again!");
            }

            const user = await api.getTemplateId(userId);
            if (!user?.scheduler_template_ids?.length) {
                throw new Error("No Scheduler Templates found for this user!");
            }

            const secondSchedulerId = user.scheduler_template_ids[1];
            if (!secondSchedulerId) {
                throw new Error("The second Scheduler Template ID is missing!");
            }

            const scheduleData = await api.getTemplateBySchedulerId(secondSchedulerId);
            if (!scheduleData.length) {
                throw new Error("No schedule data found for the selected template!");
            }

            // Split the data based on start_period and periods count
            const processedSchedule = scheduleData.flatMap((entry) => {
                const daysArray = entry.days_in_week.split(",").map((d) => d.trim());
                const startPeriod = parseInt(entry.start_period, 10);
                const periodsCount = entry.periods;
                const locations = entry.location.split(",");
                const lecturers = entry.lecture ? entry.lecture.split(",") : ["N/A"];

                return daysArray.map((day, idx) => ({
                    day,
                    startPeriod,
                    periodsCount,
                    courseName: entry.course_name,
                    location: locations[idx].trim(),
                    lecturer: lecturers[idx].trim(),
                }));
            });

            setScheduleData(processedSchedule);
            toast.success("Schedule loaded successfully!", { autoClose: 3000 });
        } catch (err: any) {
            setError(err.message || "Failed to load schedule data.");
            toast.error(err.message || "Failed to load schedule data!", {
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const findSubject = useCallback(
        (day: string, lessonIndex: number): ScheduleEntry | null => {
            return scheduleData.find((item) => {
                const startPeriod = item.startPeriod;
                const lessonStart = lessonIndex + 1;

                return (
                    item.day === day &&
                    lessonStart >= startPeriod &&
                    lessonStart < startPeriod + item.periodsCount
                );
            }) || null;
        },
        [scheduleData]
    );

    const handleAddEvent = useCallback(
        (day: string, lessonIndex: number) => {
            const eventKey = `${day}-${lessonIndex}`;
            const customEvent = prompt("Enter your event:");
            if (customEvent) {
                setCustomEvents((prev) => ({ ...prev, [eventKey]: customEvent }));
            }
        },
        []
    );

    const getCurrentDayIndex = useCallback(() => {
        const today = new Date().getDay();
        return today === 0 ? 6 : today - 1; // Adjust for Sunday being 0
    }, []);

    return (
        <div className="text-center font-sans p-6">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-blue-600">Your Timetable</h1>
            {loading ? (
                <p className="text-blue-500 text-xl">Loading your schedule...</p>
            ) : error ? (
                <p className="text-red-500 text-xl">{error}</p>
            ) : (
                <div className="max-w-6xl mx-auto text-sm border p-4 shadow-lg rounded-md bg-white">
                    <div className="grid grid-cols-8 gap-1">
                        {/* Header Row */}
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

                        {/* Rows for lessons */}
                        {lessonSlots.map((slot, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {/* Time Slot Label */}
                                <div className="bg-gray-200 text-center font-semibold p-2 border">
                                    {slot}
                                </div>
                                {/* Lesson Cells */}
                                {daysOfWeek.map((day, colIndex) => {
                                    const entry = findSubject(day, rowIndex);
                                    const isStartLesson =
                                        entry && rowIndex + 1 === entry.startPeriod;
                                    const eventKey = `${day}-${rowIndex}`;

                                    if (isStartLesson) {
                                        return (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                className="p-2 border bg-yellow-100 text-sm font-medium text-gray-800"
                                                style={{
                                                    gridRow: `span ${entry.periodsCount}`,
                                                }}
                                            >
                                                <strong>{entry.courseName}</strong>
                                                <br />
                                                <em>Room: {entry.location}</em>
                                                <br />
                                                <small>Lecturers: {entry.lecturer || "N/A"}</small>
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
    );
};

export default TimeTable;
