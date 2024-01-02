import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  status: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
