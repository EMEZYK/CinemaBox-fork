import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { UserController } from './user.controller';
import { UserService } from './User.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/app/modules/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/app/modules/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/app/modules/auth/guards/jwt-auth.guard';
import { config } from 'dotenv';
import { AuthService } from "src/app/modules/auth/auth.service";

config();

@Module({
  imports: [
    DbModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
