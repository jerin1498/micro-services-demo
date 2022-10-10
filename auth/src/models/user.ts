import mongoose from "mongoose";
import {Password} from '../services/password';

interface userAttr {
  email: string,
  password: string
}


interface userModel extends mongoose.Model<UserDoc> {
  build(attrs: userAttr): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string,
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password;
      delete ret.__V;
    }
  }
})

userSchema.statics.build = (attr: userAttr) => {
  return new User(attr)
}

userSchema.pre('save', async function(done) {
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})
const User = mongoose.model<UserDoc, userModel>('User', userSchema)



export {User}