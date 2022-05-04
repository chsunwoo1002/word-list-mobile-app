import mongoose, {Schema, Document, Model} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// interface for favourite & memorized array
interface IUserWord {
  _wordId: Schema.Types.ObjectId;
  examples: [string];
}

// interface for user schema
interface IUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  favourite?: [IUserWord];
  memorized?: [IUserWord];
}

// add methods for interface
interface IUserDocument extends IUser, Document {
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
  checkPassword: (password:string) => Promise<boolean>;
  setPassword: (password:string) => Promise<void>;
}

// interface for Model
interface UserModel extends Model<IUserDocument> {
  findByCredentials: (email: string, password:string) => Promise<IUserDocument>;
  findByCredentialsAndDelete: (email:string, password:string) => Promise<void>;
}

// option for scema
const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'users',
};

// schema for user saved words
const UserWordSchema = new mongoose.Schema({
  _wordId: mongoose.Schema.Types.ObjectId,
  examples: [String],
});

// schema for user information
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, lowercase: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  favourite: {type: [UserWordSchema], required: false},
  memorized: {type: [UserWordSchema], required: false},
}, opts);

// method to generate access token
UserSchema.methods.generateAccessToken = async function() {
  const expiresIn = 60 * 15;
  const token = jwt.sign(
      {_id: this._id.toString()}, JWT_SECRET_KEY, {expiresIn});
  return token;
};

// method to generate refresh token
UserSchema.methods.generateRefreshToken = async function() {
  const expiresIn = '90d';
  const token = jwt.sign(
      {_id: this._id.toString()}, JWT_SECRET_KEY, {expiresIn});
  return token;
};

// method to set new password
UserSchema.methods.setPassword = async function(password: string) {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};

// method to check password
UserSchema.methods.checkPassword = async function(password: string) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

// statics to find the user by email
UserSchema.statics.findByCredentials =
  async (email: string, password:string) => {
    const user = await User.findOne({email});
    if (!user) {
      throw new Error('Cannot find user');
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      throw new Error('Cannot find user');
    }
    return user;
  };

UserSchema.statics.findByCredentialsAndDelete =
  async (email: string, password:string) => {
    const user = await User.findOne({email});
    if (!user) {
      throw new Error('Cannot delete your account');
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      throw new Error('Cannot delete your account');
    }
    try {
      await User.deleteOne({email});
    } catch (error) {
      throw new Error('Cannot delete your account');
    }
  };

const User = mongoose.model<IUserDocument, UserModel>('UserSchema', UserSchema);

export {User};
