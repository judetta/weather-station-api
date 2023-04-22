import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  tag: String,
  entryTime: Date,
  measureTime: Date,
  data: {
    dataFormat: Number,
    rssi: Number,
    temperature: Number,
    humidity: Number,
    pressure: Number,
    accelerationX: Number,
    accelerationY: Number,
    accelerationZ: Number,
    battery: Number,
    txPower: Number,
    movementCounter: Number,
    measurementSequenceNumber: Number,
    mac: String
  }
});

export const SensorData = mongoose.model('SensorData', sensorDataSchema, 'sensordata');