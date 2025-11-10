import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

//Crear un nuevo pedido
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
})

//Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
})

//Obtener pedidos por usuario especifico
router.get('/user/:userId', async(req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product', 'name price');
    res.status(200).json(orders)
    
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos del usuario' });
  }
})

//Eliminar un perdido
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
})

export default router;