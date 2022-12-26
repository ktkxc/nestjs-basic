import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('zgsy_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户名
   */
  @ApiProperty()
  @Column()
  username: string;

  @Column()
  userkey: string;

  @Exclude()
  @Column()
  pwd: string;

  @Column()
  truename: string;

  @Column()
  tx: string;

  @Column({
    default: 0,
  })
  roletype: number;

  @Column()
  mids: string;

  @Column()
  rbuttons: string;

  @Column()
  sids: string;

  @Column()
  sex: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  csrq: Date;
}
