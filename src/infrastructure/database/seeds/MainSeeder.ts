import { DataSource } from 'typeorm'
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension'



export default class MainSeeder implements Seeder {
  async run(dataSource: DataSource, _: SeederFactoryManager): Promise<any> {
  }
}
