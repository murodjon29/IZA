import { ROLE } from 'src/helpers/enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.ADMIN })
  role: ROLE;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}
