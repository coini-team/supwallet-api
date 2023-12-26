// Third Party Dependencies.
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

// Local Dependencies.
import { StatusEnum } from '../../../shared/enums/status.enum';
import { Chain } from './chain.entity';

@Entity()
export class Network {
  @PrimaryColumn()
  id: number;

  @Column({ length: 25 })
  name: string;

  @Column({ length: 50 })
  icon: string;

  @Column({ length: 20 })
  rpc_chain_name: string;

  @Column({ length: 10 })
  rpc_chain_id: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: string;

  @ManyToOne(() => Chain, (chain) => chain.networks)
  @JoinColumn({ name: 'chain_id' })
  chain: Chain;
}
