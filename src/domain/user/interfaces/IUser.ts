import { Company } from '@domain/company/entities/Company.entity'

export default interface IUser {
  name: string
  email: string
  password: string
  bio?: string
  mobile_phone?: string
  avatar_url?: string
  company: Company
}
