export enum DeadlineType {
    HOMEWORK = "HOMEWORK",
    PROJECT = "PROJECT",
    EXAM = "EXAM",
    LAB = "LAB",
    OTHER = "OTHER",
}

export class DeadlineRequest {
    deadlineType?: DeadlineType;
    priority?: string;
    description?: string;
    deadline?: Date;
    courseValueId?: number;
}
