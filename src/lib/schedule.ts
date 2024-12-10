import { ClassObject, CoursesMap } from "./classInput";

export interface ClassID {
  courseKey: string;
  classKey: string;
}

export type Schedule = ClassID[];

export type CompleteClass = {
  classObject: ClassObject;
  color: string;
};
export type WeekDate = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const SERIAL_DATE = new Map([
  ["Mon", 0],
  ["Tue", 1],
  ["Wed", 2],
  ["Thu", 3],
  ["Fri", 4],
  ["Sat", 5],
  ["Sun", 6],
]);

export const PERIODS_PER_DAY = 17;

export function _extractDates(classObject: ClassObject) {
  return classObject.date.map((dateStr) => {
    const serialDate = SERIAL_DATE.get(dateStr);
    if (serialDate === undefined) throw Error(`Invalid week date: ${dateStr}`);
    return serialDate;
  });
}
