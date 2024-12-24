import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  parseClassInput,
  CourseObject,
  CoursesMap,
  ClassObject,
} from "../../lib/classInput";
import { mapColor } from "../../lib/schedule";
import { mergeMaps } from "../../lib/utils";

import {
  //   toggleAllState,
  deleteCourse,
  toggleCourseState,
  getCourseState,
  //   toggleClassState,
  deleteClass,
} from "../../lib/courseAndClassUtils";

interface ClassRowProps {
  classItem: ClassObject;
  courseId: string;
  onDeleteClass: (courseId: string, classId: string) => void;
  onToggleSelectClass: (courseId: string, classId: string) => void;
  isSelected: boolean;
}

const ClassRow: React.FC<ClassRowProps> = ({
  classItem,
  courseId,
  onDeleteClass,
  onToggleSelectClass,
  isSelected,
}) => {
  return (
    <>
      {classItem.date.map((date, subIndex) => (
        <tr
          key={`${courseId}-${subIndex}`}
          className="border border-solid border-b border-slate-200"
        >
          <td className="py-2 px-4 text-center border border-solid border-r-1 border-slate-200">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelectClass(courseId, classItem.id)}
            />
          </td>
          <td className="py-2 px-4 text-center">{date}</td>
          <td className="py-2 px-4 text-center">
            {classItem.startPeriod[subIndex]}
          </td>
          <td className="py-2 px-4 text-center">
            {classItem.periodsCount[subIndex]}
          </td>
          <td className="py-2 px-4 text-center">
            {classItem.lecturer[subIndex]}
          </td>
          <td className="py-2 px-4 text-center">
            {classItem.location[subIndex]}
          </td>
          <td className="py-2 px-4 text-center border border-solid border-r-1 border-slate-200">
            <button
              onClick={() => onDeleteClass(courseId, classItem.id)}
              className="p-1 text-black rounded"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

interface CourseTableProps {
  coursesMap: CoursesMap;
  onSelectionChange: (updatedCoursesMap: CoursesMap) => void;
  setCoursesMap: React.Dispatch<React.SetStateAction<CoursesMap>>;
}

const CourseTable: React.FC<CourseTableProps> = ({
  coursesMap,
  onSelectionChange,
  setCoursesMap,
}) => {
  const [inputText, setInputText] = useState<string>("");
  // const [, setCourses] = useState<CourseObject[]>([]);

  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set()
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const parsedCoursesMap: CoursesMap = parseClassInput(
        inputText,
        "chromium"
      );
      console.log("Parsed CoursesMap:", parsedCoursesMap); // Debugging

      setCoursesMap((prevCoursesMap) => {
        const updatedCoursesMap = new Map(prevCoursesMap);
        mapColor(mergeMaps(prevCoursesMap, updatedCoursesMap));

        parsedCoursesMap.forEach((course, id) => {
          if (updatedCoursesMap.has(id)) {
            const existingCourse = updatedCoursesMap.get(id)!;
            course.classesMap.forEach((classObj, classId) => {
              if (!existingCourse.classesMap.has(classId)) {
                existingCourse.classesMap.set(classId, classObj);
              }
            });
          } else {
            updatedCoursesMap.set(id, course);
          }
        });
        return updatedCoursesMap;
      });

      // Notify parent about the update
      // onSelectionChange(parsedCoursesMap);

      // Clear the input field after adding
      setInputText("");
    } catch (error) {
      alert("Failed to parse input data. Please check your input format.");
      console.error(error);
    }
  };
  //--new code
  const toggleAllStateHandler = () => {
    setCoursesMap((prevCoursesMap) => {
      const updatedCoursesMap = new Map(prevCoursesMap);

      // Determine if all courses are currently selected
      const allSelected = Array.from(updatedCoursesMap.values()).every(
        (course) => getCourseState(course)
      );

      // New state is the opposite of current allSelected
      const newState = !allSelected;
      const allClassIds: string[] = [];

      // Toggle each course to the new state
      updatedCoursesMap.forEach((course) => {
        toggleCourseState(updatedCoursesMap, course, newState);
        course.classesMap.forEach((classObj) => {
          classObj.isActive = newState;
          allClassIds.push(classObj.id);
        });
      });

      // Update selectedClasses based on newState
      setSelectedClasses(() => {
        if (newState) {
          // Select all class IDs
          const allClassIds = Array.from(updatedCoursesMap.values()).flatMap(
            (course) => Array.from(course.classesMap.keys())
          );
          return new Set(allClassIds);
        } else {
          // Deselect all classes
          return new Set();
        }
      });
      mapColor(updatedCoursesMap);
      return updatedCoursesMap;
    });
  };

  const deleteAllHandler = () => {
    onSelectionChange(new Map());
  };

  // const getCourseStateHandler = (courseObject: CourseObject) => {
  //   return getCourseState(courseObject);
  // };

  // Toggle the state of a specific course
  const toggleCourseStateHandler = (courseId: string) => {
    setCoursesMap((prevCoursesMap) => {
      const updatedCoursesMap = new Map(prevCoursesMap);
      const course = updatedCoursesMap.get(courseId);
      if (course) {
        const newState = toggleCourseState(updatedCoursesMap, course);
        course.classesMap.forEach((classObj) => {
          classObj.isActive = newState;
        });

        // Update selectedClasses based on newState
        setSelectedClasses((prevSelected) => {
          const updatedSelected = new Set(prevSelected);
          Array.from(course.classesMap.keys()).forEach((classId) => {
            if (newState) {
              updatedSelected.add(classId);
            } else {
              updatedSelected.delete(classId);
              console.log("Deleted classId:", classId); // Logging classId
            }
          });

          return updatedSelected;
        });
      }
      return updatedCoursesMap;
    });
  };

  // Delete a specific course
  const deleteCourseHandler = (courseObject: CourseObject) => {
    const newCoursesMap = new Map(coursesMap);
    deleteCourse(newCoursesMap, courseObject);
    onSelectionChange(newCoursesMap);
    setCoursesMap(newCoursesMap);
  };


  const toggleClassStateHandler = (courseId: string, classId: string) => {
    setCoursesMap((prevCoursesMap) => {
      const updatedCoursesMap = new Map(prevCoursesMap);
      const course = updatedCoursesMap.get(courseId);
      if (course) {
        const classObj = course.classesMap.get(classId);
        if (classObj) {
          // Toggle the 'isActive' state of the class
          classObj.isActive = !classObj.isActive;
          console.log(`Class ID: ${classId}, isActive: ${classObj.isActive}`); // Logging isActive

          // Update selectedClasses based on the new 'isActive' state
          setSelectedClasses((prevSelected) => {
            const updatedSelected = new Set(prevSelected);
            if (classObj.isActive) {
              updatedSelected.add(classId);
            } else {
              updatedSelected.delete(classId);
              console.log("Deleted classId:", classId); // Logging classId
            }
            return updatedSelected;
          });
        }
      }
      return updatedCoursesMap;
    });
  };
  const deleteClassHandler = (courseId: string, classId: string) => {
    const newCoursesMap = new Map(coursesMap);
    const course = newCoursesMap.get(courseId);
    if (course) {
      const classObject = course.classesMap.get(classId);
      if (classObject) {
        deleteClass(newCoursesMap, classObject);
        onSelectionChange(newCoursesMap);
        setCoursesMap(newCoursesMap);
      }
    }
  };

  return (
    <div className="flex justify-center items-start">
      <div className="flex flex-col w-full max-w-screen-lg gap-4">
        <div>
          <form onSubmit={handleSubmit} className=" py-5 rounded bg-white ">
            <div className="col-span-2 flex space-x-5 sm:col-span-1 mb-2">
              <label className="mr-auto font-semibold" htmlFor="rawInputString">
                Paste courses table here:
              </label>
            </div>
            <div className="flex flex-row items-center">
              <input
                className="rounded border border-solid border-gray-300 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-1 mr-4 p-2 flex-grow"
                type="text"
                id="rawInputString"
                value={inputText}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="p-2 px-3 bg-sky-400 text-white rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <div className="w-full max-w-screen-lg overflow-auto rounded shadow">
          <table className="w-full min-w-[50rem] table-fixed bg-white rounded-lg">
            <thead>
              <tr className="bg-sky-400 text-white">
                <th className="py-2 w-1/12">
                  <div className="flex justify-center">
                    <input
                      className="h-4 w-4 rounded border-slate-300 text-sky-500 transition-colors"
                      type="checkbox"
                      name="headerAll"
                      id="headerAll"
                      onChange={toggleAllStateHandler}
                      checked={
                        selectedClasses.size ===
                        Array.from(coursesMap.values()).reduce(
                          (acc, course) => acc + course.classesMap.size,
                          0
                        )
                      }
                    />
                  </div>
                </th>
                <th className="py-2">Date</th>
                <th className="py-2">Start Period</th>
                <th className="py-2">No. Periods</th>
                <th className="py-2">Lecturer</th>
                <th className="py-2">Location</th>
                <th className="py-2 w-16">
                  <button
                    onClick={deleteAllHandler}
                    className="p-1 text-black rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(coursesMap.entries()).length > 0 ? (
                <>
                  {console.log("coursesMap:", coursesMap)}
                  {Array.from(coursesMap.entries()).map(
                    ([courseKey, courseObject]) => (
                      <React.Fragment key={courseKey}>
                        {/* Course Row */}
                        <tr className="animate-in-out bg-green-100">
                          <td className="py-2 px-4 text-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={getCourseState(courseObject)}
                              onChange={() =>
                                toggleCourseStateHandler(courseKey)
                              }
                            />
                          </td>
                          <td className="py-2 px-4 text-center " colSpan={5}>
                            <strong>{courseObject.name}</strong>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <button
                              onClick={() => deleteCourseHandler(courseObject)}
                              className="p-1 text-black rounded"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>

                        {/* Class Rows */}
                        {Array.from(courseObject.classesMap.values()).map(
                          (classObj) => (
                            <ClassRow
                              key={classObj.id}
                              classItem={classObj}
                              courseId={courseKey}
                              onToggleSelectClass={toggleClassStateHandler}
                              onDeleteClass={deleteClassHandler}
                              isSelected={selectedClasses.has(classObj.id)}
                            />
                          )
                        )}
                      </React.Fragment>
                    )
                  )}
                </>
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-3">
                    No courses available.
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
