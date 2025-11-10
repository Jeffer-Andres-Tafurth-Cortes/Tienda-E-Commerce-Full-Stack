import express from 'express'
import Product from '../models/Product.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

//Middleware para verificar Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if(!token) return res.status(401).json({ message: 'Acceso Denegado' })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (erro) {
    res.status(400).json({ message: 'Token no valido' })
  }
}

//Middleware para simular admin
const verifyAdmin = (req, res, next) => {
  if(req,user.email !== "admin@example.com")
  return res.status(403).json({ message: 'Solo el Admin puede hacer esto' })
  next()
}

//Crear producto (solo admin)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body)
    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error })
  }
})

//Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error })
  }
})

//Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if(!product) 
      return res.status(404).json({ message: 'Producto no encontrado' })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error })
  }
})

//Actualizar producto (solo admin)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true })
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error })
  }
})

//Eliminar producto (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error })
  }
})

export default router