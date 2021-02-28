import request from 'supertest'
import createConnection from '../database'
import { app } from '../app'
import { getConnection } from 'typeorm'

describe('Survey', () => {
  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    const connection = await getConnection()
    await connection.dropDatabase()
    await connection.close()
  })

  it('Should be able to create a survey', async() => {
    const response = await request(app).post('/surveys').send({
      title: 'title example',
      description: 'description example'
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('Should be able to show all surveys registereds', async() => {
    await request(app).post('/surveys').send({
      title: 'title example2',
      description: 'description example2'
    })

    const response = await request(app).get('/surveys')

    expect(response.body.length).toBe(2)
  })
})