// Third Party Dependencies.
import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

// Local Dependencies.
import { User } from '../../user/entities/user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinColumn()
  users: User[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
