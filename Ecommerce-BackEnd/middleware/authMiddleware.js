import jwt, { decode } from 'jsonwebtoken'

function authMiddleware(req, res, next){
  try {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(404).json({ message: 'Acceso Denegado. Token no proporcionado' })
    }

    const token = authHeader.spli(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()

  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

export default authMiddleware