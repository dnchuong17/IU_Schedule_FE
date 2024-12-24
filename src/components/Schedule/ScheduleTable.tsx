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
import { scheduleRequest } from "../../utils/request/scheduleRequest";
interface ScheduleTableProps {
  completeSchedule: CompleteSchedule;
  center: boolean;
}

const ScheduleTable = ({ completeSchedule, center }: ScheduleTableProps) => {
  const rowsProps: CellProps[][] = populateSchedule(completeSchedule);

  // src/components/Schedule/ScheduleTable.ts



  const handleSave = async () => {
    const api = new Api();
    const studentId = localStorage.getItem("student_id") || undefined;

    // Process and flatten the schedule into the desired structure
    const listOfCourses = completeSchedule.flatMap((classObj) => {
      const { classObject } = classObj;

      // Ensure `date` is an array
      const dates = Array.isArray(classObject.date)
          ? classObject.date
          : [classObject.date];

      // Map over the dates to create a flattened structure
      return dates.map((date, index) => {
        const location = Array.isArray(classObject.location)
            ? classObject.location[index] || classObject.location[0]
            : classObject.location;

        const isLab =
            typeof location === "string" && location.includes("LA");

        return {
          courseID: classObject.courseID,
          courseName: classObject.courseName,
          credits: parseInt(classObject.credits, 10),
          date: date,
          startPeriod: classObject.startPeriod[index] || classObject.startPeriod[0],
          periodsCount:
              classObject.periodsCount[index] || classObject.periodsCount[0],
          location: location,
          lecturer: Array.isArray(classObject.lecturer)
              ? classObject.lecturer[index] || classObject.lecturer[0]
              : classObject.lecturer,
          isActive: classObject.isActive,
          isLab: isLab,
        };
      });
    });



    // Debugging: Check the transformed list of courses
    console.log("Transformed List of Courses:", listOfCourses);

    const payload: scheduleRequest = {
      studentId: studentId,
      templateId: null,
      listOfCourses,
    };

    console.log("API Payload:", payload);

    try {
      const response = await api.createNewSchedule(payload);
      console.log("Schedule saved successfully:", response);
      toast.success("Schedule saved successfully!", { autoClose: 3000 });

      const newTemplateId = response.newTemplateId;
      if (newTemplateId) {
        console.log("Received templateId:", newTemplateId);
        localStorage.setItem("templateId", newTemplateId.toString());

        toast.success(
            `Schedule created successfully! Template ID: ${newTemplateId}`,
            { autoClose: 3000 }
        );
      } else {
        toast.error("Schedule created, but no Template ID was returned.", {
          autoClose: 3000,
        });
        console.warn("Template ID is missing in the response:", response);
      }
    } catch (error) {
      console.error("Failed to save schedule:", error);
      toast.error(
          "Failed to save schedule. Please check the console for more details.",
          { autoClose: 3000 }
      );
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
    let borderStyle = "border border-solid border-slate-300";

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