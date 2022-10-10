import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper'); // relative path to the file to mock

// setting global property to access signin function
declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
})


beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  // create the Jwt token
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  // build session object {jwt: my_jwt}
  const session = { jwt: token }
  // turn than session into json
  const sessionJson = JSON.stringify(session)
  // take the json and encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64')
  // return a string that the cookie with the encoded data
  return [`session=${base64}`];
}



// afterAll(async () => {
//   if (mongo) {
//     await mongo.stop();
//   }
//   await mongoose.connection.close();
// });