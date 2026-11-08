import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { VetsModule } from './vets/vets.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { PetModule } from './pet/pet.module';
import { PetOwnerModule } from './pet-owner/pet-owner.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    UsersModule,
    AuthModule,
    VetsModule,
    PrismaModule,
    MailModule,
    PetModule,
    PetOwnerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
