// Third Party Dependencies.
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Local Dependencies.
import { StatusEnum } from '../../../shared/enums/status.enum';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  address: string;

  @Column({ name: 'private_key', length: 70 })
  privateKey: string;

  @Column({ length: 200 })
  seedphrase: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;
}
