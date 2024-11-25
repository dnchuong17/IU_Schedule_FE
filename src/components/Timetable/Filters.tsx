import React, { ChangeEvent, FormEvent, useState } from "react";

interface Course {
  courseName: string;
  date: string;
  startPeriod: string;
  numPeriods: string;
  lecturer: string;
  location: string;
  selected: boolean; // Track if the row is selected
}

const Filters: React.FC = () => {
  const [inputText, setInputText] = useState<string>(""); // State for input
  const [courses, setCourses] = useState<Course[]>([]); // State for course list

  // Handle input field change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload

    const data = inputText.split("|");

    if (data.length >= 13) {
      const newCourse: Course = {
        courseName: data[2] || "N/A", // Assuming course name is at index 2
        date: data[6] || "N/A",
        startPeriod: data[7] || "N/A",
        numPeriods: data[4] || "N/A",
        lecturer: data[11] || "N/A",
        location: data[12] || "N/A",
        selected: false, // Initialize as not selected
      };

      // Add the new course to the list
      setCourses((prevCourses) => [...prevCourses, newCourse]);
    } else {
      alert("Invalid input format. Please try again.");
    }

    setInputText(""); // Clear the input field
  };

  // Toggle the selection of all courses under a specific course name
  const handleGroupSelection = (courseName: string) => {
    const updatedCourses = courses.map((course) => {
      if (course.courseName === courseName) {
        return { ...course, selected: !course.selected }; // Toggle selection
      }
      return course;
    });
    setCourses(updatedCourses);
  };

  // Toggle the selection of a single course
  const handleRowSelection = (index: number) => {
    const updatedCourses = [...courses];
    updatedCourses[index].selected = !updatedCourses[index].selected;
    setCourses(updatedCourses);
  };

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="flex flex-col w-full max-w-screen-lg gap-4">
        {/* Input Form */}
        <div>
          <form onSubmit={handleSubmit} className="py-5 rounded bg-white">
            <div className="col-span-2 flex space-x-5 sm:col-span-1 mb-2">
              <label className="mr-auto font-semibold" htmlFor="rawInputString">
                Paste courses table here:
              </label>
            </div>
            <div className="flex flex-row items-center">
              <input
                className="rounded border-1 border-blue-200 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-1 mr-4 p-2 flex-grow"
                type="text"
                id="rawInputString"
                value={inputText}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="p-2 bg-sky-400 text-white rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="w-full max-w-screen-lg overflow-x-auto overflow-y-hidden rounded shadow shadow-slate">
          <table className="w-full min-w-[50rem] table-fixed bg-white rounded-lg">
            <thead>
              <tr className="bg-sky-400 text-white">
                <th className="py-2 w-1/12">
                  <div className="flex justify-center">
                    <input
                      className="h-[18px] w-[18px] rounded border-2 border-slate-300 text-sky-500 transition-colors hover-text-sky-300 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
                      type="checkbox"
                      name="headerAll"
                      id="headerAll"
                    />
                  </div>
                </th>
                <th className="py-2 w-1/6 font-bold">Date</th>
                <th className="py-2 w-1/6 font-bold">Start Period</th>
                <th className="py-2 w-1/6 font-bold">No. Periods</th>
                <th className="py-2 w-1/6 font-bold">Lecturer</th>
                <th className="py-2 w-1/6 font-bold">Location</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses
                  .reduce((groups, course) => {
                    const group = groups.find(
                      (g) => g.courseName === course.courseName
                    );
                    if (!group) {
                      groups.push({ courseName: course.courseName, items: [course] });
                    } else {
                      group.items.push(course);
                    }
                    return groups;
                  }, [] as { courseName: string; items: Course[] }[])
                  .map((group, index) => (
                    <React.Fragment key={index}>
                      {/* Course Header */}
                      <tr className="bg-gray-200">
                        <td className="py-2">
                          <div className="flex justify-center items-center h-full">
                            <input
                              type="checkbox"
                              className="h-[18px] w-[18px] rounded border border-slate-300"
                              onChange={() => handleGroupSelection(group.courseName)}
                              checked={group.items.every((item) => item.selected)} // All selected if every row is selected
                            />
                          </div>
                        </td>
                        <td className="py-2 font-bold" colSpan={5}>
                          {group.courseName}
                        </td>
                      </tr>

                      {/* Individual Courses */}
                      {group.items.map((course, subIndex) => (
                        <tr key={subIndex} className="text-center">
                          <td className="py-2">
                            <input
                              type="checkbox"
                              className="h-[18px] w-[18px] rounded border border-slate-300"
                              onChange={() =>
                                handleRowSelection(
                                  courses.indexOf(course)
                                )
                              }
                              checked={course.selected}
                            />
                          </td>
                          <td className="py-2">{course.date}</td>
                          <td className="py-2">{course.startPeriod}</td>
                          <td className="py-2">{course.numPeriods}</td>
                          <td className="py-2">{course.lecturer}</td>
                          <td className="py-2">{course.location}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    <b>No courses</b> have been added
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
