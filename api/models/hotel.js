import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true,
  },
  img: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  rooms: [
    {
      img: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        }
      },
      title: {
        type: String,
      },
      price: {
        type: String,
      },
      amountRoom: {
        type: String
      },
      status: {
        type: Boolean,
        default: false
      }

    }

  ]


}, { timestamps: true })

const hotel = mongoose.model('Hotels', hotelSchema);
export default hotel;


