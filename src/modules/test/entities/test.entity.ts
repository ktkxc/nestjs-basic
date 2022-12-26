import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('zgsy_nest')
export class ZgsyNest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('int')
  views: number;

  @Column()
  ispublished: boolean;

  @Column({ default: () => 'NOW()' })
  createdate: Date;
}
