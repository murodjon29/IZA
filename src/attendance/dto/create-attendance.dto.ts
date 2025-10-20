import { attendanceStatus } from 'src/helpers/enum';

export class CreateAttendanceDto {
  studentId: number;
  lessonId: number;
  status?: attendanceStatus;
}
