import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'users',
};

const UserWordSchema = new mongoose.Schema({
  _wordId: mongoose.Schema.Types.ObjectId,
  examples: [String],
});

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, lowercase: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  favourite: {type: [UserWordSchema], required: false},
  memorized: {type: [UserWordSchema], required: false},
}, opts);

UserSchema.methods.generateAuthToken = async function() {
  console.log('toString: ', this._id.toString());
  const token = jwt.sign(
      {_id: this._id.toString()}, JWT_SECRET_KEY, {expiresIn: '10h'});
  return token;
};

UserSchema.statics.findByCredentials =
  async (email: string, password:string) => {
    const user = await userModel.findOne({email});
    if (!user) {
      throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return user;
  };


const userModel = mongoose.model('UserSchema', UserSchema);

export {userModel};
