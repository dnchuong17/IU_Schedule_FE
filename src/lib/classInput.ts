import { WeekDate } from "./schedule";
type Browser = "firefox" | "chromium";

export interface ClassObject {
  id: string;
  courseID: string;
  courseName: string;
  credits: string;
  date: WeekDate[];
  startPeriod: number[];
  periodsCount: number[];
  location: string[];
  lecturer: string[];
  isActive: boolean;
  isLab: boolean;
}

export interface CourseObject {
  id: string;
  name: string;
  color?: string;
  classesMap: ClassesMap;
}

export type ClassesMap = Map<string, ClassObject>;
export type CoursesMap = Map<string, CourseObject>;

const VNToEngDates = new Map<string, WeekDate>(
    Object.entries({
      Hai: "Mon",
      Ba: "Tue",
      Tư: "Wed",
      Năm: "Thu",
      Sáu: "Fri",
      Bảy: "Sat",
      Nhật: "Sun",
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri",
      Sat: "Sat",
      Sun: "Sun",
    })
);

export function _toClassObject(classStrArray: string[]): ClassObject {
  const courseID = classStrArray[0];
  const courseName = classStrArray[2];
  const credits = classStrArray[5];
  console.log("Credits:", credits); // Logging the credits

  const group = classStrArray[3];
  const practice = classStrArray[4];
  const date = classStrArray[11].split(/___/).map((weekDate) => {
    const dateStr = VNToEngDates.get(weekDate);
    if (dateStr === undefined)
      throw Error(
          `Invalid week date format: ${weekDate} in ${classStrArray[11]}`
      );
    return dateStr;
  });
  const startPeriod = classStrArray[12]
      .split(/___/)
      .map((strValue) => parseInt(strValue));
  const periodsCount = classStrArray[13]
      .split(/___/)
      .map((strValue) => parseInt(strValue));
  const location = classStrArray[14].split(/___/);
  const lecturer = classStrArray[15].split(/___/);
  const id = courseID + group + practice;

  // Ensure a course with 2 classes has a pair of each field
  if (date.length != startPeriod.length || date.length != periodsCount.length) {
    throw Error(
        `Missing date or startPeriod or periodsCount: ${classStrArray}`
    );
  }

  return {
    id,
    courseID,
    courseName,
    credits,
    date,
    startPeriod,
    periodsCount,
    location,
    lecturer,
    isActive: false,
    isLab: Array.isArray(courseID) && courseID.length === 2, // Kiểm tra số phần tử trong `courseID`
  };
}

export function _mapCoursesFirefox(parseData: string[]) {
  const step = 17;
  if (parseData.length % step !== 0) {
    throw Error("Failed to match: Missing columns");
  }

  const coursesMap: CoursesMap = new Map();

  for (let i = 0; i < parseData.length; i += step) {
    const classData = parseData.slice(i, i + step);
    const classObject = _toClassObject(classData);
    const courseKey = classObject.courseID;

    let courseObject = coursesMap.get(courseKey);
    if (!courseObject) {
      courseObject = {
        id: courseKey,
        name: classObject.courseName,
        classesMap: new Map(),
      };
      coursesMap.set(courseKey, courseObject);
    }
    courseObject.classesMap.set(classObject.id, classObject);
  }

  // Cập nhật `isLab` nếu có nhiều `courseID` khác nhau
  _updateIsLab(coursesMap);

  return coursesMap;
}

export function _mapCoursesChromium(parseData: string[]) {
  const step = 11;
  if (parseData.length % step !== 0) {
    throw Error("Failed to match: Missing columns");
  }

  const coursesMap: CoursesMap = new Map();

  for (let i = 0; i < parseData.length; i += step) {
    let classData = parseData.slice(i, i + step);
    classData = _splitDataChromium11to17(classData);
    classData = _fillOptionalFields(classData);

    const classObject = _toClassObject(classData);
    const courseKey = classObject.courseID;

    let courseObject = coursesMap.get(courseKey);
    if (!courseObject) {
      courseObject = {
        id: courseKey,
        name: classObject.courseName,
        classesMap: new Map(),
      };
      coursesMap.set(courseKey, courseObject);
    }
    courseObject.classesMap.set(classObject.id, classObject);
  }

  // Cập nhật `isLab` nếu có nhiều `courseID` khác nhau
  _updateIsLab(coursesMap);

  return coursesMap;
}

function _updateIsLab(coursesMap: CoursesMap) {
  for (const courseObject of coursesMap.values()) {
    const uniqueClasses = new Set<string>();
    for (const classObject of courseObject.classesMap.values()) {
      // Tạo một chuỗi đại diện cho các thuộc tính để so sánh
      const classSignature = JSON.stringify({
        date: classObject.date,
        location: classObject.location,
        lecturer: classObject.lecturer,
        startPeriod: classObject.startPeriod,
        periodsCount: classObject.periodsCount,
      });
      uniqueClasses.add(classSignature);
    }

    // Nếu có nhiều lớp khác nhau, gán isLab = true
    const isLab = uniqueClasses.size > 1;
    for (const classObject of courseObject.classesMap.values()) {
      classObject.isLab = isLab;
    }
  }
}



function _splitDataChromium11to17(classData: string[]) {
  const classInfoClump = classData.pop();
  if (classInfoClump == undefined)
    throw new Error("Failed to match: Missing columns");

  const groupedClump = classInfoClump.replaceAll(/(\*___)+/g, "* ");
  const parsedClassInfo = groupedClump.split(/[ "]+/);
  return classData.concat(parsedClassInfo);
}

export function _fillOptionalFields(classData: string[]) {
  const missingCount = 17 - classData.length;
  if (missingCount == 0) {
    return classData;
  }

  let hasLab = false;
  let hasWeekDate = false;
  let hasLocation = false;
  let hasLecturer = false;

  for (let i = 2; i <= 7 - missingCount; i++) {
    const value = classData.at(-i);
    if (value == undefined) throw new Error("Failed to match: Missing columns");

    if (value.match(/^([\d/-]+(___[\d/-]+)?)$/)) {
      continue;
    } else if (!hasLab && value.match(/^[*\s]?$/)) {
      hasLab = true;
    } else if (
        !hasWeekDate &&
        value.split(/___/).filter((weekDate) => VNToEngDates.has(weekDate)).length
    ) {
      hasWeekDate = true;
    } else if (!hasLecturer && value.match(/^[^\d\s]+$/)) {
      hasLecturer = true;
    } else if (!hasLocation && value.match(/^[^\s]+$/)) {
      hasLocation = true;
    }
  }

  if (!hasWeekDate) {
    throw new Error(`Missing date for class: ${classData}`);
  }

  let ptr = 10;
  return classData
      .slice(0, 10)
      .concat([
        hasLab ? classData[ptr++] : "___",
        classData[ptr++],
        classData[ptr++],
        classData[ptr++],
        hasLocation ? classData[ptr++] : "-___-",
        hasLecturer ? classData[ptr++] : "-___-",
        classData[ptr++],
      ]);
}

export function parseClassInput(rawInputString: string, browser: Browser) {
  const parseData = rawInputString
      .trim()
      .replaceAll(/[\u00a0]/g, " ") // replace invisible characters (U+00a0) with spaces
      .replaceAll(/[ "]{3,}/g, "___") // replace 3 adjacent spaces and double quotes with _
      .replaceAll(/\t \t/g, "\t-___-\t") // add - for blank fields at the * columns (Firefox)
      .split(/[ "]*\t[ "]*/);
  if (browser == "firefox") {
    return _mapCoursesFirefox(parseData);
  } else {
    return _mapCoursesChromium(parseData);
  }
}

export function compressCoursesMap(coursesMap: CoursesMap) {
  const coursesArr = [];
  for (const courseObject of coursesMap.values()) {
    const courseArr = [courseObject.id, courseObject.name];
    const courseIdLen = courseObject.id.length;
    const classesArr = [];
    for (const classObject of courseObject.classesMap.values()) {
      const classArr = [
        classObject.id.substring(courseIdLen),
        classObject.date.join("_"),
        classObject.startPeriod.join("_"),
        classObject.periodsCount.join("_"),
        classObject.location.join("_"),
        classObject.lecturer.join("_"),
      ];
      classesArr.push(classArr.join(")"));
    }
    courseArr.push(classesArr.join("("));
    coursesArr.push(courseArr.join("*"));
  }
  return coursesArr.join("!");
}

export function decompressCoursesStr(
    coursesStr: string,
    isActive: boolean = false
): CoursesMap {
  const coursesMap: CoursesMap = new Map();
  try {
    const coursesArr = coursesStr.split(/!/);
    for (const courseStr of coursesArr) {
      const courseArr = courseStr.split(/\*/);
      const classesArr = courseArr.at(-1)?.split(/\(/);
      if (!classesArr)
        throw new Error("Failed to parse: The given URL is invalid.");

      const classesMap: ClassesMap = new Map();
      coursesMap.set(courseArr[0], {
        id: courseArr[0],
        name: courseArr[1],
        classesMap,
      });

      for (const classStr of classesArr) {
        const classArr = classStr.split(/\)/);
        const classId = courseArr[0] + classArr[0]; // courseID + group + practice

        // Determine if the class is a lab
        const isLab = classArr[0].toLowerCase().includes("lab");

        // Add the class object to the map
        classesMap.set(classId, {
          id: classId,
          courseID: courseArr[0],
          courseName: courseArr[1],
          isActive,
          credits: "3",
          date: classArr[1].split("_") as WeekDate[],
          startPeriod: classArr[2].split("_").map((v) => Number(v)),
          periodsCount: classArr[3].split("_").map((v) => Number(v)),
          location: classArr[4].split("_"),
          lecturer: classArr[5].split("_"),
          isLab, // Add the isLab property
        });
      }
    }
  } catch (error) {
    throw new Error("Failed to parse: The given URL is invalid.");
  }
  return coursesMap;
}
