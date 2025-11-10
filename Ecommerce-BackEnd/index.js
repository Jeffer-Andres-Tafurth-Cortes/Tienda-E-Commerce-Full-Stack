import dotenv from 'dotenv';
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.js';
import productsRoutes from "./routes/products.js";
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express()


// Seccion de los Middlewares
app.use(express.json())
app.use(cors())


// Conexion con la base de datos MongoDB
const connnecDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}

// Conexion con la rutas
app.use('/api/auth', authRoutes)

app.use('/api/products', productsRoutes)

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes)

// Puerto
const PORT = process.env.PORT || 4000

connnecDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`))
})