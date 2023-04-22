import mongoose from 'mongoose';

export const connectMongoDb = (url: string) => {
  mongoose.set('strictQuery', true);
  return mongoose.connect(url);
};