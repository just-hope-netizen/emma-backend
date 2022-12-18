import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookedSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    hotelName: {
      type: String,
    },

    rooms: {
      type: Array
    },

    totalAmount: {
      type: Number,
    },
    startDate: {
      type: String,
    },
    tomDate: {
      type: String,
    },
    numAdult: {
      type: String,
    },
    night: {
      type: String,
    },
  },
  { timestamps: true }
);

const Booked = mongoose.model('Booked', bookedSchema);
export default Booked;
