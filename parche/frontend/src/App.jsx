import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Menu from './components/menu'
import Clientes from './components/clientes'
import Productos from './components/productos'
import Ventas from './components/ventas'
import './App.css'
 
function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </BrowserRouter>
  )
}
 
export default App