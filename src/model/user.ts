import mongoose from 'mongoose';

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'users',
};

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
}, opts);

const loginModel = mongoose.model('UserSchema', UserSchema);

export {loginModel};
