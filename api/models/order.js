import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    products: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    }],

    amount: {
      type: Number,
      required: true
    },
    address: {
      type: Object,
      required: true,
      status: {
        type: String,
        default: 'pending'
      }

    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
