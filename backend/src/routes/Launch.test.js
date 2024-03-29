require('dotenv').config()
const request = require('supertest');
const app = require('../app');
const { 
  connectMongoDB,
  disconnectMongoDB,
} = require('../services/connect_mongo');
const {
  loadPlanetsData,
} = require('../data/PlanetData');

describe('Launches API', () => {
  beforeAll(async () => {
    await connectMongoDB();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await disconnectMongoDB();
  });

  // describe('Test GET /launch', () => {
  //   test('It should respond with 200 success', async () => {
  //     const response = await request(app)
  //       .get('/v1/launch?page=1&limit=10')
  //       .expect('Content-Type', /json/)
  //       .expect(200);
  //   });
  // });
  
  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028',
    };
  
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    };
  
    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'zoot',
    };
  
    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launch')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);
  
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
  
      expect(response.body).toMatchObject(launchDataWithoutDate);
      console.log("exit")
    });
  
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launch')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launch')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});