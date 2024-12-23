export class scheduleRequest {
  studentId?: string;
  templateId?: number | null;
  listOfCourses?: {
    courseID: string;
    courseName: string;
    credits: number;
    date: string;
    startPeriod: number;
    periodsCount: number;
    location: string;
    lecturer: string;
    isActive: boolean;
    isDeleted?: boolean;
  }[];
}
