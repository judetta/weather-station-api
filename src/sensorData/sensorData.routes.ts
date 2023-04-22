import { Router } from 'express';
import { getLatest, getPeriod, getTemperatures } from './sensorData.controller';

export const router = Router();

router.route('/temperatures').get(getTemperatures);
router.route('/latest/:tag').get(getLatest);
router.route('/history/:tag').get(getPeriod);