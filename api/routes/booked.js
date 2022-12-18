import express from 'express';
import { createBook, getBooked } from '../controllers/booked.js';
const router = express.Router();

//create
router.post('/', createBook);

router.get('/', getBooked);




export default router;
