// test/tareas.e2e-spec.ts

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('TareasController (e2e/integración)', () => {
  let app: INestApplication;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Activar validaciones como en main.ts
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /tareas - debe crear una nueva tarea', async () => {
    const response = await request(app.getHttpServer())
      .post('/tareas')
      .send({
        title: 'Prueba integración',
        content: 'Esta es una tarea creada en el test',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Prueba integración');
    expect(response.body.completed).toBe(false);
    createdId = response.body.id; // Guardamos ID para siguientes pruebas
  });

  it('GET /tareas - debe devolver un array de tareas', async () => {
    const response = await request(app.getHttpServer()).get('/tareas').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /tareas/:id - debe devolver la tarea creada', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tareas/${createdId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdId);
    expect(response.body.title).toBe('Prueba integración');
  });

  it('PUT /tareas/:id - debe actualizar la tarea', async () => {
    const response = await request(app.getHttpServer())
      .put(`/tareas/${createdId}`)
      .send({
        title: 'Tarea modificada',
        content: 'Contenido actualizado',
        completed: true,
      })
      .expect(200);

    expect(response.body.title).toBe('Tarea modificada');
    expect(response.body.completed).toBe(true);
  });

  it('DELETE /tareas/:id - debe eliminar la tarea', async () => {
    await request(app.getHttpServer())
      .delete(`/tareas/${createdId}`)
      .expect(200);

    // Intentamos obtenerla nuevamente → debe fallar
    await request(app.getHttpServer())
      .get(`/tareas/${createdId}`)
      .expect(404);
  });
});
