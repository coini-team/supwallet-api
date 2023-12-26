import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Local Dependencies.
import { StatusEnum } from '../../../shared/enums/status.enum';
import { Network } from './network.entity';
import { Crypto } from './crypto.entity';

@Entity()
export class CryptoNetwork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  contract: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @ManyToOne(() => Network)
  @JoinColumn({ name: 'network_id' })
  network: Network;

  @ManyToOne(() => Crypto, (crypto) => crypto.cryptoNetworks)
  @JoinColumn({ name: 'crypto_id' })
  crypto: Crypto;
}
