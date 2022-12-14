import express from 'express'
import 'express-async-errors';
import { json } from 'body-parser'
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { NotFoundError } from '@jhticketss/common'

import { errorHandler } from '@jhticketss/common'

const app = express()

app.set('trust proxy', true)

app.use(json())

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)


//for unhandled routes
app.all('*', async () => {
  throw new NotFoundError()
})

// error handler
app.use(errorHandler)


export { app };