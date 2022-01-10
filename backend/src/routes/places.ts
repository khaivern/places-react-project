import { Router } from 'express';

import * as placeController from '../controllers/place';

const router = Router();

router.post('/place', placeController.createPlace);

export default router;
