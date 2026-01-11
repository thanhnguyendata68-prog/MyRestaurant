import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
