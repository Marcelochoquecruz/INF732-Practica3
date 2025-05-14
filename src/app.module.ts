// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TareasModule } from './tareas/tareas.module';
import { Tarea } from './tareas/entities/tarea.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // Cambia esto si usas contraseña
      database: 'tareas_db',
      entities: [Tarea],
      synchronize: true,
    }),
    TareasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}