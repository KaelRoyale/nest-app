import { Module, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { User, UserDocument, UserSchema } from './user.schema';
import * as bcrypt from "bcrypt";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: User.name,
      useFactory: () => {
        const schema = UserSchema;
        schema.pre<UserDocument>('save', function (next) {
          let user = this;
          if (!this.isModified('password')) {
            return next();
          }
          // Generate a salt and use it to hash the user's password
          bcrypt.genSalt(10, (err, salt) => {

            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) return next(err);
              user.password = hash;
              next();
            });
          });
        });
        return schema;
      },
    }
    ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
