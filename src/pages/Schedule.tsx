// src/components/Schedule/Schedule.tsx
import React, { useState } from "react";
import CourseTable from "../components/Timetable/CourseTable";
import ScheduleTables from "../components/Schedule/ScheduleTables.tsx";
import { CoursesMap } from "../lib/classInput.ts";
const Schedule: React.FC = () => {
  const [coursesMap, setCoursesMap] = useState<CoursesMap>(new Map());

  const handleSelectionChange = (updatedCoursesMap: CoursesMap) => {
    setCoursesMap(updatedCoursesMap);
  };

  return (
    <div className="schedule-container">
      <CourseTable
        coursesMap={coursesMap}
        setCoursesMap={setCoursesMap}
        onSelectionChange={handleSelectionChange} // Added prop
      />
      <ScheduleTables coursesMap={coursesMap} />
    </div>
  );
};

export default Schedule;
