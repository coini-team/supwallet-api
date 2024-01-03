import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../../shared/enums/status.enum';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organization_id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  mode: string;

  @Column()
  api_key: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
