import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISession } from '@satont/grammy-typeorm-storage'

@Entity()
export class Session implements ISession {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('varchar')
  key: string

  @Column('text')
  value: string
}
