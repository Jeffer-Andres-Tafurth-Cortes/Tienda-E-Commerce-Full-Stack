import { Link } from 'react-router-dom'

function Navbar () {
  return (
    <nav className='bg-white shadow-md p-4 flex justify-between items-center'>
      <Link to='/' className='text-2xl font-bold text-blue-800'>
        E-Shop
      </Link>
      <div className='space-x-6'>
        <Link to='/' className='text-gray-700 hover:text-blue-800'>Inicio</Link>
        <Link to='/products' className='text-gray-700 hover:text-blue-800'>Productos</Link>
        <Link to='/cart' className='text-gray-700 hover:text-blue-800'>Carrito</Link>
        <Link to='/login' className='text-gray-700 hover:text-blue-800'>Iniciar Sesion</Link>
      </div>
    </nav>
  )
}

export default Navbar