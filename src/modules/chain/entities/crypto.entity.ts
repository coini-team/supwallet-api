// Third Party Dependencies.
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// Local Dependencies.
import { StatusEnum } from '../../../shared/enums/status.enum';
import { CryptoNetwork } from './crypto-network.entity';

@Entity()
export class Crypto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 50 })
  icon: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @OneToMany(() => CryptoNetwork, (cryptoNetwork) => cryptoNetwork.crypto)
  cryptoNetworks: CryptoNetwork[];
}
