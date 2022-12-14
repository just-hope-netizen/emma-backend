import express from 'express';
import {
  verifyTokenAndAdmin,
} from './verifyToken.js';
import {
  allHotels,
  createHotel, createRoom, getHotel, getHotels
} from '../controllers/hotel.js';

const router = express.Router();


//create
router.post('/', createHotel);

router.post('/room', createRoom);

//update
// router.put('/:id', verifyTokenAndAdmin,  updateProduct);

//delete
// router.delete('/:id', verifyTokenAndAdmin, deleteProduct);

//get product
router.get('/find', getHotels);

//get  products
router.get('/', getHotel);

//get  products
router.get('/all', allHotels);

export default router;
