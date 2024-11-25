import React, { useState } from "react";
import {
  parseClassInput,
  CourseObject,
  CoursesMap,
  ClassObject,
} from "../../lib/classInput";

interface ClassRowProps {
  classItem: ClassObject;
  courseName: string;
  onDeleteClass: (courseName: string, classId: string) => void;
  onToggleSelectClass: (courseName: string, classId: string) => void;
  isSelected: boolean;
}

const ClassRow: React.FC<ClassRowProps> = ({
  classItem,
  courseName,
  onDeleteClass,
  onToggleSelectClass,
  isSelected,
}) => {
  return (
    <>
      {classItem.date.map((date, subIndex) => (
        <tr key={`${courseName}-${subIndex}`}>
          <td className="py-2 px-4 text-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelectClass(courseName, classItem.id)}
            />
          </td>
          <td className="py-2 px-4 text-center">{date}</td>
          <td className="py-2 px-4 text-center">{classItem.startPeriod[subIndex]}</td>
          <td className="py-2 px-4 text-center">{classItem.periodsCount[subIndex]}</td>
          <td className="py-2 px-4 text-center">{classItem.lecturer[subIndex]}</td>
          <td className="py-2 px-4 text-center">{classItem.location[subIndex]}</td>
          <td className="py-2 px-4 text-center">
            <button
              onClick={() => onDeleteClass(courseName, classItem.id)}
              className="p-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

const CourseTable: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [courses, setCourses] = useState<CourseObject[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const coursesMap: CoursesMap = parseClassInput(inputText, "chromium");
      const newCourses = Array.from(coursesMap.values());

      setCourses((prevCourses) => {
        const coursesByName = new Map(prevCourses.map((c) => [c.name, c]));

        newCourses.forEach((newCourse) => {
          const existingCourse = coursesByName.get(newCourse.name);

          if (existingCourse) {
            newCourse.classesMap.forEach((classObj, classId) => {
              if (!existingCourse.classesMap.has(classId)) {
                existingCourse.classesMap.set(classId, classObj);
              }
            });
          } else {
            coursesByName.set(newCourse.name, newCourse);
          }
        });

        return Array.from(coursesByName.values());
      });

      setInputText("");
    } catch (error) {
      alert("Failed to parse input data. Please check your input format.");
      console.error(error);
    }
  };

  const handleDeleteCourse = (courseName: string) => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.name !== courseName)
    );
  };

  const handleDeleteClass = (courseName: string, classId: string) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) => {
        if (course.name === courseName) {
          const updatedClassesMap = new Map(course.classesMap);
          updatedClassesMap.delete(classId);
          return { ...course, classesMap: updatedClassesMap };
        }
        return course;
      });

      return updatedCourses;
    });
  };

  const handleToggleSelectClass = (courseName: string, classId: string) => {
    setSelectedClasses((prevSelected) => {
      const updated = new Set(prevSelected);
      const identifier = `${courseName}-${classId}`;
      if (updated.has(identifier)) {
        updated.delete(identifier);
      } else {
        updated.add(identifier);
      }
      return updated;
    });
  };

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
                <th className="py-2 px-4">Select</th>
                <th className="py-2">Date</th>
                <th className="py-2">Start Period</th>
                <th className="py-2">No. Periods</th>
                <th className="py-2">Lecturer</th>
                <th className="py-2">Location</th>
                <th className="py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-gray-200">
                      <td className="py-2 px-4 text-center" colSpan={7}>
                        <strong>{course.name}</strong>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleDeleteCourse(course.name)}
                          className="p-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {Array.from(course.classesMap.values()).map((classItem) => (
                      <ClassRow
                        key={classItem.id}
                        classItem={classItem}
                        courseName={course.name}
                        onDeleteClass={handleDeleteClass}
                        onToggleSelectClass={handleToggleSelectClass}
                        isSelected={selectedClasses.has(`${course.name}-${classItem.id}`)}
                      />
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500">
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

export default CourseTable;
