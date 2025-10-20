export class CreateLessonDto {
  groupId: number;
  teacherId: number;
  date: string;
  startTime?: string;
  endTime?: string;
  topic: string;
}
