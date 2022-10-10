import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '@jhticketss/common';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@jhticketss/common';

const router = express.Router()


router.post('/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 char')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('user alerady exist')
      throw new BadRequestError('email is in use')
      // return res.send('this email is taken')
    }
    const user = User.build({ email, password })
    await user.save()

    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!)

    req.session = {
      jwt: userJwt
    }
    return res.status(201).send(user)
  })


export { router as signupRouter }  