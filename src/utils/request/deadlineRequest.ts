export enum DeadlineType {
  HOMEWORK = "HOMEWORK",
  PROJECT = "PROJECT",
  EXAM = "EXAM",
  LAB = "LAB",
  OTHER = "OTHER",
}
export enum DeadlineConstant {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export class DeadlineRequest {
  deadlineType?: DeadlineType;
  priority?: DeadlineConstant;
  description?: string;
  date?: string;
  courseValueId?: number;
  isActive?: boolean;
}
