import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


//Middleware para el token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
}

//Obtener carrito del usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('item.product');
    if (!cart) {
      return res.status(404).json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
})

//Agregar producto al carrito
router.post('/add', verifyToken, async (req, res) => {

  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if(!product) return res.status(404).json({ message: 'Producto no encontrado' });

    let cart = await Cart.findOne({ user: req.user._id });

    if(!cart ) {
      cart = new Cart({ user: req.user._id, item: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    )

    if(existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Producto agregado al carrito', cart });

  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito' });
  }
})

// Actualizar cantidad de un producto en el carrito
router.put('/update', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    )
    if (!item) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: 'Cantidad actualizada', cart });

  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
})


// Eliminar un producto del carrito
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    )
    await cart.save();
    res.status(200).json({ message: 'Producto eliminado del carrito', cart });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
  }
})

// Vaciar el carrito
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
})

export default router;
