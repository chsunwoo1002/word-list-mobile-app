import mongoose from 'mongoose';

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'users',
};

const UserWordSchema = new mongoose.Schema({
  word: {type: String, required: true, unique: true},
  examples: {type: [String]},
});

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  favourite: {type: [UserWordSchema], required: true},
  memorized: {type: [UserWordSchema], required: true},
}, opts);

const userModel = mongoose.model('UserSchema', UserSchema);

export {userModel};
