import request from 'supertest'
import { app } from '../app'
import createConnection from '../database'
import { getConnection } from 'typeorm'

describe('Testing integration on Users', () => {
  beforeAll(async() => {
    const connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    const connection = await getConnection()
    await connection.dropDatabase()
    await connection.close()
  })

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users')
    .send({
      email: 'emailexample@gmail.com',
      name: 'User test'
    })
    
    expect(response.status).toBe(201)
  })

  it('Should not be able to create a new user with a exists email', async () => {
    const response = await request(app).post('/users')
    .send({
      email: 'emailexample@gmail.com',
      name: 'User test'
    })
    
    expect(response.status).toBe(400)
  })
})