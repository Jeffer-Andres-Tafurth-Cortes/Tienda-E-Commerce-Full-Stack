import { useEffect, useState } from 'react'

function Products() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = 'http://localhost:4000/api/products'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p className='text-center mt-10'>Cargando productos ...</p>

  return (
    <div className='p-8'>
      <h2 className='text-3xl font-bold mb-6 text-center'>🛒 Nuestros Productos</h2>

      {products.length === 0 ? (
      <p className='text-center text-gray-600'>No hay productos disponibles</p>
      ):(
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <div key={product.id} className='bg-white shadow-lg rounded-xl p-4 flex flex-col items-center hover:shadow-2xl transition'>
              <img src={product.image} alt={product.title} className='w-40 h-40 object-cover rounded-md mb-4' />
              <h3 className='text-lg font-semibold'>{product.title}</h3>
              <p className='text-gray-600 text-sm mt-2'>{product.description}</p>
              <p className='text-gray-600 text-sm mt-3'>${product.price}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      )}

    </div>


  )
}

export default Products