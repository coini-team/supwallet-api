import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { walletStatus } from 'src/shared/enums/wallet-status.enum';
import { walletType } from 'src/shared/enums/wallet-type.enum';

@Entity()
export class ReceiverWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  address: string;

  @Column({
    type: 'enum',
    enum: walletType,
  })
  type: string;

  @Column({
    type: 'enum',
    enum: walletStatus,
    default: walletStatus.ACTIVE,
  })
  status: string;
}
