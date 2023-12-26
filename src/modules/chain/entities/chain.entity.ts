// Third Party Dependencies.
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

// Local Dependencies.
import { Network } from './network.entity';

@Entity()
export class Chain {
  @PrimaryColumn()
  id: number;

  @Column({ length: 25 })
  name: string;

  @Column({ length: 50 })
  icon: string;

  @OneToMany(() => Network, (network) => network.chain)
  networks: Network[];
}
