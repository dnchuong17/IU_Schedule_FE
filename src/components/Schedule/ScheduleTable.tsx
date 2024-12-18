import {
  CompleteSchedule,
  DISPLAY_PERIODS,
  _extractDates,
} from "../../lib/schedule";
import Cell, { CellProps } from "../Timetable/Cell";
import Row from "../Timetable/Row"; // Add this line to import the Row component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { Api } from "../../utils/api.ts";
import { toast } from "react-toastify";
interface ScheduleTableProps {
  completeSchedule: CompleteSchedule;
  center: boolean;
}

const ScheduleTable = ({ completeSchedule, center }: ScheduleTableProps) => {
  const rowsProps: CellProps[][] = populateSchedule(completeSchedule);

  // src/components/Schedule/ScheduleTable.tsx

  const handleSave = async () => {
    const api = new Api();
    const studentId = localStorage.getItem("student_id");
    const schedulerId = localStorage.getItem("schedulerId");
    console.log("studentId:", studentId); // Log the value
    if (!studentId) {
      console.error("Student ID is missing. Please login again.");
      return;
    }
    if (!schedulerId) {
      console.error("Scheduler ID is missing. Please select a scheduler.");
      return;
    }

    // Add debugging logs to verify classObject structure
    completeSchedule.forEach((classObj, index) => {
      console.log(`Class ${index} - classObject:`, classObj.classObject);
    });

    const listOfCourses = completeSchedule.map((classObj) => {
      const { classObject } = classObj;

      // Debugging: Log each courseID
      console.log("Mapping courseID:", classObject.courseID);

      return {
        courseID: classObject.courseID, // Ensure this is defined
        courseName: classObject.courseName,
        credits: parseInt(classObject.credits, 10),
        date: classObject.date.join(", "),
        startPeriod:
          classObject.startPeriod.length > 0 ? classObject.startPeriod[0] : 0,
        periodsCount:
          classObject.periodsCount.length > 0 ? classObject.periodsCount[0] : 0,
        location: classObject.location.join(", "),
        lecturer: classObject.lecturer.join(", "),
        isActive: classObject.isActive,
      };
    });

    // Additional Debugging: Check listOfCourses before API call
    console.log("List of Courses to be sent:", listOfCourses);

    const payload = {
      studentId, // Ensure this matches the expected type (e.g., string or number)
      schedulerId, // Ensure this matches the expected type (e.g., string or number)
      listOfCourses,
    };
    console.log("API Payload:", payload);

    try {
      const response = await api.createNewSchedule(payload); // Pass payload directly
      console.log("Schedule saved successfully:", response);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };
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
      <button
        onClick={handleSave}
        className="mt-2 text-indigo-400 hover:text-indigo-600"
      >
        <FontAwesomeIcon icon={faBookmark} /> Save Schedule
      </button>
    </div>
  );
};

function populateSchedule(completeSchedule: CompleteSchedule) {
  const rowsProps: CellProps[][] = initTable();

  for (const { classObject, color } of completeSchedule) {
    const { courseName, startPeriod, periodsCount, location, lecturer } =
      classObject;
    const dates = _extractDates(classObject); // use dates array to know if we need 1 or 2 rows.

    dates.forEach((date, index) => {
      for (let row = 0; row < periodsCount[index]; row++) {
        const oldCellProps = rowsProps[startPeriod[index] - 1 + row][date + 1];
        let newCellProps: CellProps;
        if (row == 0) {
          // Edit top cell and set rowSpan
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
          // Hide all bottom cells to top cell to span downwards
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

    // borderStyle solves 2 problems:
    // prevent borders from overlapping with classes card
    // prevent borders from overflowing outside of table for rounded corners
    let borderStyle = "border-slate-300";

    if (period != last_period) {
      borderStyle = (period == 5 ? "border-b-4 " : "border-b ") + borderStyle;
    }

    // Periods Column
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

    // Empty 7 empty columns
    for (let day = 0; day < DAY_PER_WEEK; day++) {
      cellsProps.push({
        children: "",
        className: (day != 6 ? "border-r " : "") + borderStyle,
      });
    }
    rowsProps.push(cellsProps);
  }
  return rowsProps;
}

export default ScheduleTable;
