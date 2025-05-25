import request from 'supertest';

export const api = request(`http://localhost:${process.env.PORT}/api`);
