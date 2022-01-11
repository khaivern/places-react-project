import { Router } from 'express';
import { body } from 'express-validator';
import * as placeController from '../controllers/place';
import isAuth from '../middlewares/is-auth';

const router = Router();

router.post(
  '/place',
  isAuth,
  [
    body('title', 'Invalid Place Title').trim().notEmpty(),
    body('description', 'Invalid Place Description')
      .trim()
      .isLength({ min: 4 }),
    body('address', 'Invalid Place Address').trim().notEmpty(),
  ],
  placeController.createPlace
);

router.get('/places/:uId', placeController.getUserPlaces);

router.get('/place/:pId', isAuth, placeController.getPlace);

router.put(
  '/place/:pId',
  isAuth,
  [
    body('title', 'Invalid Title').trim().notEmpty(),
    body('description', 'Invalid Description').trim().isLength({ min: 4 }),
  ],
  placeController.updatePlace
);

router.delete('/place/:pId', isAuth, placeController.deletePlace);

export default router;
