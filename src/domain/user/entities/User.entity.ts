import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column()
  email!: string

  @Column()
  password?: string

  @Column()
  bio?: string

  @Column()
  mobile_phone?: string

  @Column()
  avatar_url?: string

  @CreateDateColumn()
  created_at?: Date

  @Column()
  token!: string

  @Column()
  recovery_token?: string

  @Column()
  recovery_expiration_date?: Date
}
