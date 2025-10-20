import { Group } from "src/group/entities/group.entity";
import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne
} from "typeorm";

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  birthYear: number;

  @Column({ unique: true })
  phoneNumber: string;

  @ManyToOne(() => Group, (group) => group.students, {
    eager: true,
    onDelete: 'SET NULL',
  })
  group: Group;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
