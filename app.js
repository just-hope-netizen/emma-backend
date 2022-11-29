import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import hotelRoute from './api/routes/hotel.js';
// import orderRoute from './api/routes/order.js';
import { get404 } from './api/controllers/error.js';

const app = express();
const Port = process.env.PORT || 2000;

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('db connected');
  })
  .catch((err) => {
    console.log(err);
  });

// allow origin request from the url
app.use(cors());

// parse incoming body payload
app.use(express.json({ limit: '50mb' }));
// parse incoming url payload ++++
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// auth routes
// app.use('/auth', authRoute);


//user routes
// app.use('/users', userRoute);

//products routes
app.use('/hotels', hotelRoute);


//order routes
// app.use('/orders', orderRoute);


app.use(get404);

app.listen(Port, console.log('server started at port 2000')
);


