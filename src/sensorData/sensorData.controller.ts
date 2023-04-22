import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { tagTypes } from '../utils/tagTypes';
import { SensorData } from './sensorData.model';

type temperatureResult = {
  tag: string,
  temperature: number | null,
  timestamp: Date | null
};

const projection = {
  // do not return metadata fields like RuuviTag's mac address
  'data.mac': 0,
  'data.rssi': 0,
  'data.dataFormat': 0,
  'data.measurementSequenceNumber': 0,
  'data.txPower': 0,
  // do not return movement data
  'data.accelerationX': 0,
  'data.accelerationY': 0,
  'data.accelerationZ': 0,
  'data.movementCounter': 0,
};

/**Get the latest temperatures from all sensors */
export const getTemperatures = async (req: Request, res: Response) => {
  const temperatures: temperatureResult[] = [];
  for (const tag of tagTypes) {
    const entry = await SensorData.findOne({ tag: tag }, {}, { sort: { 'measureTime': 'desc' } });
    const temp = entry?.data?.temperature ?? null;
    const timestamp = entry?.measureTime ?? null;
    temperatures.push({ tag: tag, temperature: temp, timestamp: timestamp });
  }
  res.status(StatusCodes.OK).json({ success: true, data: temperatures });
};

/**Get all the latest sensor data from single sensor */
export const getLatest = async (req: Request, res: Response) => {
  const { tag } = req.params;

  if (isExistingTag(tag, res)) {
    const entry = await SensorData.findOne(
      { tag: tag },
      projection,
      { sort: { 'measureTime': 'desc' } }
    );
    return res.status(StatusCodes.OK).json({
      success: true,
      tag: tag,
      timestamp: entry?.measureTime,
      data: entry?.data
    });
  }
};

/**Get historical sensor data for defined period for single sensor */
export const getPeriod = async (req: Request, res: Response) => {
  const { tag } = req.params;
  const { from, to } = req.query;
  
  if (isExistingTag(tag, res)) {
    if (!from || !to) {
      return res.status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: 'Please provide from and to dates for period' });
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string).setUTCHours(23, 59, 59, 999);

    const entries = await SensorData.find({
      tag: tag,
      measureTime: { $gte: fromDate, $lte: toDate }
    }, projection);

    res.status(StatusCodes.OK).json({ success: true, data: entries });
  }

};

function isExistingTag(tag: string, res: Response): boolean {
  if (!tagTypes.includes(tag as string)) {
    res.status(StatusCodes.NOT_FOUND).json({ success: false, msg: 'Unknown tag' });
    return false;
  }

  return true;
}