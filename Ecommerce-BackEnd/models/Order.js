import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  items: [
    {product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: Number }
  ],
  total: Number,
  status: { type:String, default: 'pending' }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

export default Order