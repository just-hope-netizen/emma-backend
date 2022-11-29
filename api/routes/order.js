import express from 'express';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} from './verifyToken.js';
import { createOrder, deleteOrder, getIncome, getOrder, getOrders, updateOrder } from '../controllers/order.js';
const router = express.Router();

//create
router.post('/', verifyToken, createOrder);

// development ***
//update
router.put('/:id', verifyTokenAndAdmin, updateOrder);

//delete
router.delete('/:id/:userId', verifyTokenAndAuthorization, deleteOrder);

//get  order
router.get('/find/:userId', verifyTokenAndAuthorization, getOrder);

//get all orders
router.get('/', verifyTokenAndAdmin, getOrders);

// development ***
// get income
router.get('/income', verifyTokenAndAdmin, getIncome)

export default router;
