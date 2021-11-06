import * as mongoose from 'mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config'


export const databaseProviders = [
  {
    imports: [ConfigModule.forRoot({
      expandVariables: true
    })],
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_URL')
      
    }),
    inject: [ConfigService]
  }
];