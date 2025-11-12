import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"


function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>

        {/* Definicion de las rutas */}
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products' element={<Products />} />
        <Route path='/cart' element={<Cart />}  />
        <Route path='/login' element={<Login />}  />
        <Route path='/register' element={<Register />}  />

      </Routes>
    </div>
  )
}

export default App
