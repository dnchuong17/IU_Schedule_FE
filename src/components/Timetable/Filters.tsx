{/* import React, { ChangeEvent, FormEvent, useState } from "react";
import { ClassObject, _toClassObject } from "../../lib/classInput";

const Filters: React.FC = () => {
  const [inputText, setInputText] = useState<string>(""); // Input state
  const [courses, setCourses] = useState<ClassObject[]>([]); // Courses list state

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value); 
    // add a comment
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const courseEntries = inputText.split("\t").filter(Boolean); // Split and filter
      const newCourse = _toClassObject(courseEntries);

      setCourses((prevCourses) => [...prevCourses, newCourse]);
      setInputText(""); // Clear input field
    } catch (error) {
      alert((error as Error).message); // Display error message
    }
  };

  const CourseRow: React.FC<{ course: ClassObject }> = ({ course }) => (
    <>
      {course.date.map((date, i) => (
        <tr className="text-center" key={`${course.id}-${i}`}>
          <td>{date}</td>
          <td>{course.startPeriod[i]}</td>
          <td>{course.periodsCount[i]}</td>
          <td>{course.lecturer[i]}</td>
          <td>{course.location[i]}</td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="flex flex-col w-full max-w-screen-lg gap-4">
        <form onSubmit={handleSubmit} className="py-5 rounded bg-white">
          <div className="flex items-center space-x-4">
            <label htmlFor="rawInputString" className="font-semibold">
              Paste courses table here:
            </label>
            <input
              id="rawInputString"
              className="flex-grow p-2 border rounded"
              type="text"
              value={inputText}
              onChange={handleInputChange}
            />
            <button type="submit" className="p-2 bg-sky-400 text-white rounded">
              Add 
            </button>
          </div>
        </form>
        <div className="w-full max-w-screen-lg overflow-auto rounded shadow">
          <table className="w-full min-w-[50rem] table-fixed bg-white rounded-lg">
            <thead className="bg-sky-400 text-white">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Start Period</th>
                <th className="py-2">No. Periods</th>
                <th className="py-2">Lecturer</th>
                <th className="py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-gray-200">
                      <td colSpan={5} className="font-bold text-center">
                        {course.courseName}
                      </td>
                    </tr>
                    <CourseRow course={course} />
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500">
                    No courses have been added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Filters;
/*}*/}