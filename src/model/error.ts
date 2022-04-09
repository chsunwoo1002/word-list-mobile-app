import mongoose from 'mongoose';

const opts = {
  timestamps: true,
  collection: 'db-error',
};

const ErrorSchema = new mongoose.Schema({
  errorCode: {type: Number, required: true},
  errorMessage: {type: String, required: true},
}, opts);

const errorModel = mongoose.model('ErrorSchema', ErrorSchema);

export {errorModel};
