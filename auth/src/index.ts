import mongoose from 'mongoose';
import { app } from './app'


const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defind')
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defind in auth service')
  try {
    await mongoose.connect(process.env.MONGO_URI) //from mongo docker container
    console.log('connected to mongo db')
  } catch (err) {
    console.log(err)
  }
  app.listen(3000, () => {
    console.log('app is runnig on port 3000')
  })
}


start()
