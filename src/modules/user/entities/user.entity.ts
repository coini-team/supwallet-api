// Third Party Dependencies.
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false, length: 45, type: 'varchar' })
  name: string;

  @Column({ name: 'last_name', nullable: true, length: 45, type: 'varchar' })
  lastName: string;

  @Column({ name: 'email', nullable: true, length: 45, type: 'varchar' })
  email: string;
}
