import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Ruta para obtener el usuario actual
router.get('/me', authMiddleware, async(req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    if(!user){
      return res.status(400).json({ message: 'Usuario no encontrado' })
    }
    res.json(user)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
})


// Registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { name, email, password} = req.body

    // Verificar si el usuario ya existe en la plataforma
    const existingUser = await User.findOne({ email })
    if(existingUser){
      return res.status(400).json({ message: 'El usuario ya existe' })
    }


    // Encrptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      passwordHash
    })
    await newUser.save()

    res.status(201).json({ message: 'Usuario registrado correctamente' })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})


// Login de los usuarios que ya existen
router.post('/login', async(req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario existente
    const user = await User.findOne({email})

    if(!user){
      return res.status(404).json({message: 'Este usuario no exite en el sistema' })
    }

    // Comparar contraseñas
    const isPasswordValid = bcrypt.compare(password, user.passwordHash)
    if(!isPasswordValid) {
      return res.status(401).json({message: 'Contraseña incorrecta'})
    }


    // Crear Token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d'}
    )

    res.json({
      message: 'Login Exitoso',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })

  } catch (error) {
    console.log(error)
    res.status(500).json
    ({ message: 'Error al ingresar, intente mas tarde' })
  }
})

export default router