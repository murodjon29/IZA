import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Student } from "src/student/entities/student.entity";
import { attendanceStatus } from "src/helpers/enum";
import { Lesson } from "src/lessons/entities/lesson.entity";


@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Lesson)
  lesson: Lesson;

  @Column({ type: 'enum', enum: attendanceStatus, default: attendanceStatus.PRESENT })
  status: attendanceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
