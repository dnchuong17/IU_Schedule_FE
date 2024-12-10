import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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

const CourseTable: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [courses, setCourses] = useState<CourseObject[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [noAdjacent, setNoAdjacent] = useState(false);
  const [minFreeDays, setMinFreeDays] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };
  const handleNoAdjacentChange = () => {
    setNoAdjacent(prev => !prev);
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
        <div>
          <form onSubmit={handleSubmit} className=" py-5 rounded bg-white ">
            <div className="col-span-2 flex space-x-5 sm:col-span-1 mb-2">
              <label className="mr-auto font-semibold" htmlFor="rawInputString">
                Paste courses table here:
              </label>
            </div>
            <div className="flex flex-row items-center">
              <input
                className="rounded border-1 border-gray border-blue-200 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-1 mr-4 p-2 flex-grow"
                type="text"
                id="rawInputString"
                value={inputText}
                onChange={handleInputChange}

              />
              <button type="submit" className="p-2 bg-sky-400 text-white rounded">
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
                      className="h-[21px] w-[21px] rounded border-slate-300 text-sky-500 transition-colors hover-text-sky-300 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
                      type="checkbox"
                      name="headerAll" id="headerAll"
                    />
                  </div>
                </th>
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
                    <tr className="bg-yellow-100">
                      <td className="py-2 px-4 text-center" colSpan={6}>
                        <strong>{course.name}</strong>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleDeleteCourse(course.name)}
                          className="p-1 text-black rounded"
                        >
                          <FontAwesomeIcon icon={faTrash} />
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
                  <td colSpan={6} className="text-center text-gray-500">

                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex w-full items-center whitespace-nowrap rounded py-4 px-3 text-slate-900 shadow xl:col-span-2 xl:mx-auto xl:max-w-screen-lg mt-5">
          <div className="flex items-center gap-2 overflow-x-auto">
            <label htmlFor="noAdjacent">No adjacent classes:</label>
            <input
              type="checkbox"
              id="noAdjacent"
              checked={noAdjacent}
              onChange={handleNoAdjacentChange}
              className="h-4 w-4 rounded border border-slate-300 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
            />
            <label htmlFor="minFreeDays" className="ml-5">Minimum free days:</label>
            <input
              className="w-16 rounded border border-slate-300 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
              type="number"
              name="minFreeDays"
              id="minFreeDays"
              min="0"
              max="6"
              value={minFreeDays}
              onChange={(e) => setMinFreeDays(Number(e.target.value))}
            />
            <label htmlFor="perPage" className="ml-5">Schedules per page:</label>
            <input
              className="w-[4.2rem] rounded border border-slate-300 focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
              type="number"
              name="perPage"
              id="perPage"
              min="2"
              max="20"
              step="1"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            />
          </div>
        </div>
        <header className="flex w-full items-center gap-2 rounded
        py-2 px-3 text-white shadow xl:col-span-2 xl:mx-auto xl:max-w-screen-lg bg-stone-400 shadow-stone-300"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-label="Gear Icon" fill="currentColor" className="h-4 shrink-0"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"></path></svg><p><b>No courses</b> have been added</p></header>

      </div>
    </div>
  );
};

export default CourseTable;
