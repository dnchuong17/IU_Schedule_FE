import {
  CompleteSchedule,
  DISPLAY_PERIODS,
  _extractDates,
} from "../../lib/schedule";
import Cell, { CellProps } from "../Timetable/Cell";
import Row from "../Timetable/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { Api } from "../../utils/api.ts";
import { toast } from "react-toastify";
import { scheduleRequest } from "../../utils/request/scheduleRequest";
import { useEffect, useState } from "react";

interface ScheduleTableProps {
  completeSchedule: CompleteSchedule;
  center: boolean;
}

const ScheduleTable = ({ completeSchedule, center }: ScheduleTableProps) => {
  const [savedSchedules, setSavedSchedules] = useState<CompleteSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const rowsProps: CellProps[][] = populateSchedule(completeSchedule);

  // Function to translate day to Vietnamese
  const translateDayToVietnamese = (day: string): string => {
    const dayMapping: { [key: string]: string } = {
      Mon: "Thứ Hai",
      Tue: "Thứ Ba",
      Wed: "Thứ Tư",
      Thu: "Thứ Năm",
      Fri: "Thứ Sáu",
      Sat: "Thứ Bảy",
      Sun: "Chủ Nhật",
    };
    return dayMapping[day] || day;
  };

  // Function to save the schedule
  const handleSave = async () => {
    const api = new Api();
    const studentId = localStorage.getItem("student_id") || undefined;

    const listOfCourses = completeSchedule.flatMap((classObj) => {
      const { classObject } = classObj;
      const dates = Array.isArray(classObject.date)
          ? classObject.date
          : [classObject.date];

      return dates.map((date, index) => {
        const location = Array.isArray(classObject.location)
            ? classObject.location[index] || classObject.location[0]
            : classObject.location;

        const isLab = typeof location === "string" && location.includes("LA");

        return {
          courseID: classObject.courseID,
          courseName: classObject.courseName,
          credits: parseInt(classObject.credits, 10),
          date: translateDayToVietnamese(date),
          startPeriod:
              classObject.startPeriod[index] || classObject.startPeriod[0],
          periodsCount:
              classObject.periodsCount[index] || classObject.periodsCount[0],
          location: location,
          lecturer: Array.isArray(classObject.lecturer)
              ? classObject.lecturer[index] || classObject.lecturer[0]
              : classObject.lecturer,
          isActive: classObject.isActive,
          isLab: isLab,
          isDeleted: false,
        };
      });
    });

    const sortedCourses = listOfCourses.sort((a, b) => {
      return a.isLab === b.isLab ? 0 : a.isLab ? 1 : -1;
    });

    const payload: scheduleRequest = {
      studentId: studentId,
      templateId: null,
      listOfCourses: sortedCourses,
    };

    try {
      const response = await api.createNewSchedule(payload);
      toast.success("Schedule saved successfully!", { autoClose: 3000 });

      const newTemplateId = response.newTemplateId;
      if (newTemplateId) {
        localStorage.setItem("templateId", newTemplateId.toString());
        toast.success(
            `Schedule created successfully! Template ID: ${newTemplateId}`,
            { autoClose: 3000 }
        );
      } else {
        toast.error("Schedule created, but no Template ID was returned.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to save schedule. Please try again.", {
        autoClose: 3000,
      });
    }
  };

  // Fetch saved schedules from API
  const fetchSavedSchedules = async () => {
    try {
      const api = new Api();
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User ID is missing. Please log in.");
        return;
      }

      const response = await api.getTemplateId(parseInt(userId, 10));
      const templateIds = response.scheduler_template_ids;

      if (!templateIds || !templateIds.length) {
        toast.info("No saved schedules found for this user.");
        return;
      }

      // Lấy templateId cuối cùng
      const lastTemplateId = templateIds[templateIds.length - 1];
      console.log("Last Template ID:", lastTemplateId);

      // Tiếp tục xử lý với lastTemplateId
      const schedules = await api.getTemplateBySchedulerId(lastTemplateId);
      setSavedSchedules(schedules);
      toast.success("Saved schedules loaded successfully!");
    } catch (error) {
      toast.error("Failed to load saved schedules. Please try again.");
    }
  };


  useEffect(() => {
    fetchSavedSchedules();
  }, []);

  const rows = rowsProps.map((cellsProps, index) => (
      <Row cellsProps={cellsProps} key={index}></Row>
  ));

  return (
      <div
          className={`overflow-x-auto rounded shadow shadow-slate-300 ${
              center ? `xl:col-span-2 xl:mx-auto xl:max-w-screen-lg` : ""
          }`}
      >
        <table className="w-full min-w-[50rem] table-fixed bg-white">
          <thead>
          <tr className="text-white">
            <Cell className="bg-indigo-400 py-1" useTH={true}></Cell>
            <Cell className="w-[13.66%] bg-indigo-400 py-1" useTH={true}>
              Mon
            </Cell>
            <Cell className="w-[13.66%] bg-indigo-400 py-1" useTH={true}>
              Tue
            </Cell>
            <Cell className="w-[13.66%] bg-indigo-400 py-1" useTH={true}>
              Wed
            </Cell>
            <Cell className="w-[13.66%] bg-indigo-400 py-1" useTH={true}>
              Thu
            </Cell>
            <Cell className="w-[13.66%] bg-indigo-400 py-1" useTH={true}>
              Fri
            </Cell>
            <Cell className="w-[13.66%] bg-indigo-400 py-1" useTH={true}>
              Sat
            </Cell>
            <Cell className="w-[13.66%] bg-indigo-400 py-1" useTH={true}>
              Sun
            </Cell>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        {loading ? (
            <p>Loading saved schedules...</p>
        ) : savedSchedules.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold">Saved Schedules:</h3>
              {savedSchedules.map((schedule, index) => (
                  <ScheduleTable
                      key={index}
                      completeSchedule={schedule}
                      center={false}
                  />
              ))}
            </div>
        ) : (
            <p>No saved schedules available.</p>
        )}
        <button
            onClick={handleSave}
            className="mt-2 text-indigo-400 hover:text-indigo-600"
        >
          <FontAwesomeIcon icon={faBookmark} /> Save Schedule
        </button>
      </div>
  );
};

// Helper functions for generating schedule rows
function populateSchedule(completeSchedule: CompleteSchedule) {
  const rowsProps: CellProps[][] = initTable();
  for (const { classObject, color } of completeSchedule) {
    const { courseName, startPeriod, periodsCount, location, lecturer } =
        classObject;
    const dates = _extractDates(classObject);
    dates.forEach((date, index) => {
      for (let row = 0; row < periodsCount[index]; row++) {
        const oldCellProps = rowsProps[startPeriod[index] - 1 + row][date + 1];
        let newCellProps: CellProps;
        if (row === 0) {
          const cellContent = (
              <div className="flex flex-col gap-2">
                <p className="break-words text-sm font-bold">{courseName}</p>
                <p className="break-words text-xs">
                  {lecturer[index]}
                  <br />
                  {location[index]}
                </p>
              </div>
          );
          newCellProps = {
            children: cellContent,
            className: `px-1.5 ${color}`,
            rowSpan: periodsCount[index],
          };
        } else {
          newCellProps = {
            ...oldCellProps,
            className: "hidden",
          };
        }
        rowsProps[startPeriod[index] - 1 + row][date + 1] = newCellProps;
      }
    });
  }
  return rowsProps;
}

function initTable() {
  const rowsProps: CellProps[][] = [];
  const DAY_PER_WEEK = 7;
  const last_period = DISPLAY_PERIODS - 1;
  for (let period = 0; period < DISPLAY_PERIODS; period++) {
    const cellsProps: CellProps[] = [];
    let borderStyle = "border border-solid border-slate-300";
    if (period !== last_period) {
      borderStyle = (period === 5 ? "border-b-4 " : "border-b ") + borderStyle;
    }
    const periodStart =
        480 +
        50 * period +
        (period >= 3 ? 5 : 0) +
        (period >= 6 ? 10 : 0) +
        (period >= 9 ? 5 : 0);
    const periodEnd = periodStart + 50;
    const periodChild = (
        <p>
          {period + 1}
          <span
              className="absolute top-1 left-10 hidden whitespace-nowrap rounded
            bg-indigo-900/80 p-1 text-white shadow shadow-indigo-500 group-hover:block"
          >
          {Math.floor(periodStart / 60)}h
            {(periodStart % 60).toLocaleString("en", { minimumIntegerDigits: 2 })}{" "}
            - {Math.floor(periodEnd / 60)}h
            {(periodEnd % 60).toLocaleString("en", { minimumIntegerDigits: 2 })}
        </span>
        </p>
    );
    cellsProps.push({
      children: periodChild,
      className: `border-r ${borderStyle} text-center group relative`,
    });
    for (let day = 0; day < DAY_PER_WEEK; day++) {
      cellsProps.push({
        children: "",
        className: (day !== 6 ? "border-r " : "") + borderStyle,
      });
    }
    rowsProps.push(cellsProps);
  }
  return rowsProps;
}

export default ScheduleTable;
