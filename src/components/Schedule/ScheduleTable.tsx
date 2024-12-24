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
import {useState} from "react";
import Login from "../Login_Register/login.tsx";
import Register from "../Login_Register/register.tsx";

interface ScheduleTableProps {
  completeSchedule: CompleteSchedule;
  center: boolean;

}

const ScheduleTable = ({ completeSchedule, center }: ScheduleTableProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false); // State for Login modal
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false); // State for Register modal
  const rowsProps: CellProps[][] = populateSchedule(completeSchedule);

  const handleSave = async () => {
    const api = new Api();
    const studentId = localStorage.getItem("student_id") || undefined;

    if (!studentId) {
      toast.warn("Please login to save your schedule.", { autoClose: 3000 });
      setIsLoginOpen(true);
      return;
    }

    // Thêm log kiểm tra dữ liệu đầu vào
    console.log("Complete Schedule:", completeSchedule);

    // Lọc và tạo danh sách khóa học hợp lệ
    const listOfCourses = completeSchedule.flatMap((classObj) => {
      const { classObject } = classObj;
      const {
        courseID,
        courseName,
        credits,
        date,
        startPeriod,
        periodsCount,
        location,
        lecturer,
        isActive,
        isLab,
      } = classObject;

      // Kiểm tra nếu thiếu bất kỳ trường nào
      if (
          !courseID ||
          !courseName ||
          !credits ||
          !Array.isArray(date) ||
          !Array.isArray(startPeriod) ||
          !Array.isArray(periodsCount) ||
          !Array.isArray(location) ||
          !Array.isArray(lecturer) ||
          date.length === 0 ||
          startPeriod.length === 0 ||
          periodsCount.length === 0 ||
          location.length === 0 ||
          lecturer.length === 0
      ) {
        console.warn("Invalid classObject detected and skipped:", classObject);
        return [];
      }

      // Chuyển đổi `credits` sang số
      const creditsValue = Number(credits);
      if (isNaN(creditsValue)) {
        console.warn(`Invalid credits value for course ${courseID}: ${credits}`);
        return [];
      }

      // Chuyển đổi ngày sang tiếng Việt
      const dayMapping: { [key: string]: string } = {
        Mon: "Thứ Hai",
        Tue: "Thứ Ba",
        Wed: "Thứ Tư",
        Thu: "Thứ Năm",
        Fri: "Thứ Sáu",
        Sat: "Thứ Bảy",
        Sun: "Chủ Nhật",
      };
      const vietnameseDates = date.map((day) => dayMapping[day] || day);

      // Trả về mảng khóa học
      return vietnameseDates.map((day, index) => ({
        courseID,
        courseName,
        credits: creditsValue,
        date: [day],
        startPeriod: [startPeriod[index]],
        periodsCount: [periodsCount[index]],
        location: [location[index]],
        lecturer: [lecturer[index]],
        isActive,
        isLab,
      }));
    });

    // Kiểm tra nếu không có khóa học hợp lệ
    if (listOfCourses.length === 0) {
      toast.warn("No valid courses found to save.", { autoClose: 3000 });
      return;
    }

    // Tạo payload API
    const payload: scheduleRequest = {
      studentId: studentId,
      templateId: null,
      // listOfCourses,
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
            <FontAwesomeIcon icon={faBookmark}/> Save Schedule
          </button>

        {/* Render Login Modal */}
        {isLoginOpen && (
            <Login
                onLoginSuccess={() => {
                  setIsLoginOpen(false); // Close login modal on success
                }}
            />
        )}

        {/* Render Register Modal */}
        {isRegisterOpen && (
            <Register
                onRegisterSuccess={() => {
                  setIsRegisterOpen(false); // Close register modal on success
                }}
            />
        )}
      </div>
  );
};
function populateSchedule(completeSchedule: CompleteSchedule) {
  const rowsProps: CellProps[][] = initTable();

  // Map English days to Vietnamese days
  const dayMapping: { [key: string]: string } = {
    Mon: "Thứ Hai",
    Tue: "Thứ Ba",
    Wed: "Thứ Tư",
    Thu: "Thứ Năm",
    Fri: "Thứ Sáu",
    Sat: "Thứ Bảy",
    Sun: "Chủ Nhật",
  };

  for (const { classObject, color } of completeSchedule) {
    const {
      courseName,
      startPeriod,
      periodsCount,
      location,
      lecturer,
      date,
    } = classObject;

    // Kiểm tra nếu có nhiều giá trị khác nhau trong cùng một lớp
    if (
        new Set(date).size > 1 ||
        new Set(location).size > 1 ||
        new Set(lecturer).size > 1 ||
        new Set(startPeriod).size > 1 ||
        new Set(periodsCount).size > 1
    ) {
      classObject.isLab = true;
    }

    const dates = _extractDates(classObject);

    dates.forEach((date, index) => {
      const vietnameseDate = dayMapping[date] || date;

      const startPeriodValue = Number(startPeriod[index]);
      const periodsCountValue = Number(periodsCount[index]);

      for (let row = 0; row < periodsCountValue; row++) {
        const oldCellProps = rowsProps[startPeriodValue - 1 + row][date + 1];
        let newCellProps: CellProps;
        if (row == 0) {
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
            rowSpan: periodsCountValue,
          };
        } else {
          newCellProps = {
            ...oldCellProps,
            className: "hidden",
          };
        }
        rowsProps[startPeriodValue - 1 + row][vietnameseDate + 1] = newCellProps;
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
