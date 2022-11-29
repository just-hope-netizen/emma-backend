import express from 'express';
const router = express.Router();

import { getUser, postUser, verifyUser } from '../controllers/auth.js';
import { verifyTokenAndAdmin } from './verifyToken.js'

//registeration
router.post('/register', postUser)

//verification
router.get('/verify/:userId/:uniqueString', verifyUser)

//login route
router.post('/login', getUser);

router.post('/token', verifyTokenAndAdmin, async function verify(req, res) {
    res.status(202).json('true') //user is admin
})

export default router;
