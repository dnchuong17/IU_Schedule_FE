import { FunnelIcon } from "@heroicons/react/24/solid";
import { CoursesMap } from "../../lib/classInput";
import {
  CompleteSchedule,
  generateSchedule,
  mapToCompleteSchedule,
} from "../../lib/schedule";
import { useDeferredValue, useEffect, useState } from "react";
import Pagination from "../Timetable/Pagination";
import ScheduleTable from "./ScheduleTable";

interface ScheduleTablesProps {
  coursesMap: CoursesMap;
}

const ScheduleTables = ({ coursesMap }: ScheduleTablesProps) => {
  const deferredCoursesMap = useDeferredValue(coursesMap);
  const [, setHref] = useState<string>("");
  const [noAdjacent, setNoAdjacent] = useState<boolean>(true);
  const [hasAnyActive, setHasAnyActive] = useState<boolean>(false);
  const [minFreeDays, setMinFreeDays] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [schedulesJSX, setSchedulesJSX] = useState<JSX.Element[]>([]);
  const [page, setPage] = useState<number>(1);
  const [completeSchedules, setCompleteSchedules] = useState<
    CompleteSchedule[]
  >([]);

  useEffect(() => {
    setHref(window.location.href);
  }, [deferredCoursesMap]);

  useEffect(() => {
    if (!deferredCoursesMap.size) {
      setCompleteSchedules([]);
      setPage(1);
      return;
    } else {
      const { schedules, hasAnyActive } = generateSchedule(
        deferredCoursesMap,
        noAdjacent,
        minFreeDays
      );
      setHasAnyActive(hasAnyActive);
      console.log("hasAnyActive:", hasAnyActive); // Log the value

      setCompleteSchedules(
        schedules.map((schedule) =>
          mapToCompleteSchedule(deferredCoursesMap, schedule)
        )
      );
      setPage(1);
    }
  }, [deferredCoursesMap, noAdjacent, minFreeDays]);

  useEffect(() => {
    setSchedulesJSX(
      completeSchedules
        .slice((page - 1) * perPage, page * perPage)
        .map((completeSchedule, index, array) => (
          <ScheduleTable
            key={(page - 1) * perPage + index}
            completeSchedule={completeSchedule}
            center={array.length % 2 == 1 && index == array.length - 1}
          ></ScheduleTable>
        ))
    );
  }, [completeSchedules, page, perPage]);

  const debounceBlur = debounce<[HTMLInputElement]>(
    (target: HTMLInputElement) => target.blur(),
    1000
  );

  return (
    <section className="flex w-full max-w-screen-lg flex-col gap-8 xl:grid xl:max-w-none xl:grid-cols-2">
      <div
        className="flex w-full items-center whitespace-nowrap rounded
        py-4 px-3 text-slate-900 shadow xl:col-span-2 xl:mx-auto xl:max-w-screen-lg"
      >
        <div className="flex items-center gap-2 overflow-x-auto">
          <FunnelIcon className="h-4 shrink-0 text-sky-500"></FunnelIcon>
          <label htmlFor="noAdjacent">No adjacent classes:</label>
          <input
            className="h-[18px] w-[18px] rounded border border-slate-300
          text-sky-500 shadow shadow-slate-300 transition-colors hover:text-sky-300 
          focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
            type="checkbox"
            name="noAdjacent"
            id="noAdjacent"
            onChange={() => {
              setNoAdjacent((noAdjacent) => !noAdjacent);
            }}
            checked={noAdjacent}
          />

          <label htmlFor="minFreeDays" className="ml-5">
            Minimum free days:
          </label>
          <input
            className="w-16 rounded border border-slate-300
        focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
            type="number"
            name="minFreeDays"
            id="minFreeDays"
            min="0"
            max="6"
            defaultValue={1}
            onChange={(event) => {
              const target = event.currentTarget;
              target.focus();
              debounceBlur(target);
            }}
            onBlur={(event) => {
              const curVal = event.currentTarget.value;
              event.currentTarget.value = Math.max(
                0,
                Math.min(6, Number(curVal))
              ).toString();
              setMinFreeDays(Number(event.currentTarget.value));
            }}
          />

          <label htmlFor="perPage" className="ml-5">
            Schedules per page:
          </label>
          <input
            className="w-[4.2rem] rounded border border-slate-300
        focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-offset-2"
            type="number"
            name="perPage"
            id="perPage"
            min="2"
            max="20"
            step="2"
            defaultValue={10}
            onChange={(event) => {
              const target = event.currentTarget;
              target.focus();
              debounceBlur(target);
            }}
            onBlur={(event) => {
              const curVal = event.currentTarget.value;
              event.currentTarget.value = Math.max(
                2,
                Math.min(20, ~~(Number(curVal) / 2) * 2)
              ).toString();
              setPage(1);
              setPerPage(Number(event.currentTarget.value));
            }}
          />
        </div>
        {/* <CopyClipboard className="ml-auto pl-5" text={href}>
          <ShareIcon className="h-5 shrink-0 text-white"></ShareIcon>
        </CopyClipboard> */}
      </div>
      <header
        className={`flex w-full items-center gap-2 rounded 
        py-2 px-3 text-white shadow xl:col-span-2 xl:mx-auto xl:max-w-screen-lg ${
          completeSchedules.length
            ? "bg-emerald-400 shadow-emerald-300"
            : hasAnyActive
            ? "bg-yellow-400 shadow-yellow-300"
            : "bg-stone-400 shadow-stone-300"
        }`}
      >
        {/* <GearIcon className="h-4 shrink-0"></GearIcon> */}
        {completeSchedules.length ? (
          <p>
            Schedule(s) generated: <b>{completeSchedules.length}</b>
          </p>
        ) : hasAnyActive ? (
          <p>
            <b>No schedule</b> can be generated from the above combination
          </p>
        ) : (
          <p>
            <b>No courses</b> have been added
          </p>
        )}
      </header>
      {!!completeSchedules.length && (
        <>
          <Pagination
            page={page}
            setPage={setPage}
            pageRange={~~((completeSchedules.length - 1) / perPage) + 1}
          ></Pagination>
          {schedulesJSX}
          <Pagination
            page={page}
            setPage={setPage}
            pageRange={~~((completeSchedules.length - 1) / perPage) + 1}
          ></Pagination>
        </>
      )}
    </section>
  );
};

const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: unknown[]) => {
    const context = () => this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args as T);
    }, wait);
  };
};

export default ScheduleTables;
