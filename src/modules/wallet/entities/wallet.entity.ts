import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { walletStatus } from 'src/shared/enums/wallet-status.enum';

@Entity()
export class CoiniWallet {
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
    enum: walletStatus,
    default: walletStatus.ACTIVE,
  })
  status: string;
}
