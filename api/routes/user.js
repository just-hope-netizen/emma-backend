import express from 'express';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from './verifyToken.js';
import { deleteUser, getUser, getUsers, stats, updateUser } from '../controllers/user.js';
const router = express.Router();

//update user
router.put('/:id', verifyTokenAndAuthorization, updateUser);

//delete user account
router.delete('/:id', verifyTokenAndAuthorization, deleteUser);

// development ***
//get user by admin
router.get('/find/:id', verifyTokenAndAdmin, getUser);

// development ***
//get all user
router.get('/', verifyTokenAndAdmin, getUsers);

// development ***
//get user stat
router.get('/stats', verifyTokenAndAdmin, stats);

export default router;
