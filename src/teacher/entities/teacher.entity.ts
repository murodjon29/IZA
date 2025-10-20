import { Group } from 'src/group/entities/group.entity';
import { ROLE } from 'src/helpers/enum';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.TEACHER })
  role: ROLE;

  @OneToMany(() => Group, (group) => group.teacher)
  groups: Group[];

  @OneToMany(() => Lesson, (lesson) => lesson.teacher)
  lessons: Lesson[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
