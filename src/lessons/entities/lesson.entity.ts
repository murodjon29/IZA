import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Group } from 'src/group/entities/group.entity';

@Entity('lesson')
export class Lesson {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Group, (group) => group.lessons, {
    eager: true,
    onDelete: 'SET NULL',
  })
  group: Group;

  @ManyToOne(() => Teacher, (teacher) => teacher.lessons, {
    eager: true,
    onDelete: 'SET NULL',
  })
  teacher: Teacher;

  @Column({ type: 'date' })
  date: string; // Dars sanasi (masalan: 2025-10-20)

  @Column({ type: 'time', nullable: true })
  startTime: string; // Dars boshlanish vaqti

  @Column({ type: 'time', nullable: true })
  endTime: string; // Dars tugash vaqti

  @Column({ type: 'text' })
  topic: string; // Dars mavzusi

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
