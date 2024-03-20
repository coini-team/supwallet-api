import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { Network } from '../../modules/chain/entities/network.entity';

@Entity()
export class Tokens {
    @PrimaryColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'varchar', length: 255 })
    symbol: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 6 })
    amount: number;

    @ManyToOne(() => User, user => user.tokens)
    user: User;

    @ManyToOne(() => Network, network => network.tokens)
    network: Network;
}